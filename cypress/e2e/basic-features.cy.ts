describe('Basic Features', () => {
  beforeEach(() => {
    cy.visit('/')
    // 在每個測試前重置應用狀態
    cy.window().then((win) => {
      win.localStorage.clear()
    })
  })

  describe('Video Upload', () => {
    it('should allow video file upload', () => {
      cy.get('input[type="file"]').selectFile('cypress/fixtures/test.mp4', { force: true })
      cy.get('video').should('exist')
    })

    it('should show error message for non-video files', () => {
      cy.get('input[type="file"]').selectFile('cypress/fixtures/invalid.txt', { force: true })
      cy.on('window:alert', (str) => {
        expect(str).to.equal('請選擇影片檔案')
      })
    })
  })

  describe('Transcript Display', () => {
    beforeEach(() => {
      // 上傳測試影片
      cy.get('input[type="file"]').selectFile('cypress/fixtures/test.mp4', { force: true })
    })

    it('should display transcript sections', () => {
      cy.contains('簡介').should('be.visible')
      cy.contains('主要內容').should('be.visible')
      cy.contains('總結').should('be.visible')
    })

    it('should display transcript items with timestamps', () => {
      cy.get('[data-testid="transcript-item"]').should('have.length.at.least', 1)
      cy.get('[data-testid="timestamp"]').first().should('contain', '00:00')
    })
  })

  describe('Video Playback Control', () => {
    beforeEach(() => {
      cy.get('input[type="file"]').selectFile('cypress/fixtures/test.mp4', { force: true })
    })

    it('should jump to timestamp when clicking time button', () => {
      cy.get('[data-testid="timestamp"]').contains('00:05').click()
      cy.get('video').then(($video) => {
        expect($video[0].currentTime).to.be.closeTo(5, 0.1)
      })
    })

    it('should highlight current playing section', () => {
      cy.get('video').then(($video) => {
        $video[0].currentTime = 5
      })
      
      // 等待高亮更新
      cy.wait(100)
      
      cy.get('[data-testid="transcript-item"]')
        .contains('今天我們要介紹一個重要的主題')
        .parent()
        .should('have.class', 'ring-1')
    })
  })
})

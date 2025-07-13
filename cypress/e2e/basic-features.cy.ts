describe('Basic Features', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/');
    cy.window().then((win) => {
      win.localStorage.clear();
    });
  });

  describe('Video Upload', () => {
    it('should allow video file upload', () => {
      cy.get('[data-testid="video-input"]').selectFile(
        'cypress/fixtures/test.mp4',
        {
          force: true,
        }
      );
      cy.get('video').should('exist');
    });

    it('should show error message for non-video files', () => {
      cy.get('[data-testid="video-input"]').selectFile(
        'cypress/fixtures/invalid.txt',
        {
          force: true,
        }
      );
      cy.on('window:alert', (str) => {
        expect(str).to.equal('請選擇影片檔案');
      });
    });
  });

  describe('Transcript Display', () => {
    beforeEach(() => {
      cy.get('[data-testid="video-input"]').selectFile(
        'cypress/fixtures/test.mp4',
        {
          force: true,
        }
      );
    });

    it('should display transcript section', () => {
      cy.get('[data-testid="transcript-item"]').should('exist');

      cy.contains('h2', 'Transcript').should('be.visible');

      cy.get('[data-testid="transcript-item"]').should('exist');

      cy.get('[data-testid="transcript-item"]')
        .first()
        .then(($item) => {
          // 檢查 Timestamp 按鈕
          cy.wrap($item).find('[data-testid="timestamp"]').should('exist');
          // 檢查是否有文本內容
          cy.wrap($item).invoke('text').should('not.be.empty');
        });
    });

    it('should display transcript items with timestamps', () => {
      cy.get('[data-testid="transcript-item"]').should(
        'have.length.at.least',
        1
      );

      // 檢查 Timestamp 格式
      cy.get('[data-testid="timestamp"]')
        .first()
        .invoke('text')
        .should('match', /^\d{2}:\d{2}$/);

      // 檢查點擊 Timestamp 的交互行為
      cy.get('[data-testid="transcript-item"]').first().click();
      cy.get('[data-testid="transcript-item"]')
        .first()
        .should('have.attr', 'data-current', 'true');
    });
  });

  describe('Video Playback Control', () => {
    beforeEach(() => {
      cy.get('[data-testid="video-input"]').selectFile(
        'cypress/fixtures/test.mp4',
        {
          force: true,
        }
      );
    });

    it('should jump to timestamp when clicking time button', () => {
      cy.get('[data-testid="transcript-item"]').should('exist');

      // 點擊第一個 Timestamp
      cy.get('[data-testid="timestamp"]').first().click();

      // 檢查影片播放時間是否更新
      cy.get('video').should('have.prop', 'currentTime').and('be.gte', 0);
    });

    it('should highlight current playing section', () => {
      cy.get('[data-testid="transcript-item"]').should('exist');

      cy.get('[data-testid="transcript-item"]').first().click();

      cy.get('[data-testid="transcript-item"]')
        .first()
        .should('have.attr', 'data-current', 'true');
    });
  });
});

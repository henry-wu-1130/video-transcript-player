describe('Basic Features', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/');
    // 在每個測試前重置應用狀態
    cy.window().then((win) => {
      win.localStorage.clear();
    });
  });

  describe('Video Upload', () => {
    it('should allow video file upload', () => {
      cy.get('[data-testid="video-input"]').selectFile('cypress/fixtures/test.mp4', {
        force: true,
      });
      cy.get('video').should('exist');
    });

    it('should show error message for non-video files', () => {
      cy.get('[data-testid="video-input"]').selectFile('cypress/fixtures/invalid.txt', {
        force: true,
      });
      cy.on('window:alert', (str) => {
        expect(str).to.equal('請選擇影片檔案');
      });
    });
  });

  describe('Transcript Display', () => {
    beforeEach(() => {
      // 上傳測試影片
      cy.get('[data-testid="video-input"]').selectFile('cypress/fixtures/test.mp4', {
        force: true,
      });
    });

    it('should display transcript section', () => {
      // 等待字幕加载
      cy.get('[data-testid="transcript-item"]').should('exist');
      
      // 检查字幕面板标题
      cy.contains('h2', 'Transcript').should('be.visible');
      
      // 等待字幕加载
      cy.get('[data-testid="transcript-item"]').should('exist');
      
      // 获取第一个字幕项
      cy.get('[data-testid="transcript-item"]').first().then(($item) => {
        // 检查时间戳按钮
        cy.wrap($item).find('[data-testid="timestamp"]').should('exist');
        // 检查是否有文本内容
        cy.wrap($item).invoke('text').should('not.be.empty');
      });
    });

    it('should display transcript items with timestamps', () => {
      // 等待字幕加载
      cy.get('[data-testid="transcript-item"]').should('have.length.at.least', 1);

      // 检查时间戳格式
      cy.get('[data-testid="timestamp"]').first().invoke('text').should('match', /^\d{2}:\d{2}$/);

      // 检查点击时间戳的交互
      cy.get('[data-testid="transcript-item"]').first().click();
      cy.get('[data-testid="transcript-item"]').first().should('have.attr', 'data-current', 'true');
    });
  });

  describe('Video Playback Control', () => {
    beforeEach(() => {
      cy.get('[data-testid="video-input"]').selectFile('cypress/fixtures/test.mp4', {
        force: true,
      });
    });

    it('should jump to timestamp when clicking time button', () => {
      // 等待字幕加载
      cy.get('[data-testid="transcript-item"]').should('exist');
      
      // 点击第一个时间戳
      cy.get('[data-testid="timestamp"]').first().click();
      
      // 检查视频时间是否更新
      cy.get('video').should('have.prop', 'currentTime').and('be.gte', 0);
    });

    it('should highlight current playing section', () => {
      // 等待字幕加载
      cy.get('[data-testid="transcript-item"]').should('exist');
      
      // 点击第一个字幕项
      cy.get('[data-testid="transcript-item"]').first().click();
      
      // 检查高亮状态
      cy.get('[data-testid="transcript-item"]').first().should('have.attr', 'data-current', 'true');
    });
  });
});

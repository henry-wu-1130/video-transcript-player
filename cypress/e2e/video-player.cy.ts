/// <reference types="cypress" />

describe('Video Player', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/');
    // 使用正确的 data-testid 选择器
    cy.get('[data-testid="video-input"]').selectFile(
      'cypress/fixtures/test.mp4',
      { force: true }
    );
    // 等待视频加载
    cy.waitForVideoLoad();
  });

  it('should render video player with controls', () => {
    // 检查视频容器
    cy.get('[data-testid="video-container"]').should('exist');

    // 等待视频加载完成，确保 duration > 0
    cy.get('video').should('have.prop', 'duration').and('be.gt', 0);

    // 检查播放/暂停按钮
    cy.get('button').find('svg').should('exist');

    // 检查时间轴
    cy.get('.bg-gray-800[role="button"]').should('exist');
  });

  it('should toggle play/pause when clicking video container', () => {
    cy.get('[data-testid="video-container"]').click();
    // 由于视频元素的 paused 属性是只读的，我们需要通过 DOM 来检查
    cy.get('video').then(($video) => {
      const video = $video[0] as HTMLVideoElement;
      expect(video.paused).to.be.false;
    });

    cy.get('[data-testid="video-container"]').click();
    cy.get('video').then(($video) => {
      const video = $video[0] as HTMLVideoElement;
      expect(video.paused).to.be.true;
    });
  });

  it('should update current time when clicking timeline', () => {
    // 等待视频加载完成，确保 duration > 0
    cy.get('video').should('have.prop', 'duration').and('be.gt', 0);

    // 点击时间轴
    cy.get('.bg-gray-800[role="button"]').click('center');

    // 检查视频时间是否更新
    cy.get('video').should('have.prop', 'currentTime').and('be.gt', 0);
  });

  it('should show captions when playing video', () => {
    // 等待字幕加载
    cy.get('[data-testid="transcript-item"]').should('exist');

    // 开始播放视频
    cy.get('[data-testid="video-container"]').click();

    // 等待字幕显示
    cy.get('.text-white').should('exist').and('not.be.empty');
  });

  it('should update transcript section when video plays', () => {
    // 等待字幕加载
    cy.get('[data-testid="transcript-item"]').should('exist');

    // 开始播放视频
    cy.get('[data-testid="video-container"]').click();

    // 检查当前高亮的字幕项
    cy.get('[data-testid="transcript-item"][data-current="true"]').should('exist');
  });
});

/// <reference types="cypress" />

describe('Video Player', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/');
    cy.get('[data-testid="video-input"]').selectFile(
      'cypress/fixtures/test.mp4',
      { force: true }
    );
    cy.waitForVideoLoad();
  });

  it('should render video player with controls', () => {
    cy.get('[data-testid="video-container"]').should('exist');

    cy.get('video').should('have.prop', 'duration').and('be.gt', 0);

    cy.get('button').find('svg').should('exist');

    cy.get('.bg-gray-800[role="button"]').should('exist');
  });

  it('should toggle play/pause when clicking video container', () => {
    cy.get('[data-testid="video-container"]').click();

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
    cy.get('video').should('have.prop', 'duration').and('be.gt', 0);

    cy.get('.bg-gray-800[role="button"]').click('center');

    cy.get('video').should('have.prop', 'currentTime').and('be.gt', 0);
  });

  it('should show captions when playing video', () => {
    cy.get('[data-testid="transcript-item"]').should('exist');

    cy.get('[data-testid="video-container"]').click();

    cy.get('.text-white').should('exist').and('not.be.empty');
  });

  it('should update transcript section when video plays', () => {
    cy.get('[data-testid="transcript-item"]').should('exist');

    cy.get('[data-testid="video-container"]').click();

    cy.get('[data-testid="transcript-item"][data-current="true"]').should(
      'exist'
    );
  });
});

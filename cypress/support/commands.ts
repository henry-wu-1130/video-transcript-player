/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
import '@testing-library/cypress';

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      /**
       * 等待视频加载完成
       */
      waitForVideoLoad(): Chainable<JQuery<HTMLVideoElement>>
      /**
       * 设置视频当前时间
       */
      setVideoTime(time: number): Chainable<JQuery<HTMLVideoElement>>
      /**
       * 检查视频是否在播放
       */
      isVideoPlaying(): Chainable<boolean>
    }
  }
}

Cypress.Commands.add('waitForVideoLoad', () => {
  return cy.get('video').should('exist').then<JQuery<HTMLVideoElement>>($video => {
    return new Cypress.Promise(resolve => {
      const video = $video[0];
      if (video.readyState >= 4) {
        resolve($video);
      } else {
        video.addEventListener('canplay', () => {
          resolve($video);
        });
      }
    });
  });
});

Cypress.Commands.add('setVideoTime', (time: number) => {
  return cy.get('video').then<JQuery<HTMLVideoElement>>($video => {
    const video = $video[0];
    video.currentTime = time;
    return $video;
  });
});

Cypress.Commands.add('isVideoPlaying', () => {
  return cy.get('video').then<boolean>($video => {
    const video = $video[0] as HTMLVideoElement;
    return !video.paused;
  });
});
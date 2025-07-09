// cypress/support/commands.d.ts

declare namespace Cypress {
  interface Chainable {
    waitForVideoLoad(): Cypress.Chainable<JQuery<HTMLVideoElement>>;
    setVideoTime(time: number): Cypress.Chainable<JQuery<HTMLVideoElement>>;
    isVideoPlaying(): Cypress.Chainable<boolean>;
  }
}

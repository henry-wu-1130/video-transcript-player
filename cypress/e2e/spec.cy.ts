describe('Video Transcript Player', () => {
  it('loads the application', () => {
    cy.visit('http://localhost:5173/');
    cy.contains('Video Transcript Player').should('be.visible');
  });
});

describe('Video Transcript Player', () => {
  it('loads the application', () => {
    cy.visit('/')
    cy.contains('上傳影片').should('be.visible')
  })
})

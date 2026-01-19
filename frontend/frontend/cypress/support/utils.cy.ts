export const loginUser = (user: { username: string; password: string}) => {
  cy.visit('/')
  cy.navigate('nav-link-login', '/login')

  cy.getByData('login-input-username')
    .should('be.visible')
    .type(user.username)

  cy.getByData('login-input-password')
    .should('be.visible')
    .type(user.password)

  cy.navigate('login-submit', '/')
  cy.getByData('nav-link-cart').should('be.visible')
}

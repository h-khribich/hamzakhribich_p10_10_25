import * as userData from "../fixtures/user.json";
const user = userData;

describe('Smoke tests', () => {
  it('verify login inputs and buttons', () => {
    cy.visit('/login').then(() => cy.url().should('include', '/login'))

    cy.getByData("login-input-username").should('be.visible')
    cy.getByData("login-input-password").should('be.visible')
    cy.getByData("login-submit").should('be.visible')
  })

  it('verify add to cart button when logged in', () => {
      // Log in
    cy.request('POST', 'http://localhost:8081/login', {
      username: user.username,
      password: user.password
    }).then((res) => {
      expect(res.status).to.eq(200)
      const token = res.body.token

      cy.visit('/products', {
        onBeforeLoad(win) {
          win.localStorage.setItem('token', token)
        }
      }).then(() => cy.url().should('include', '/products'))

      // Verify add to cart button
      cy.getByData("product").first().as('firstProduct')
      cy.get('@firstProduct')
        .find('[data-cy="product-link"]')
        .should('be.visible')
    })
  })
})

import { log } from "console";
import * as userData from "../fixtures/user.json";
const user = userData;

describe('Functional Tests', () => {
  it('Connexion', () => {
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
  })

  it('Affichage des produits', () => {
    const productList = '.list-products > [data-cy="product"]'

    cy.visit('/products').then(() => {
      cy.get(productList).then((products) => {
        const productCount = products.length

        for(let i = 0; i < productCount; i++) {
            // Getting fresh element reference
          cy.get(productList).eq(i).within(() => {
            cy.getByData('product-picture').should('be.visible')

            cy.getByData('product-ingredients')
              .should('be.visible')
              .invoke('text')
              .should('have.length.gt', 0)

            cy.getByData('product-link')
              .should('be.visible')
              .invoke('text')
              .should('have.length.gt', 0)

              // Click must be last to avoid detaching the element
            cy.getByData('product-link').click()
          })

            // Verify navigation to product detail page
          cy.url().should('include', '/products/')

          cy.getByData('detail-product-img').should('be.visible')

          cy.getByData('detail-product-description')
            .should('be.visible')
            .invoke('text')
            .should('have.length.gt', 0)

          cy.getByData('detail-product-price')
            .should('be.visible')
            .invoke('text')
            .should('have.length.gt', 0)

          cy.getByData('detail-product-stock')
            .should('be.visible')
            .invoke('text')
            .should('have.length.gt', 0)

          cy.go('back')

          cy.get(productList).should('be.visible')
        }
      })
    })
  })
})

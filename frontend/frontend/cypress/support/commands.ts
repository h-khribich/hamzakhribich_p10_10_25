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
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
export {}

  // Get element by data-cy attribute
Cypress.Commands.add('getByData', (selector: string) => cy.get(`[data-cy="${selector}"]`))

  // Ensure navigation has occured before proceeding
Cypress.Commands.add('navigate', (selector: string, pageUrl: string) => {
  cy.getByData(selector).should('be.visible').click().then(() => {
    cy.url().should('include', pageUrl)
  })
})

declare global {
  namespace Cypress {
    interface Chainable {
      getByData(el: string): Chainable<JQuery<HTMLElement>>
      navigate(selector: string, pageUrl: string): Chainable<void>
    }
  }
}


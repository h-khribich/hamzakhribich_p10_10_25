import { loginUser } from 'cypress/support/utils.cy';
import * as userData from '../fixtures/user.json';
const user = userData;

describe('Functional Tests', () => {
  it('Connexion', () => loginUser(user));

  it('Panier', () => {
    cy.intercept({
      method: 'PUT',
      url: `${Cypress.env('API_URL')}/orders/add`,
    }).as('APICheckAddToCart');

    loginUser(user);
    cy.navigate('nav-link-products', '/products');

    cy.get('.list-products > [data-cy="product"]')
      .first()
      .find('[data-cy="product-link"]')
      .click();

    // Extract stock from detail product page
    cy.getByData('detail-product-stock')
      .wait(500)
      .invoke('text')
      .then((text) => {
        const stock: number = Number(text.split(' ')[0]);

        cy.wrap(stock).as('initialStock');

        // Extract quantity and determine button state
        cy.getByData('detail-product-quantity')
          .invoke('val')
          .then((val) => {
            const quantityValue = Number(val);
            const shouldBeDisabled =
              stock < 1 || quantityValue < 1 || quantityValue > 20;

            cy.getByData('detail-product-add').then((btn) => {
              const isDisabled = btn.is(':disabled');

              if (shouldBeDisabled) {
                if (!isDisabled) {
                  throw new Error(
                    'Le bouton "Ajouter au panier" devrait être désactivé mais ne l\'est pas.',
                  );
                }
              } else {
                expect(isDisabled).to.be.false;

                cy.url().as('previousUrl');

                // Add to cart
                cy.getByData('detail-product-quantity').clear().type('2');
                cy.getByData('detail-product-add').click();

                // API verification
                cy.wait('@APICheckAddToCart')
                  .its('response.statusCode')
                  .should('eq', 200);
                cy.url().should('include', '/cart');

                // Forcing typescript to understand the type
                cy.get('@previousUrl').then((url) => {
                  cy.visit(url as unknown as string);
                });

                cy.wait(500);

                // Verify stock update
                cy.getByData('detail-product-stock')
                  .wait(500)
                  .invoke('text')
                  .then((text) => {
                    cy.get('@initialStock').then((initialStock: any) => {
                      const updatedStock = Number(text.split(' ')[0]);
                      const expectedStock = initialStock - 2;

                      cy.log(`Stock initial: ${initialStock}`);
                      cy.log(`Stock attendu: ${expectedStock}`);
                      cy.log(`Stock actuel: ${updatedStock}`);

                      expect(updatedStock).to.eq(expectedStock);
                    });
                  });
              }
            });
          });
      });
  });
});

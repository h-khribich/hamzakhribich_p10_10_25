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

    // Extraction du stock dans la page de détail du produit
    cy.getByData('detail-product-stock')
      .wait(500)
      .invoke('text')
      .then((text) => {
        const stock: number = Number(text.split(' ')[0]);

        cy.wrap(stock).as('initialStock');

        // Extraction de la valeur actuelle de la quantité
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

                // Ajout au panier
                cy.getByData('detail-product-quantity').clear().type('2');
                cy.getByData('detail-product-add').click();

                // Vérification API
                cy.wait('@APICheckAddToCart')
                  .its('response.statusCode')
                  .should('eq', 200);
                cy.url().should('include', '/cart');

                // Forcer la conversion TypeScript
                cy.get('@previousUrl').then((url) => {
                  cy.visit(url as unknown as string);
                });

                cy.wait(500);

                // Vérification du stock mis à jour
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

/*
product = cy.get('.list-products > [data-cy="product"]')
                .first()
                .find('[data-cy="product-link"]')

      // Attendre le chargement complet de la page
    cy.document().its('readyState').should('eq', 'complete')

    product.click().then(() => {

      quantity = cy.getByData('detail-product-quantity')
      let quantityValue = quantity.invoke('val')

      // Disponibilité du produit
      cy.getByData('detail-product-stock').should('be.visible')
      stock = cy.getByData('detail-product-stock')
                .invoke('text')
                .then((text) => Number(text.split(" ")[0]))

      originalStock = Number(stock)

      // Ne pas ajouter le produit au panier si stock insuffisant ou quantité invalide
      if (Number(stock) < 1 || Number(quantityValue) > 20 || Number(quantityValue) < 1) {
        cy.getByData('detail-product-add').should('be.disabled')
      } else {
        quantity.type('2').then(() => {
          cy.getByData('detail-product-add').click()

          // Vérification de l'ajout au panier via l'API
          cy.wait('@APICheckAddToCart').then((interception) => {
            expect(interception.response?.statusCode).to.eq(200)
          }).then(() => {
            cy.url().should('include', '/#/cart')
            cy.go('back')
            cy.url().should('include', '/#/products')
            expect(Number(stock)).to.be.eq(originalStock - 2)
          })
        })
      }
    })
*/

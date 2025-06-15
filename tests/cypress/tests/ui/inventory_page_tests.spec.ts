import LoginPage from '../../pages/LoginPage';
import InventoryPage from '../../pages/InventoryPage';

const a11yOptions = { runOnly: ['wcag2a', 'wcag2aa'] };

describe('Inventory Page Test Suite', () => {
  before(() => {
    LoginPage.createSession();
  });

  it(
    'should display products in the inventory page',
    { tags: ['@smoke', '@inventory-page'] },
    () => {
      InventoryPage.checkPageURL(InventoryPage.url);
      InventoryPage.title().should('be.visible');
      InventoryPage.inventoryItems().should('have.length.greaterThan', 0);
    }
  );

  it(
    'should display hamburger menu button and side menu buttons',
    { tags: ['@smoke', '@inventory-page'] },
    () => {
      InventoryPage.hamburgerMenuButton().should('be.visible').click();
      InventoryPage.sideMenu.overlay().should('be.visible');
      InventoryPage.sideMenu.aboutButton().should('be.visible');
      InventoryPage.sideMenu.allItemsButton().should('be.visible');
      InventoryPage.sideMenu.logOutButton().should('be.visible');
      InventoryPage.sideMenu.resetAppStateButton().should('be.visible');
      InventoryPage.sideMenu.closeButton().should('be.visible').click();
      InventoryPage.sideMenu.overlay().should('not.be.visible');
    }
  );

  it('should display filter options', { tags: ['@smoke', '@inventory-page'] }, () => {
    const filterOptions = [
      'Name (A to Z)',
      'Name (Z to A)',
      'Price (low to high)',
      'Price (high to low)',
    ];
    InventoryPage.filterButton().should('be.visible');
    InventoryPage.filterButton().click();
    InventoryPage.filterSelector().seeOption(filterOptions);
    InventoryPage.filterSelector().select('Price (low to high)');
    InventoryPage.activeFilterOption().should('have.text', 'Price (low to high)');
    InventoryPage.inventoryItems()
      .first()
      .within(() => {
        InventoryPage.inventoryItemNameLabel()
          .invoke('text')
          .then(lowPriceItemName => {
            Cypress.env('lowPriceItemName', lowPriceItemName);
          });
      });
    InventoryPage.filterButton().click();
    InventoryPage.filterSelector().seeOption(filterOptions);
    InventoryPage.filterSelector().select('Price (high to low)');
    InventoryPage.activeFilterOption().should('have.text', 'Price (high to low)');
    InventoryPage.inventoryItems()
      .first()
      .within(() => {
        InventoryPage.inventoryItemNameLabel()
          .invoke('text')
          .then(highPriceItemName => {
            expect(highPriceItemName).not.to.equal(Cypress.env('lowPriceItemName'));
          });
      });
  });

  it('should display social media links in the footer', { tags: ['@inventory-page'] }, () => {
    InventoryPage.footer.section().should('be.visible');
    InventoryPage.footer.twitterLink().should('be.visible');
    InventoryPage.footer.facebookLink().should('be.visible');
    InventoryPage.footer.linkedinLink().should('be.visible');
  });

  it(
    'should adhere to WCAG 2.1 A, AA, Section 508 & best practice standards',
    { tags: ['@inventory-page', '@a11y'] },
    () => {
      cy.injectAxe();
      // Check for accessibility violations with WCAG 2.1 AA standards and skip failing the test even if there are violations (skipFailures: true)
      // The default axe command checks with WCAG 2.1 A and AA standards, Section 508 and best practices
      cy.checkA11y(undefined, undefined, undefined, true);
    }
  );

  it('should adhere to WCAG 2.0 A & AA standards', { tags: ['@inventory-page', '@a11y'] }, () => {
    cy.injectAxe();
    // Check for accessibility violations with WCAG 2.0 A & AA standards and skip failing the test if there are violations (skipFailures: true)
    cy.checkA11y(undefined, a11yOptions, undefined, true);
  });
});

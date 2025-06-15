import LoginPage from '../../pages/LoginPage';
import ProductsPage from '../../pages/ProductsPage';
import CartPage from '../../pages/CartPage';
import CheckoutSuccessPage from '../../pages/CheckoutSuccessPage';
import NavbarComponent from '../../pages/NavbarComponent';
import TestData from '../../testdata/testdata.json';

describe('Checkout Test Suite', () => {
  before(() => {
    LoginPage.createSession();
  });

  beforeEach(() => {
    cy.visit('/');
    ProductsPage.productsPage().should('be.visible');
    ProductsPage.addToCartButton().first().click();
    NavbarComponent.cartLink().click();
    CartPage.cartContainer().should('be.visible');
  });

  it('should complete checkout process successfully', { tags: ['@smoke', '@checkout'] }, () => {
    CartPage.checkoutButton().should('be.visible');
    CartPage.checkoutButton().click();
    CheckoutSuccessPage.checkoutSuccess().should('be.visible');
    CheckoutSuccessPage.successIcon().should('be.visible');
    CheckoutSuccessPage.successTitle().should('contain', 'Thank You For Your Order');
    CheckoutSuccessPage.successMessage().should('be.visible');
    NavbarComponent.cartBadge().should('not.exist');
  });

  it('should navigate back to home from checkout success page', { tags: ['@checkout'] }, () => {
    CartPage.checkoutButton().click();
    CheckoutSuccessPage.checkoutSuccess().should('be.visible');
    CheckoutSuccessPage.backHomeButton().click();
    ProductsPage.productsPage().should('be.visible');
  });
});
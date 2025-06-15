import LoginPage from '../../pages/LoginPage';
import ProductsPage from '../../pages/ProductsPage';
import CartPage from '../../pages/CartPage';
import NavbarComponent from '../../pages/NavbarComponent';
import TestData from '../../testdata/testdata.json';

describe('Navigation Test Suite', () => {
  before(() => {
    LoginPage.createSession();
  });

  beforeEach(() => {
    cy.visit('/');
    ProductsPage.productsPage().should('be.visible');
  });

  it('should navigate to cart page from navbar', { tags: ['@smoke', '@navigation'] }, () => {
    NavbarComponent.cartLink().click();
    CartPage.emptyCart().should('be.visible');
  });

  it('should navigate to products page from brand link', { tags: ['@navigation'] }, () => {
    NavbarComponent.cartLink().click();
    CartPage.emptyCart().should('be.visible');
    NavbarComponent.brandLink().click();
    ProductsPage.productsPage().should('be.visible');
  });

  it('should logout and navigate to login page', { tags: ['@navigation'] }, () => {
    NavbarComponent.logoutButton().click();
    LoginPage.usernameInput().should('be.visible');
    LoginPage.passwordInput().should('be.visible');
    LoginPage.loginButton().should('be.visible');
  });

  it('should navigate between login and register pages', { tags: ['@navigation'] }, () => {
    NavbarComponent.logoutButton().click();
    LoginPage.usernameInput().should('be.visible');
    NavbarComponent.registerLink().click();
    cy.url().should('include', '/register');
    NavbarComponent.loginLink().click();
    cy.url().should('include', '/login');
    LoginPage.usernameInput().should('be.visible');
  });
});
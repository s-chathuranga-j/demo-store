import { BasePage } from '../testbase/BasePage';

class NavbarComponent extends BasePage {
  navbar = () => cy.get('[data-qa="navbar"]');
  navbarBrand = () => cy.get('[data-qa="navbar-brand"]');
  brandLink = () => cy.get('[data-qa="brand-link"]');
  navbarNav = () => cy.get('[data-qa="navbar-nav"]');
  productsLink = () => cy.get('[data-qa="products-link"]');
  cartLink = () => cy.get('[data-qa="cart-link"]');
  cartBadge = () => cy.get('[data-qa="cart-badge"]');
  logoutButton = () => cy.get('[data-qa="logout-button"]');
  loginLink = () => cy.get('[data-qa="login-link"]');
  registerLink = () => cy.get('[data-qa="register-link"]');
}

export default new NavbarComponent();
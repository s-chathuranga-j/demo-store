import { BasePage } from '../testbase/BasePage';
import TestData from '../testdata/testdata.json';
import ProductsPage from "./ProductsPage";

class LoginPage extends BasePage {
  url = '/login';
  loginContainer = () => cy.get('[data-qa="login-container"]');
  loginLogo = () => cy.get('[data-qa="login-logo"]');
  loginForm = () => cy.get('[data-qa="login-form"]');
  usernameInput = () => cy.get('[data-qa="login-username"]');
  passwordInput = () => cy.get('[data-qa="login-password"]');
  loginButton = () => cy.get('[data-qa="login-button"]');
  errorMessage = () => cy.get('[data-qa="login-error"]');
  // For backward compatibility with existing tests
  closeErrorButton = () => cy.get('[data-qa="login-error"]').parent().find('button').first();
  registerLink = () => cy.get('[data-qa="login-register-link"]');
  errorLabel = (message: string) => cy.contains(message);

  public createSession() {
    cy.clearAllSessionStorage();
    cy.clearAllLocalStorage();
    cy.clearAllCookies();
    cy.session('DemoStoreSession', () => {
      cy.visit('/login');
      this.usernameInput().type(TestData.user_credentials.valid_username);
      this.passwordInput().type(TestData.user_credentials.password);
      this.loginButton().click();
      // After successful login, we should be redirected to the products page
      cy.url().should('not.include', '/login');
      // Verify we're on the products page
      ProductsPage.productsPage().should('be.visible');
    });
  }
}

export default new LoginPage();

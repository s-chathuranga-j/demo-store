import { BasePage } from '../testbase/BasePage';

class RegisterPage extends BasePage {
  url = '/register';
  registerContainer = () => cy.get('[data-qa="register-container"]');
  registerLogo = () => cy.get('[data-qa="register-logo"]');
  registerError = () => cy.get('[data-qa="register-error"]');
  registerForm = () => cy.get('[data-qa="register-form"]');
  nameInput = () => cy.get('[data-qa="register-name"]');
  emailInput = () => cy.get('[data-qa="register-email"]');
  passwordInput = () => cy.get('[data-qa="register-password"]');
  registerButton = () => cy.get('[data-qa="register-button"]');
  loginLink = () => cy.get('[data-qa="register-login-link"]');
}

export default new RegisterPage();
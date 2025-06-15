import LoginPage from '../../pages/LoginPage';
import RegisterPage from '../../pages/RegisterPage';
import ProductsPage from '../../pages/ProductsPage';
import NavbarComponent from '../../pages/NavbarComponent';

describe('Registration Test Suite', () => {
  beforeEach(() => {
    cy.visit('/register');
    RegisterPage.registerContainer().should('be.visible');
  });

  it('should display registration form', { tags: ['@smoke', '@registration'] }, () => {
    RegisterPage.registerLogo().should('be.visible');
    RegisterPage.registerForm().should('be.visible');
    RegisterPage.nameInput().should('be.visible');
    RegisterPage.emailInput().should('be.visible');
    RegisterPage.passwordInput().should('be.visible');
    RegisterPage.registerButton().should('be.visible');
    RegisterPage.loginLink().should('be.visible');
  });

  it('should navigate to login page from registration page', { tags: ['@registration'] }, () => {
    RegisterPage.loginLink().contains('Login').click();
    LoginPage.usernameInput().should('be.visible');
    LoginPage.passwordInput().should('be.visible');
    LoginPage.loginButton().should('be.visible');
  });

  it('should register a new user successfully', { tags: ['@registration'] }, () => {
    const randomNum = Math.floor(Math.random() * 10000);
    const name = `Test User ${randomNum}`;
    const email = `testuser${randomNum}@example.com`;
    const password = 'Password123!';
    RegisterPage.nameInput().type(name);
    RegisterPage.emailInput().type(email);
    RegisterPage.passwordInput().type(password);
    RegisterPage.registerButton().click();
    ProductsPage.productsPage().should('be.visible');
    NavbarComponent.logoutButton().should('be.visible');
  });

  it('should display error for invalid registration data', { tags: ['@registration'] }, () => {
    RegisterPage.registerButton().click();
    RegisterPage.registerError().should('be.visible');
  });
});
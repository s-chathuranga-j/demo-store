import LoginPage from '../../pages/LoginPage';
import ProductsPage from '../../pages/ProductsPage';
import NavbarComponent from '../../pages/NavbarComponent';
import TestData from '../../testdata/testdata.json';

describe('Login Flow Test Suite', () => {
  beforeEach(() => {
    LoginPage.openPage('/login');
  });

  it('should login successfully and navigate to products page', { tags: ['@smoke', '@login-flow'] }, () => {
    LoginPage.usernameInput().should('be.visible');
    LoginPage.passwordInput().should('be.visible');
    LoginPage.loginButton().should('be.visible');
    LoginPage.usernameInput().type(TestData.user_credentials.valid_username);
    LoginPage.passwordInput().type(TestData.user_credentials.password);
    LoginPage.loginButton().click();
    ProductsPage.productsPage().should('be.visible');
    NavbarComponent.logoutButton().should('be.visible');
    NavbarComponent.cartLink().should('be.visible');
  });

  it('should display error message for invalid credentials', { tags: ['@login-flow'] }, () => {
    LoginPage.usernameInput().type('invalid_user');
    LoginPage.passwordInput().type('invalid_password');
    LoginPage.loginButton().click();
    LoginPage.errorMessage().should('be.visible');
    LoginPage.errorLabel('Epic sadface: Username and password do not match any user in this service').should('be.visible');
  });

  it('should logout successfully', { tags: ['@login-flow'] }, () => {
    LoginPage.usernameInput().type(TestData.user_credentials.valid_username);
    LoginPage.passwordInput().type(TestData.user_credentials.password);
    LoginPage.loginButton().click();
    ProductsPage.productsPage().should('be.visible');
    NavbarComponent.logoutButton().click();
    LoginPage.usernameInput().should('be.visible');
    LoginPage.passwordInput().should('be.visible');
    LoginPage.loginButton().should('be.visible');
  });
});

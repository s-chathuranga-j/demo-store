import LoginPage from '../../pages/LoginPage';
import TestData from '../../testdata/testdata.json';
import InventoryPage from '../../pages/InventoryPage';

describe('Login Page Test Suite', () => {
  beforeEach(() => {
    LoginPage.openPage('/');
  });

  it(
    'should display the login form and the validation messages',
    { tags: ['@smoke', '@login-page'] },
    () => {
      LoginPage.usernameInput().should('be.visible').and('be.enabled');
      LoginPage.passwordInput().should('be.visible').and('be.enabled');
      LoginPage.loginButton().should('be.visible').and('be.enabled');
      LoginPage.loginButton().click();
      LoginPage.errorLabel('Epic sadface: Username is required').should('be.visible');
      LoginPage.errorMessage().should('be.visible');
      LoginPage.closeErrorButton().click();
      LoginPage.errorMessage().should('not.exist');
    }
  );

  it(
    'should display proper error message for locked out user',
    { tags: ['@smoke', '@login-page'] },
    () => {
      LoginPage.usernameInput().type(TestData.user_credentials.locked_out_user);
      LoginPage.passwordInput().type(TestData.user_credentials.password);
      LoginPage.loginButton().click();
      LoginPage.errorLabel('Epic sadface: Sorry, this user has been locked out.').should(
        'be.visible'
      );
    }
  );

  it(
    'should login successfully with valid credentials',
    { tags: ['@smoke', '@login-page'] },
    () => {
      LoginPage.usernameInput().type(TestData.user_credentials.valid_username);
      LoginPage.passwordInput().type(TestData.user_credentials.password);
      LoginPage.loginButton().click();
      InventoryPage.checkPageURL(InventoryPage.url);
      InventoryPage.title().should('be.visible');
    }
  );
});

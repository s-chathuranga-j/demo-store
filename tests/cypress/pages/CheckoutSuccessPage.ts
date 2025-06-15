import { BasePage } from '../testbase/BasePage';

class CheckoutSuccessPage extends BasePage {
  url = '/checkout-success';
  checkoutSuccess = () => cy.get('[data-qa="checkout-success"]');
  successIcon = () => cy.get('[data-qa="success-icon"]');
  successTitle = () => cy.get('[data-qa="success-title"]');
  successMessage = () => cy.get('[data-qa="success-message"]');
  backHomeButton = () => cy.get('[data-qa="back-home-button"]');
}

export default new CheckoutSuccessPage();
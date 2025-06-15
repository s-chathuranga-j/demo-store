import { BasePage } from '../testbase/BasePage';

class CartPage extends BasePage {
  url = '/cart';
  emptyCart = () => cy.get('[data-qa="empty-cart"]');
  emptyCartMessage = () => cy.get('[data-qa="empty-cart-message"]');
  continueShoppingButton = () => cy.get('[data-qa="continue-shopping-button"]');
  cartContainer = () => cy.get('[data-qa="cart-container"]');
  cartItems = () => cy.get('[data-qa="cart-items"]');
  cartItem = (id: string) => cy.get(`[data-qa="cart-item-${id}"]`);
  cartItemImage = () => cy.get('[data-qa="cart-item-image"]');
  cartItemImg = () => cy.get('[data-qa="cart-item-img"]');
  cartItemDetails = () => cy.get('[data-qa="cart-item-details"]');
  cartItemInfo = () => cy.get('[data-qa="cart-item-info"]');
  cartItemName = () => cy.get('[data-qa="cart-item-name"]');
  cartItemDescription = () => cy.get('[data-qa="cart-item-description"]');
  cartItemPrice = () => cy.get('[data-qa="cart-item-price"]');
  cartItemActions = () => cy.get('[data-qa="cart-item-actions"]');
  quantityControl = () => cy.get('[data-qa="quantity-control"]');
  itemQuantity = () => cy.get('[data-qa="item-quantity"]');
  removeButton = () => cy.get('[data-qa="remove-button"]');
  cartSummary = () => cy.get('[data-qa="cart-summary"]');
  cartTotal = () => cy.get('[data-qa="cart-total"]');
  totalAmount = () => cy.get('[data-qa="total-amount"]');
  checkoutButton = () => cy.get('[data-qa="checkout-button"]');
  continueShoppingLink = () => cy.get('[data-qa="continue-shopping-link"]');
}

export default new CartPage();
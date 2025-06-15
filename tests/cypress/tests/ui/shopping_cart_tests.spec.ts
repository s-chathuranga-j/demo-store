import LoginPage from '../../pages/LoginPage';
import ProductsPage from '../../pages/ProductsPage';
import CartPage from '../../pages/CartPage';
import NavbarComponent from '../../pages/NavbarComponent';
import TestData from '../../testdata/testdata.json';

describe('Shopping Cart Test Suite', () => {
  before(() => {
    LoginPage.createSession();
  });

  beforeEach(() => {
    cy.visit('/');
    ProductsPage.productsPage().should('be.visible');
  });

  it('should add a product to the cart', { tags: ['@smoke', '@shopping-cart'] }, () => {
    ProductsPage.productName().first().invoke('text').then((productName) => {
      ProductsPage.addToCartButton().first().click();
      NavbarComponent.cartBadge().should('be.visible');
      NavbarComponent.cartBadge().should('contain', '1');
      NavbarComponent.cartLink().click();
      CartPage.cartContainer().should('be.visible');
      CartPage.cartItemName().should('contain', productName);
      CartPage.itemQuantity().should('contain', 'Qty: 1');
    });
  });

  it('should remove a product from the cart', { tags: ['@shopping-cart'] }, () => {
    ProductsPage.addToCartButton().first().click();
    NavbarComponent.cartLink().click();
    CartPage.cartContainer().should('be.visible');
    CartPage.removeButton().click();
    CartPage.emptyCart().should('be.visible');
    CartPage.emptyCartMessage().should('contain', 'Your cart is empty');
  });

  it('should update cart when adding multiple products', { tags: ['@shopping-cart'] }, () => {
    ProductsPage.addToCartButton().first().click();
    ProductsPage.addToCartButton().eq(1).click();
    NavbarComponent.cartBadge().should('be.visible');
    NavbarComponent.cartBadge().should('contain', '2');
    NavbarComponent.cartLink().click();
    CartPage.cartContainer().should('be.visible');
    CartPage.cartItems().children().should('have.length', 2);
  });

  it('should continue shopping from cart page', { tags: ['@shopping-cart'] }, () => {
    NavbarComponent.cartLink().click();
    CartPage.continueShoppingLink().click();
    ProductsPage.productsPage().should('be.visible');
  });
});
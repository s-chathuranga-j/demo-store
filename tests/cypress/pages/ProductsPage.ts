import { BasePage } from '../testbase/BasePage';

class ProductsPage extends BasePage {
  url = '/';
  productsPage = () => cy.get('[data-qa="products-page"]');
  inventoryHeader = () => cy.get('[data-qa="inventory-header"]');
  sortContainer = () => cy.get('[data-qa="sort-container"]');
  productSort = () => cy.get('[data-qa="product-sort"]');
  productGrid = () => cy.get('[data-qa="product-grid"]');
  productCard = (id: string) => cy.get(`[data-qa="product-card-${id}"]`);
  productImageContainer = () => cy.get('[data-qa="product-image-container"]');
  productImage = () => cy.get('[data-qa="product-image"]');
  productInfo = () => cy.get('[data-qa="product-info"]');
  productName = () => cy.get('[data-qa="product-name"]');
  productDescription = () => cy.get('[data-qa="product-description"]');
  productPrice = () => cy.get('[data-qa="product-price"]');
  addToCartButton = () => cy.get('[data-qa="add-to-cart-button"]');
}

export default new ProductsPage();
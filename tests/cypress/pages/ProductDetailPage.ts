import { BasePage } from '../testbase/BasePage';

class ProductDetailPage extends BasePage {
  url = '/products/';
  backButton = () => cy.get('[data-qa="back-button"]');
  backToProductsButton = () => cy.get('[data-qa="back-to-products"]');
  productDetail = () => cy.get('[data-qa="product-detail"]');
  productDetailImage = () => cy.get('[data-qa="product-detail-image"]');
  productDetailImg = () => cy.get('[data-qa="product-detail-img"]');
  productDetailInfo = () => cy.get('[data-qa="product-detail-info"]');
  productDetailName = () => cy.get('[data-qa="product-detail-name"]');
  productDetailDescription = () => cy.get('[data-qa="product-detail-description"]');
  productDetailPrice = () => cy.get('[data-qa="product-detail-price"]');
  addToCartButton = () => cy.get('[data-qa="product-detail-add-to-cart"]');
}

export default new ProductDetailPage();
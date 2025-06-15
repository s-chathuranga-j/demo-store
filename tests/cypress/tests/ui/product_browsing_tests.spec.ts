import LoginPage from '../../pages/LoginPage';
import ProductsPage from '../../pages/ProductsPage';
import ProductDetailPage from '../../pages/ProductDetailPage';
import TestData from '../../testdata/testdata.json';

describe('Product Browsing Test Suite', () => {
    before(() => {
        LoginPage.createSession();
    });

    beforeEach(() => {
        cy.visit('/');
        ProductsPage.productsPage().should('be.visible');
    });

    it('should display products and allow sorting', {tags: ['@smoke', '@product-browsing']}, () => {
        ProductsPage.productGrid().should('be.visible');
        ProductsPage.productCard('1').should('exist');
        ProductsPage.productSort().should('be.visible');
        ProductsPage.productSort().select('name-desc');
        ProductsPage.productName().first().invoke('text').then((nameZA) => {
            ProductsPage.productSort().select('name-asc');
            ProductsPage.productName().first().invoke('text').then((nameAZ) => {
                expect(nameZA).not.to.equal(nameAZ);
            });
        });
        ProductsPage.productSort().select('price-asc');
        ProductsPage.productPrice().first().invoke('text').then((priceLow) => {
            ProductsPage.productSort().select('price-desc');
            ProductsPage.productPrice().first().invoke('text').then((priceHigh) => {
                expect(priceLow).not.to.equal(priceHigh);
            });
        });
    });

    it('should navigate to product detail page when clicking on a product', {tags: ['@product-browsing']}, () => {
        ProductsPage.productName().first().click();
        ProductDetailPage.productDetail().should('be.visible');
        ProductDetailPage.productDetailName().should('be.visible');
        ProductDetailPage.productDetailDescription().should('be.visible');
        ProductDetailPage.productDetailPrice().should('be.visible');
        ProductDetailPage.addToCartButton().should('be.visible');
        ProductDetailPage.backToProductsButton().click();
        ProductsPage.productsPage().should('be.visible');
    });
});
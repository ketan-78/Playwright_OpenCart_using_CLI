/**
 * Test Case: Add Product to Cart
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Search for a known product
 * 2) Open the product details page
 * 3) Verify the product details are displayed
 * 4) Set the quantity and add the product to the cart
 * 5) Verify the product-added confirmation message
 * 6) Open the shopping cart and verify the product
 * 7) Verify the displayed quantity matches the requested quantity
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Add product to cart @master @sanity @regression @web', async ({ homePage, searchResultsPage, productPage, shoppingCartPage }) => {
    const { productName, productQuantity } = Helper.getProductDetails();

    await test.step('1) Search for a known product', async () => {
        await homePage.searchProduct(productName);
    });

    await test.step('2) Open the product details page', async () => {
        await searchResultsPage.openProduct(productName);
    });

    await test.step('3) Verify the product details are displayed', async () => {
        expect(await productPage.isProductPageExists()).toBeTruthy();
        expect(await productPage.getProductName()).toContain(productName);
    });

    await test.step('4) Set the quantity and add the product to the cart', async () => {
        await productPage.setQuantity(productQuantity);
        await productPage.addToCart();
    });

    await test.step('5) Verify the product-added confirmation message', async () => {
        expect(await productPage.isProductAddedSuccessfully()).toBeTruthy();
        expect(await productPage.getSuccessMessage()).toContain('Success');
    });

    await test.step('6) Open the shopping cart and verify the product', async () => {
        await homePage.clickShoppingCart();
        expect(await shoppingCartPage.isCartPageExists()).toBeTruthy();
        expect(await shoppingCartPage.getProductName()).toContain(productName);
    });

    await test.step('7) Verify the displayed quantity matches the requested quantity', async () => {
        expect(await shoppingCartPage.getQuantity()).toBe(productQuantity);
    });

    console.log('✅ ✔️ Add product to cart flow completed successfully!');
});

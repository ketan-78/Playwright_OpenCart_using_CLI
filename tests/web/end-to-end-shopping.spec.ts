/**
 * Test Case: End-to-End Shopping Flow
 *
 * Tags: @master @sanity @regression @end-to-end @web
 *
 * Steps:
 * 1) Register a new customer with dynamically generated data
 * 2) Log out of the newly created account
 * 3) Log in again using the newly created credentials
 * 4) Search for a known product and open its details page
 * 5) Add the product to the cart
 * 6) Open the shopping cart and verify the product and quantity
 * 7) Verify the product price and the applicable cart total
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Helper } from '../../utils/helper';

test('End-to-end shopping flow @master @sanity @regression @end-to-end @web', async ({
    homePage,
    registerPage,
    accountSuccessPage,
    loginPage,
    accountPage,
    logoutPage,
    searchResultsPage,
    productPage,
    shoppingCartPage,
}) => {
    const firstName = RandomDataUtil.getFirstName();
    const lastName = RandomDataUtil.getLastName();
    const email = RandomDataUtil.getEmail();
    const telephone = RandomDataUtil.getPhoneNumber();
    const password = RandomDataUtil.getPassword(12);
    const { productName, productQuantity, totalPrice } = Helper.getProductDetails();
    let productPrice = '';

    await test.step('1) Register a new customer with dynamically generated data', async () => {
        await homePage.clickMyAccount();
        await homePage.clickRegister();
        await registerPage.completeRegistration(firstName, lastName, email, telephone, password);
        await registerPage.acceptPrivacyPolicy();
        await registerPage.clickContinue();
        expect(await accountSuccessPage.isAccountCreatedSuccessfully()).toBeTruthy();
    });

    await test.step('2) Log out of the newly created account', async () => {
        await homePage.clickMyAccount();
        await homePage.clickLogout();
        expect(await logoutPage.isLogoutPageExists()).toBeTruthy();
        await logoutPage.clickContinue();
    });

    await test.step('3) Log in again using the newly created credentials', async () => {
        await homePage.clickMyAccount();
        await homePage.clickLogin();
        await loginPage.login(email, password);
        expect(await accountPage.isMyAccountPageExists()).toBeTruthy();
    });

    await test.step('4) Search for a known product and open its details page', async () => {
        await homePage.searchProduct(productName);
        await searchResultsPage.openProduct(productName);
        expect(await productPage.isProductPageExists()).toBeTruthy();
        productPrice = await productPage.getProductPrice();
    });

    await test.step('5) Add the product to the cart', async () => {
        await productPage.setQuantity(productQuantity);
        await productPage.addToCart();
        expect(await productPage.isProductAddedSuccessfully()).toBeTruthy();
    });

    await test.step('6) Open the shopping cart and verify the product and quantity', async () => {
        await homePage.clickShoppingCart();
        expect(await shoppingCartPage.isCartPageExists()).toBeTruthy();
        expect(await shoppingCartPage.getProductName()).toContain(productName);
        expect(await shoppingCartPage.getQuantity()).toBe(productQuantity);
    });

    await test.step('7) Verify the product price and the applicable cart total', async () => {
        expect(productPrice).toBe(totalPrice);
        expect(await shoppingCartPage.getTotal()).toBe(totalPrice);
    });

    console.log('✅ ✔️ End-to-end shopping journey completed successfully!');
});

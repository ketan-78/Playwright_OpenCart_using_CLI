/**
 * Test Case: Valid Login Flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Navigate to My Account > Login
 * 2) Verify the login page is displayed
 * 3) Submit valid customer credentials
 * 4) Verify the user is redirected to the My Account section
 * 5) Verify the authenticated account navigation is visible
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Valid login flow @master @sanity @regression @web', async ({ homePage, loginPage, accountPage }) => {
    const { email, password } = Helper.getLoginDetails();

    await test.step('1) Navigate to My Account > Login', async () => {
        await homePage.clickMyAccount();
        await homePage.clickLogin();
    });

    await test.step('2) Verify the login page is displayed', async () => {
        expect(await loginPage.isLoginPageExists()).toBeTruthy();
    });

    await test.step('3) Submit valid customer credentials', async () => {
        await loginPage.login(email, password);
    });

    await test.step('4) Verify the user is redirected to the My Account section', async () => {
        expect(await accountPage.isMyAccountPageExists()).toBeTruthy();
    });

    await test.step('5) Verify the authenticated account navigation is visible', async () => {
        expect(await homePage.isLoggedIn()).toBeTruthy();
    });

    console.log('✅ ✔️ Valid login flow completed successfully!');
});

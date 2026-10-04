/**
 * Test Case: Logout Flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Login with valid customer credentials
 * 2) Navigate to the account logout option and click Logout
 * 3) Verify the logout confirmation page is displayed
 * 4) Click Continue and verify the redirect to the homepage
 * 5) Verify authenticated account options are no longer available
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Logout flow @master @sanity @regression @web', async ({ page, homePage, loginPage, accountPage, logoutPage }) => {
    const { email, password } = Helper.getLoginDetails();

    await test.step('1) Login with valid customer credentials', async () => {
        await homePage.clickMyAccount();
        await homePage.clickLogin();
        await loginPage.login(email, password);
        expect(await accountPage.isMyAccountPageExists()).toBeTruthy();
    });

    await test.step('2) Navigate to the account logout option and click Logout', async () => {
        await homePage.clickMyAccount();
        await homePage.clickLogout();
    });

    await test.step('3) Verify the logout confirmation page is displayed', async () => {
        expect(await logoutPage.isLogoutPageExists()).toBeTruthy();
    });

    await test.step('4) Click Continue and verify the redirect to the homepage', async () => {
        await logoutPage.clickContinue();
        await expect(page).toHaveURL(/route=common\/home/);
    });

    await test.step('5) Verify authenticated account options are no longer available', async () => {
        expect(await homePage.isLoggedIn()).toBeFalsy();
    });

    console.log('✅ ✔️ Logout flow completed successfully!');
});

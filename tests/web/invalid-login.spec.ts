/**
 * Test Case: Invalid Login Flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Navigate to My Account > Login
 * 2) Submit invalid customer credentials
 * 3) Verify authentication fails with the expected warning
 * 4) Verify the customer is not authenticated
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';

test('Invalid login flow @master @sanity @regression @web', async ({ homePage, loginPage }) => {
    const invalidEmail = RandomDataUtil.getEmail();
    const invalidPassword = RandomDataUtil.getPassword(10);

    await test.step('1) Navigate to My Account > Login', async () => {
        await homePage.clickMyAccount();
        await homePage.clickLogin();
    });

    await test.step('2) Submit invalid customer credentials', async () => {
        await loginPage.login(invalidEmail, invalidPassword);
    });

    await test.step('3) Verify authentication fails with the expected warning', async () => {
        expect(await loginPage.isLoginPageExists()).toBeTruthy();
        expect(await loginPage.getWarningMessage()).toContain('Warning: No match for E-Mail Address and/or Password.');
    });

    await test.step('4) Verify the customer is not authenticated', async () => {
        expect(await homePage.isLoggedIn()).toBeFalsy();
    });

    console.log('✅ ✔️ Invalid login flow correctly rejected!');
});

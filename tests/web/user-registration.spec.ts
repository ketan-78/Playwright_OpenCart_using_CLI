/**
 * Test Case: User Registration Flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Navigate to My Account > Register
 * 2) Verify the registration page is displayed
 * 3) Enter valid registration details
 * 4) Accept the Privacy Policy and submit the form
 * 5) Verify the account created confirmation is displayed
 * 6) Verify the new account is available through the account navigation
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';

test('User registration flow @master @sanity @regression @web', async ({ homePage, registerPage, accountSuccessPage }) => {
    const firstName = RandomDataUtil.getFirstName();
    const lastName = RandomDataUtil.getLastName();
    const email = RandomDataUtil.getEmail();
    const telephone = RandomDataUtil.getPhoneNumber();
    const password = RandomDataUtil.getPassword(12);

    await test.step('1) Navigate to My Account > Register', async () => {
        await homePage.clickMyAccount();
        await homePage.clickRegister();
    });

    await test.step('2) Verify the registration page is displayed', async () => {
        expect(await registerPage.isRegisterPageExists()).toBeTruthy();
    });

    await test.step('3) Enter valid registration details', async () => {
        await registerPage.completeRegistration(firstName, lastName, email, telephone, password);
    });

    await test.step('4) Accept the Privacy Policy and submit the form', async () => {
        await registerPage.acceptPrivacyPolicy();
        await registerPage.clickContinue();
    });

    await test.step('5) Verify the account created confirmation is displayed', async () => {
        expect(await accountSuccessPage.isAccountCreatedSuccessfully()).toBeTruthy();
        expect(await accountSuccessPage.getSuccessMessage()).toContain('Your Account Has Been Created!');
    });

    await test.step('6) Verify the new account is available through the account navigation', async () => {
        expect(await homePage.isLoggedIn()).toBeTruthy();
    });

    console.log('✅ ✔️ User registration flow completed successfully!');
});

/**
 * Test Case: Customer registration validated across Frontend, Admin Portal and MySQL
 *
 * Tags: @master @regression @end-to-end @db @web
 *
 * Steps:
 * 1) Register a new customer through the frontend using dynamically generated data
 * 2) Verify the customer exists in the OpenCart admin portal
 * 3) Verify the customer record in the oc_customer MySQL table
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { executeQuery } from '../../utils/dbClient';
import dotenv from 'dotenv';

dotenv.config();

test('Customer registration validated in frontend, admin and database @master @regression @end-to-end @db @web', async ({
    storeHomePage,
    registerPage,
    accountSuccessPage,
    adminLoginPage,
    adminCustomersPage,
}) => {
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

    const firstName = RandomDataUtil.getFirstName();
    const lastName = RandomDataUtil.getLastName();
    const email = RandomDataUtil.getEmail();
    const telephone = RandomDataUtil.getPhoneNumber();
    const password = RandomDataUtil.getPassword(12);

    await test.step('1) Register a new customer through the frontend', async () => {
        await storeHomePage.clickMyAccount();
        await storeHomePage.clickRegister();

        expect(await registerPage.isRegisterPageExists(), 'Expected the registration page to be displayed').toBeTruthy();

        await registerPage.completeRegistration(firstName, lastName, email, telephone, password);
        await registerPage.acceptPrivacyPolicy();
        await registerPage.clickContinue();

        expect(
            await accountSuccessPage.isAccountCreatedSuccessfully(),
            'Expected the account created confirmation to be displayed'
        ).toBeTruthy();
        expect(
            await accountSuccessPage.getSuccessMessage(),
            'Expected the account created confirmation message'
        ).toContain('Your Account Has Been Created!');
    });

    await test.step('2) Verify the customer in the admin portal', async () => {
        await adminLoginPage.login(ADMIN_USERNAME, ADMIN_PASSWORD);
        await adminCustomersPage.open();
        await adminCustomersPage.searchByEmail(email);

        expect(
            await adminCustomersPage.isCustomerExists(email),
            `Expected the customer '${email}' to be listed in the admin portal`
        ).toBeTruthy();

        await adminCustomersPage.openCustomerDetails(email);

        expect(await adminCustomersPage.getFirstName(), 'Expected the admin first name to match the generated value').toBe(firstName);
        expect(await adminCustomersPage.getLastName(), 'Expected the admin last name to match the generated value').toBe(lastName);
        expect(await adminCustomersPage.getEmail(), 'Expected the admin email to match the generated value').toBe(email);
        expect(await adminCustomersPage.isCustomerEnabled(), 'Expected the new customer status to be Enabled').toBeTruthy();
    });

    await test.step('3) Verify the customer in the oc_customer MySQL table', async () => {
        // executeQuery opens and releases its own connection for every call, so the
        // connection is closed before these assertions run - even when they fail.
        const rows = (await executeQuery(
            'SELECT firstname, lastname, email, status, date_added FROM oc_customer WHERE email = ?',
            [email]
        )) as any[];

        expect(rows.length, `Expected exactly one oc_customer row for '${email}'`).toBe(1);
        expect(rows[0].firstname, 'Expected the database first name to match the generated value').toBe(firstName);
        expect(rows[0].lastname, 'Expected the database last name to match the generated value').toBe(lastName);
        expect(rows[0].email, 'Expected the database email to match the generated value').toBe(email);
        expect(Number(rows[0].status), 'Expected the database status to be Enabled (1)').toBe(1);
        expect(rows[0].date_added, 'Expected the database date_added to be populated').toBeTruthy();
    });

    console.log('✅ ✔️ Customer validated across frontend, admin portal and MySQL!');
});

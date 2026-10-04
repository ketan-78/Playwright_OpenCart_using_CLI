/**
 * Test Case: Login Flow (Data Driven using External File)
 *
 * Tags: @master @datadriven @web
 *
 * Steps (per data row):
 * 1) Navigate to the OpenCart login page
 * 2) Enter the email and password from the external data file
 * 3) Validate the result against the row's expected value
 */

import path from 'path';
import { test, expect } from '../../fixtures/pageFixtures';
import { DataProvider } from '../../utils/DataReader';

interface LoginDataRow {
    testName: string;
    email: string;
    password: string;
    expected: string;
}

const loginData: LoginDataRow[] = DataProvider.readJson(
    path.resolve(__dirname, '../../testdata/opencart_logindata.json')
);

test.describe('Login flow (data driven) @web', () => {
    loginData.forEach((row, index) => {
        test(`Data driven login - ${row.testName} [row ${index + 1}] @master @datadriven @web`, async ({
            homePage,
            loginPage,
            accountPage,
        }) => {
            await test.step('1) Navigate to the OpenCart login page', async () => {
                await homePage.clickMyAccount();
                await homePage.clickLogin();
            });

            await test.step('2) Enter the email and password from the external data file', async () => {
                await loginPage.login(row.email, row.password);
            });

            if (row.expected.toLowerCase() === 'success') {
                await test.step('3) Verify login is successful and My Account is displayed', async () => {
                    expect(await accountPage.isMyAccountPageExists()).toBeTruthy();
                });
            } else {
                await test.step('3) Verify login is unsuccessful and a warning is displayed', async () => {
                    expect(await accountPage.isMyAccountPageExists()).toBeFalsy();
                    expect(await loginPage.isWarningVisible()).toBeTruthy();
                    // OpenCart reports either an invalid credential warning or, after
                    // repeated failed attempts, an account lockout warning.
                    expect(await loginPage.getWarningMessage()).toMatch(
                        /(No match for E-Mail Address and\/or Password|exceeded allowed number of login attempts)/
                    );
                });
            }

            console.log('✅ ✔️ Data driven login row validated successfully!');
        });
    });
});

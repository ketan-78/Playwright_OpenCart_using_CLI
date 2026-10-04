import { test as base } from '@playwright/test';
import dotenv from 'dotenv';
import { HomePage } from '../pages/HomePage';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { AccountPage } from '../pages/AccountPage';
import { AccountSuccessPage } from '../pages/AccountSuccessPage';
import { LogoutPage } from '../pages/LogoutPage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ProductPage } from '../pages/ProductPage';
import { ShoppingCartPage } from '../pages/ShoppingCartPage';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { AdminCustomersPage } from '../pages/AdminCustomersPage';

dotenv.config();

const APP_URL = process.env.WEB_APP_URL || 'http://localhost/opencart/upload/';

// The DB/Admin end-to-end test must hit the same local OpenCart installation as the
// admin portal and MySQL. STORE_URL is configured in .env and falls back to the host of
// ADMIN_URL, so this test never depends on WEB_APP_URL (which may point at a remote demo).
const STORE_URL =
    process.env.STORE_URL ||
    (process.env.ADMIN_URL || 'http://localhost/opencart/upload/admin/index.php').replace(/admin\/index\.php.*$/i, '');

/**
 * Custom page fixtures exposing every OpenCart Page Object to the web tests.
 */
type PageFixtures = {
    homePage: HomePage;
    storeHomePage: HomePage;
    registerPage: RegisterPage;
    loginPage: LoginPage;
    accountPage: AccountPage;
    accountSuccessPage: AccountSuccessPage;
    logoutPage: LogoutPage;
    searchResultsPage: SearchResultsPage;
    productPage: ProductPage;
    shoppingCartPage: ShoppingCartPage;
    adminLoginPage: AdminLoginPage;
    adminCustomersPage: AdminCustomersPage;
};

export const test = base.extend<PageFixtures>({
    // Entry-point fixture - navigates to the application URL
    homePage: async ({ page }, use) => {
        await page.goto(APP_URL);
        await use(new HomePage(page));
    },

    // Entry-point fixture for the local DB end-to-end test - navigates to the local store
    storeHomePage: async ({ page }, use) => {
        await page.goto(STORE_URL);
        await use(new HomePage(page));
    },

    registerPage: async ({ page }, use) => {
        await use(new RegisterPage(page));
    },

    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    accountPage: async ({ page }, use) => {
        await use(new AccountPage(page));
    },

    accountSuccessPage: async ({ page }, use) => {
        await use(new AccountSuccessPage(page));
    },

    logoutPage: async ({ page }, use) => {
        await use(new LogoutPage(page));
    },

    searchResultsPage: async ({ page }, use) => {
        await use(new SearchResultsPage(page));
    },

    productPage: async ({ page }, use) => {
        await use(new ProductPage(page));
    },

    shoppingCartPage: async ({ page }, use) => {
        await use(new ShoppingCartPage(page));
    },

    adminLoginPage: async ({ page }, use) => {
        await use(new AdminLoginPage(page));
    },

    adminCustomersPage: async ({ page }, use) => {
        await use(new AdminCustomersPage(page));
    },
});

// Close the page and context after each test if they are still open
test.afterEach(async ({ page, context }) => {
    try {
        if (!page.isClosed()) {
            await page.close();
        }
        await context.close();
    } catch {
        // Page/context may already be closed by the Playwright teardown
    }
});

export { expect } from '@playwright/test';

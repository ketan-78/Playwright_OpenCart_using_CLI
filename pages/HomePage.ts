import { Page, Locator } from '@playwright/test';
import { RegisterPage } from './RegisterPage';
import { LoginPage } from './LoginPage';
import { LogoutPage } from './LogoutPage';
import { SearchResultsPage } from './SearchResultsPage';
import { ShoppingCartPage } from './ShoppingCartPage';

export class HomePage {
    private readonly page: Page;

    // Locators
    private readonly myAccountDropdown: Locator;
    private readonly myAccountToggle: Locator;
    private readonly registerLink: Locator;
    private readonly loginLink: Locator;
    private readonly logoutLink: Locator;
    private readonly searchInput: Locator;
    private readonly searchButton: Locator;
    private readonly shoppingCartLink: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.myAccountDropdown = page.locator('#top .dropdown').first();
        this.myAccountToggle = page.locator('#top .dropdown .dropdown-toggle').first();
        this.registerLink = page.locator('#top .dropdown-menu a', { hasText: 'Register' }).first();
        this.loginLink = page.locator('#top .dropdown-menu a', { hasText: 'Login' }).first();
        this.logoutLink = page.locator('#top .dropdown-menu a', { hasText: 'Logout' }).first();
        this.searchInput = page.locator('#search input[name="search"]');
        this.searchButton = page.locator('#search button');
        this.shoppingCartLink = page.locator('#top a', { hasText: 'Shopping Cart' }).first();
    }

    /**
     * Opens the My Account dropdown in the header when it is not already open
     */
    async clickMyAccount(): Promise<void> {
        try {
            const cssClass = (await this.myAccountDropdown.getAttribute('class')) || '';
            if (!cssClass.includes('open')) {
                await this.myAccountToggle.click();
            }
        } catch (error) {
            console.log(`Error opening the My Account menu: ${error}`);
            throw error;
        }
    }

    /**
     * Clicks the Register link inside the My Account menu
     * @returns Promise<RegisterPage> - Instance of the registration page
     */
    async clickRegister(): Promise<RegisterPage> {
        await this.registerLink.click();
        return new RegisterPage(this.page);
    }

    /**
     * Clicks the Login link inside the My Account menu
     * @returns Promise<LoginPage> - Instance of the login page
     */
    async clickLogin(): Promise<LoginPage> {
        await this.loginLink.click();
        return new LoginPage(this.page);
    }

    /**
     * Clicks the Logout link inside the My Account menu
     * @returns Promise<LogoutPage> - Instance of the logout page
     */
    async clickLogout(): Promise<LogoutPage> {
        await this.logoutLink.click();
        return new LogoutPage(this.page);
    }

    /**
     * Clicks the Shopping Cart link in the header
     * @returns Promise<ShoppingCartPage> - Instance of the shopping cart page
     */
    async clickShoppingCart(): Promise<ShoppingCartPage> {
        await this.shoppingCartLink.click();
        return new ShoppingCartPage(this.page);
    }

    /**
     * Searches for a product using the header search field
     * @param productName - Product name to search for
     * @returns Promise<SearchResultsPage> - Instance of the search results page
     */
    async searchProduct(productName: string): Promise<SearchResultsPage> {
        await this.searchInput.fill(productName);
        await this.searchButton.click();
        return new SearchResultsPage(this.page);
    }

    /**
     * Verifies whether the customer is authenticated by checking the account navigation
     * @returns Promise<boolean> - true when the authenticated account menu is present
     */
    async isLoggedIn(): Promise<boolean> {
        try {
            return (await this.logoutLink.count()) > 0;
        } catch (error) {
            console.log(`Error checking login state: ${error}`);
            return false;
        }
    }
}

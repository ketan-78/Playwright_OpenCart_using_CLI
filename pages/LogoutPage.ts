import { Page, Locator } from '@playwright/test';
import { HomePage } from './HomePage';

export class LogoutPage {
    private readonly page: Page;

    // Locators
    private readonly logoutHeading: Locator;
    private readonly continueButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.logoutHeading = page.locator('#content h1', { hasText: 'Account Logout' });
        this.continueButton = page.locator('#content .btn-primary', { hasText: 'Continue' }).first();
    }

    /**
     * Verifies the logout confirmation page is displayed
     * @returns Promise<boolean> - true if the logout page is displayed
     */
    async isLogoutPageExists(): Promise<boolean> {
        try {
            return await this.logoutHeading.isVisible();
        } catch (error) {
            console.log(`Error checking logout page: ${error}`);
            return false;
        }
    }

    /**
     * Clicks the Continue button on the logout confirmation page
     * @returns Promise<HomePage> - Instance of the home page
     */
    async clickContinue(): Promise<HomePage> {
        await this.continueButton.click();
        return new HomePage(this.page);
    }
}

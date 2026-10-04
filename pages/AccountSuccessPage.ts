import { Page, Locator } from '@playwright/test';

export class AccountSuccessPage {
    private readonly page: Page;

    // Locators
    private readonly successHeading: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.successHeading = page.locator('#content h1', { hasText: 'Your Account Has Been Created!' });
    }

    /**
     * Verifies the registration confirmation page is displayed
     * @returns Promise<boolean> - true if the account created confirmation is displayed
     */
    async isAccountCreatedSuccessfully(): Promise<boolean> {
        try {
            return await this.successHeading.isVisible();
        } catch (error) {
            console.log(`Error checking account created confirmation: ${error}`);
            return false;
        }
    }

    /**
     * Reads the account created confirmation message
     * @returns Promise<string> - The confirmation message text
     */
    async getSuccessMessage(): Promise<string> {
        try {
            return ((await this.successHeading.textContent()) || '').trim();
        } catch (error) {
            console.log(`Error reading confirmation message: ${error}`);
            return '';
        }
    }
}

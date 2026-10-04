import { Page, Locator } from '@playwright/test';

export class AccountPage {
    private readonly page: Page;

    // Locators
    private readonly accountHeading: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.accountHeading = page.locator('#content h2', { hasText: 'My Account' }).first();
    }

    /**
     * Verifies the authenticated My Account page is displayed
     * @returns Promise<boolean> - true if the My Account page is displayed
     */
    async isMyAccountPageExists(): Promise<boolean> {
        try {
            return await this.accountHeading.isVisible();
        } catch (error) {
            console.log(`Error checking My Account page: ${error}`);
            return false;
        }
    }
}

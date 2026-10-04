import { Page, Locator } from '@playwright/test';

export class LoginPage {
    private readonly page: Page;

    // Locators
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly warningAlert: Locator;
    private readonly returningCustomerHeading: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.emailInput = page.locator('#input-email');
        this.passwordInput = page.locator('#input-password');
        this.loginButton = page.locator('input[type="submit"][value="Login"]');
        this.warningAlert = page.locator('.alert-danger');
        this.returningCustomerHeading = page.locator('#content h2', { hasText: 'Returning Customer' });
    }

    /**
     * Submits the login form with the supplied credentials.
     * Blank or whitespace-only values are left empty as provided by the test data.
     * @param email - Customer email address
     * @param password - Customer password
     */
    async login(email: string, password: string): Promise<void> {
        if (email.trim().length > 0) {
            await this.emailInput.fill(email);
        }
        if (password.trim().length > 0) {
            await this.passwordInput.fill(password);
        }
        await this.loginButton.click();
    }

    /**
     * Reads the warning/error message shown after a failed login
     * @returns Promise<string> - The warning message text
     */
    async getWarningMessage(): Promise<string> {
        try {
            return ((await this.warningAlert.textContent()) || '').trim();
        } catch (error) {
            console.log(`Error reading warning message: ${error}`);
            return '';
        }
    }

    /**
     * Verifies a login warning/error message is displayed
     * @returns Promise<boolean> - true if a warning message is displayed
     */
    async isWarningVisible(): Promise<boolean> {
        try {
            return await this.warningAlert.isVisible();
        } catch (error) {
            console.log(`Error checking login warning: ${error}`);
            return false;
        }
    }

    /**
     * Verifies the login page is displayed
     * @returns Promise<boolean> - true if the login page is displayed
     */
    async isLoginPageExists(): Promise<boolean> {
        try {
            return await this.returningCustomerHeading.isVisible();
        } catch (error) {
            console.log(`Error checking login page: ${error}`);
            return false;
        }
    }
}

import { Page, Locator } from '@playwright/test';

export class AdminLoginPage {
    private readonly page: Page;

    // Locators
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.usernameInput = page.locator('#input-username');
        this.passwordInput = page.locator('#input-password');
        this.loginButton = page.locator('button[type="submit"]');
    }

    /**
     * Opens the admin login page and signs in with the supplied credentials
     * @param username - Administrator username
     * @param password - Administrator password
     */
    async login(username: string, password: string): Promise<void> {
        try {
            const adminUrl = process.env.ADMIN_URL || 'http://localhost/opencart/upload/admin/index.php';
            await this.page.goto(adminUrl);
            await this.usernameInput.fill(username);
            await this.passwordInput.fill(password);
            await this.loginButton.click();
            await this.page.waitForURL(/route=common\/dashboard/);
        } catch (error) {
            console.log(`Error logging into the admin portal: ${error}`);
            throw error;
        }
    }

    /**
     * Verifies the admin dashboard is displayed
     * @returns Promise<boolean> - true if the dashboard route is active
     */
    async isDashboardExists(): Promise<boolean> {
        try {
            return this.page.url().includes('route=common/dashboard');
        } catch (error) {
            console.log(`Error checking the admin dashboard: ${error}`);
            return false;
        }
    }
}

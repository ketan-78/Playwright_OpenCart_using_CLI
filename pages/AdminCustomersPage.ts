import { Page, Locator } from '@playwright/test';

export class AdminCustomersPage {
    private readonly page: Page;

    // Locators
    private readonly emailFilterInput: Locator;
    private readonly filterButton: Locator;
    private readonly customerRows: Locator;
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly emailInput: Locator;
    private readonly statusSelect: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.emailFilterInput = page.locator('input[name="filter_email"]');
        this.filterButton = page.locator('#button-filter');
        this.customerRows = page.locator('#content table tbody tr');
        this.firstNameInput = page.locator('#input-firstname');
        this.lastNameInput = page.locator('#input-lastname');
        this.emailInput = page.locator('#input-email');
        this.statusSelect = page.locator('#input-status');
    }

    /**
     * Navigates to the Customers section, preserving the admin session token
     */
    async open(): Promise<void> {
        try {
            const url = new URL(this.page.url());
            const userToken = url.searchParams.get('user_token');
            if (!userToken) {
                throw new Error('Admin user token not found. The admin login must run before opening the Customers section.');
            }
            url.search = `?route=customer/customer&user_token=${userToken}`;
            await this.page.goto(url.toString());
            await this.page.waitForLoadState('domcontentloaded');
        } catch (error) {
            console.log(`Error opening the Customers section: ${error}`);
            throw error;
        }
    }

    /**
     * Filters the customer list using the supplied email address
     * @param email - Customer email address to search for
     */
    async searchByEmail(email: string): Promise<void> {
        await this.emailFilterInput.fill(email);
        await this.filterButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Verifies a customer with the supplied email is listed
     * @param email - Customer email address to look for
     * @returns Promise<boolean> - true if a matching customer row is listed
     */
    async isCustomerExists(email: string): Promise<boolean> {
        try {
            const rowCount = await this.customerRows.count();
            for (let index = 0; index < rowCount; index++) {
                const rowText = await this.customerRows.nth(index).innerText();
                if (rowText.includes(email)) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.log(`Error checking the customer list: ${error}`);
            return false;
        }
    }

    /**
     * Opens the edit/details page of the customer matching the supplied email
     * @param email - Customer email address whose record should be opened
     */
    async openCustomerDetails(email: string): Promise<void> {
        try {
            const row = this.customerRows.filter({ hasText: email }).first();
            await row.locator('a[href*="customer/customer/edit"]').first().click();
            await this.page.waitForLoadState('domcontentloaded');
        } catch (error) {
            console.log(`Error opening the customer details: ${error}`);
            throw error;
        }
    }

    /**
     * Reads the first name from the customer details page
     * @returns Promise<string> - Customer first name
     */
    async getFirstName(): Promise<string> {
        return (await this.firstNameInput.inputValue()).trim();
    }

    /**
     * Reads the last name from the customer details page
     * @returns Promise<string> - Customer last name
     */
    async getLastName(): Promise<string> {
        return (await this.lastNameInput.inputValue()).trim();
    }

    /**
     * Reads the email from the customer details page
     * @returns Promise<string> - Customer email
     */
    async getEmail(): Promise<string> {
        return (await this.emailInput.inputValue()).trim();
    }

    /**
     * Verifies the customer status is displayed as Enabled
     * @returns Promise<boolean> - true when the status is Enabled (value 1)
     */
    async isCustomerEnabled(): Promise<boolean> {
        try {
            return (await this.statusSelect.inputValue()) === '1';
        } catch (error) {
            console.log(`Error checking the customer status: ${error}`);
            return false;
        }
    }
}

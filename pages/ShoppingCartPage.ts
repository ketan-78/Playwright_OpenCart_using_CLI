import { Page, Locator } from '@playwright/test';

export class ShoppingCartPage {
    private readonly page: Page;

    // Locators
    private readonly cartHeading: Locator;
    private readonly productNameLink: Locator;
    private readonly quantityInput: Locator;
    private readonly totalsTable: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.cartHeading = page.locator('#content h1', { hasText: 'Shopping Cart' });
        this.productNameLink = page.locator('#content table tbody tr td.text-left a').first();
        this.quantityInput = page.locator('#content input[name^="quantity"]').first();
        this.totalsTable = page.locator('#content table').last();
    }

    /**
     * Verifies the shopping cart page is displayed
     * @returns Promise<boolean> - true if the shopping cart page is displayed
     */
    async isCartPageExists(): Promise<boolean> {
        try {
            return await this.cartHeading.isVisible();
        } catch (error) {
            console.log(`Error checking shopping cart page: ${error}`);
            return false;
        }
    }

    /**
     * Reads the product name shown in the shopping cart
     * @returns Promise<string> - The product name
     */
    async getProductName(): Promise<string> {
        return ((await this.productNameLink.textContent()) || '').trim();
    }

    /**
     * Reads the quantity shown for the product in the shopping cart
     * @returns Promise<string> - The product quantity
     */
    async getQuantity(): Promise<string> {
        return (await this.quantityInput.inputValue()).trim();
    }

    /**
     * Reads the applicable cart total
     * @returns Promise<string> - The cart total amount
     */
    async getTotal(): Promise<string> {
        const totalRow = this.totalsTable.locator('tbody tr').last();
        return ((await totalRow.locator('td').last().textContent()) || '').trim();
    }
}

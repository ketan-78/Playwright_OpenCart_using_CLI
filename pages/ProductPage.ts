import { Page, Locator } from '@playwright/test';

export class ProductPage {
    private readonly page: Page;

    // Locators
    private readonly productHeading: Locator;
    private readonly productPrice: Locator;
    private readonly quantityInput: Locator;
    private readonly addToCartButton: Locator;
    private readonly successAlert: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.productHeading = page.locator('#content h1');
        this.productPrice = page.locator('#content .list-unstyled h2').first();
        this.quantityInput = page.locator('#input-quantity');
        this.addToCartButton = page.locator('#button-cart');
        this.successAlert = page.locator('.alert-success');
    }

    /**
     * Verifies the product details page is displayed.
     * Waits for the add-to-cart button because the page is loaded remotely and may render after navigation.
     * @returns Promise<boolean> - true if the product details page is displayed
     */
    async isProductPageExists(): Promise<boolean> {
        try {
            await this.addToCartButton.waitFor({ state: 'visible', timeout: 15 * 1000 });
            return true;
        } catch (error) {
            console.log(`Error checking product page: ${error}`);
            return false;
        }
    }

    /**
     * Reads the displayed product name
     * @returns Promise<string> - The product name
     */
    async getProductName(): Promise<string> {
        return ((await this.productHeading.textContent()) || '').trim();
    }

    /**
     * Reads the displayed product price
     * @returns Promise<string> - The product price
     */
    async getProductPrice(): Promise<string> {
        return ((await this.productPrice.textContent()) || '').trim();
    }

    /**
     * Sets the product quantity when the product supports quantity selection
     * @param quantity - Quantity to select
     */
    async setQuantity(quantity: string): Promise<void> {
        if (await this.quantityInput.count()) {
            await this.quantityInput.fill(quantity);
        }
    }

    /**
     * Adds the product to the shopping cart
     */
    async addToCart(): Promise<void> {
        await this.page.waitForLoadState('load');
        await this.addToCartButton.click();
    }

    /**
     * Verifies the product-added confirmation message is displayed.
     * The confirmation is rendered asynchronously, so this waits for it to appear.
     * @returns Promise<boolean> - true if the confirmation message is displayed
     */
    async isProductAddedSuccessfully(): Promise<boolean> {
        try {
            await this.successAlert.waitFor({ state: 'visible', timeout: 10 * 1000 });
            return true;
        } catch (error) {
            console.log(`Error checking product added confirmation: ${error}`);
            return false;
        }
    }

    /**
     * Reads the product-added confirmation message
     * @returns Promise<string> - The confirmation message text
     */
    async getSuccessMessage(): Promise<string> {
        return ((await this.successAlert.textContent()) || '').trim();
    }
}

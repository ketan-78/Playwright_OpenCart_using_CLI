import { Page, Locator } from '@playwright/test';
import { ProductPage } from './ProductPage';

export class SearchResultsPage {
    private readonly page: Page;

    // Locators
    private readonly resultsHeading: Locator;
    private readonly productNameLinks: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.resultsHeading = page.locator('#content h2', { hasText: 'Products meeting the search criteria' });
        this.productNameLinks = page.locator('.product-thumb h4 a');
    }

    /**
     * Verifies the search results page is displayed
     * @returns Promise<boolean> - true if the search results page is displayed
     */
    async isSearchResultsPageExists(): Promise<boolean> {
        try {
            return await this.resultsHeading.isVisible();
        } catch (error) {
            console.log(`Error checking search results page: ${error}`);
            return false;
        }
    }

    /**
     * Reads all product names displayed in the search results
     * @returns Promise<string[]> - List of product names
     */
    async getProductNames(): Promise<string[]> {
        const names = await this.productNameLinks.allTextContents();
        return names.map((name) => name.trim());
    }

    /**
     * Verifies a product with the given name is present in the search results
     * @param productName - Expected product name
     * @returns Promise<boolean> - true if the product is present
     */
    async isProductVisible(productName: string): Promise<boolean> {
        try {
            const names = await this.getProductNames();
            return names.includes(productName);
        } catch (error) {
            console.log(`Error checking product visibility: ${error}`);
            return false;
        }
    }

    /**
     * Opens the product details page for the given product name
     * @param productName - Product name to open
     * @returns Promise<ProductPage> - Instance of the product details page
     */
    async openProduct(productName: string): Promise<ProductPage> {
        await this.productNameLinks.filter({ hasText: productName }).first().click();
        return new ProductPage(this.page);
    }
}

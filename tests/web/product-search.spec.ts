/**
 * Test Case: Product Search Flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Search for a known product using the header search field
 * 2) Verify the search results page is displayed
 * 3) Verify the expected product appears in the results
 * 4) Verify the displayed product name matches the search criteria
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Product search flow @master @sanity @regression @web', async ({ homePage, searchResultsPage }) => {
    const { productName } = Helper.getProductDetails();

    await test.step('1) Search for a known product using the header search field', async () => {
        await homePage.searchProduct(productName);
    });

    await test.step('2) Verify the search results page is displayed', async () => {
        expect(await searchResultsPage.isSearchResultsPageExists()).toBeTruthy();
    });

    await test.step('3) Verify the expected product appears in the results', async () => {
        expect(await searchResultsPage.isProductVisible(productName)).toBeTruthy();
    });

    await test.step('4) Verify the displayed product name matches the search criteria', async () => {
        const productNames = await searchResultsPage.getProductNames();
        expect(productNames).toContain(productName);
    });

    console.log('✅ ✔️ Product search flow completed successfully!');
});

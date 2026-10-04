/**
 * Test Case: FakeStore Products API
 *
 * Tags: @master @sanity @regression @api
 *
 * Scenarios:
 * 1) Get all products
 * 2) Get a product by ID
 * 3) Get products with a limit
 * 4) Sort products ascending / descending
 * 5) Get all product categories
 * 6) Get products by category
 * 7) Create, update and delete a product
 */

import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Products API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || 'https://fakestoreapi.com';
    const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);
    const CATEGORY = 'electronics';

    // ---------------------------------------------------------
    // GET - All Products
    // ---------------------------------------------------------

    test('GET - All Products @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_PRODUCTS}`);

        expect(response.status(), 'Expected status 200 when fetching all products').toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'Expected the response body to be an array').toBeTruthy();
        expect(responseBody.length, 'Expected at least one product').toBeGreaterThan(0);

        responseBody.forEach((product: any) => {
            expect(typeof product.id, 'Expected product id to be a number').toBe('number');
            expect(typeof product.title, 'Expected product title to be a string').toBe('string');
            expect(product.title.length, 'Expected product title to be non-empty').toBeGreaterThan(0);
            expect(typeof product.price, 'Expected product price to be a number').toBe('number');
            expect(typeof product.category, 'Expected product category to be a string').toBe('string');
            expect(typeof product.image, 'Expected product image to be a string').toBe('string');
        });
    });

    // ---------------------------------------------------------
    // GET - Product by ID
    // ---------------------------------------------------------

    test('GET - Product by ID @master @sanity @api', async ({ request }) => {

        const response = await request.get(
            `${BASE_URL}${Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID))}`
        );

        expect(response.status(), `Expected status 200 for product ${PRODUCT_ID}`).toBe(200);

        const product = await response.json();

        expect(product.id, 'Expected the returned product id to match the requested id').toBe(PRODUCT_ID);
        expect(typeof product.title, 'Expected product title to be a string').toBe('string');
        expect(typeof product.price, 'Expected product price to be a number').toBe('number');
        expect(typeof product.category, 'Expected product category to be a string').toBe('string');
        expect(typeof product.image, 'Expected product image to be a string').toBe('string');
    });

    // ---------------------------------------------------------
    // GET - Products with Limit
    // ---------------------------------------------------------

    test('GET - Products with Limit @master @sanity @api', async ({ request }) => {

        const response = await request.get(
            `${BASE_URL}${Routes.GET_PRODUCTS_WITH_LIMIT.replace('{limit}', String(LIMIT))}`
        );

        expect(response.status(), `Expected status 200 for limit ${LIMIT}`).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'Expected the response body to be an array').toBeTruthy();
        expect(responseBody.length, `Expected the response to contain exactly ${LIMIT} products`).toBe(LIMIT);
    });

    // ---------------------------------------------------------
    // GET - Products Sorted Ascending
    // ---------------------------------------------------------

    test('GET - Products Sorted Ascending @master @regression @api', async ({ request }) => {

        const response = await request.get(
            `${BASE_URL}${Routes.GET_PRODUCTS_SORTED.replace('{order}', 'asc')}`
        );

        expect(response.status(), 'Expected status 200 for ascending sort').toBe(200);

        const responseBody = await response.json();
        const ids = responseBody.map((product: any) => product.id);
        const ascendingIds = [...ids].sort((a, b) => a - b);

        expect(ids, 'Expected product ids in ascending order').toEqual(ascendingIds);
    });

    // ---------------------------------------------------------
    // GET - Products Sorted Descending
    // ---------------------------------------------------------

    test('GET - Products Sorted Descending @master @regression @api', async ({ request }) => {

        const response = await request.get(
            `${BASE_URL}${Routes.GET_PRODUCTS_SORTED.replace('{order}', 'desc')}`
        );

        expect(response.status(), 'Expected status 200 for descending sort').toBe(200);

        const responseBody = await response.json();
        const ids = responseBody.map((product: any) => product.id);
        const descendingIds = [...ids].sort((a, b) => b - a);

        expect(ids, 'Expected product ids in descending order').toEqual(descendingIds);
    });

    // ---------------------------------------------------------
    // GET - All Product Categories
    // ---------------------------------------------------------

    test('GET - All Product Categories @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CATEGORIES}`);

        expect(response.status(), 'Expected status 200 when fetching categories').toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'Expected the response body to be an array').toBeTruthy();
        expect(responseBody.length, 'Expected the category list to be non-empty').toBeGreaterThan(0);
        responseBody.forEach((category: any) => {
            expect(typeof category, 'Expected each category to be a string').toBe('string');
        });
    });

    // ---------------------------------------------------------
    // GET - Products by Category
    // ---------------------------------------------------------

    test('GET - Products by Category @master @regression @api', async ({ request }) => {

        const response = await request.get(
            `${BASE_URL}${Routes.GET_PRODUCTS_BY_CATEGORY.replace('{category}', CATEGORY)}`
        );

        expect(response.status(), `Expected status 200 for category '${CATEGORY}'`).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'Expected the response body to be an array').toBeTruthy();
        expect(responseBody.length, `Expected at least one product for category '${CATEGORY}'`).toBeGreaterThan(0);
        responseBody.forEach((product: any) => {
            expect(product.category, `Expected every product to belong to '${CATEGORY}'`).toBe(CATEGORY);
        });
    });

    // ---------------------------------------------------------
    // POST - Create Product
    // ---------------------------------------------------------

    test('POST - Create Product @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateProductPayload();

        const response = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: payload });

        expect(response.status(), 'Expected status 201 when creating a product').toBe(201);

        const created = await response.json();

        expect(created.id, 'Expected a generated product id to be returned').toBeTruthy();
        expect(created.title, 'Expected the response to contain the submitted title').toBe(payload.title);
        expect(created.price, 'Expected the response to contain the submitted price').toBe(payload.price);
        expect(created.category, 'Expected the response to contain the submitted category').toBe(payload.category);
    });

    // ---------------------------------------------------------
    // PUT - Update Product
    // ---------------------------------------------------------

    test('PUT - Update Product @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUpdatedProductPayload();

        const response = await request.put(
            `${BASE_URL}${Routes.UPDATE_PRODUCT.replace('{id}', String(PRODUCT_ID))}`,
            { data: payload }
        );

        expect(response.status(), `Expected status 200 when updating product ${PRODUCT_ID}`).toBe(200);

        const updated = await response.json();

        expect(updated.id, 'Expected the returned product id to match the requested id').toBe(PRODUCT_ID);
        expect(updated.title, 'Expected the response to reflect the updated title').toBe(payload.title);
        expect(updated.price, 'Expected the response to reflect the updated price').toBe(payload.price);
    });

    // ---------------------------------------------------------
    // DELETE - Product
    // ---------------------------------------------------------

    test('DELETE - Product @master @regression @api', async ({ request }) => {

        const response = await request.delete(
            `${BASE_URL}${Routes.DELETE_PRODUCT.replace('{id}', String(PRODUCT_ID))}`
        );

        expect(response.status(), `Expected status 200 when deleting product ${PRODUCT_ID}`).toBe(200);

        const deleted = await response.json();

        expect(deleted.id, 'Expected the deleted product response to contain the product id').toBe(PRODUCT_ID);
    });
});

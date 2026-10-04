/**
 * Test Case: FakeStore JSON Schema Validation
 *
 * Tags: @master @regression @api
 *
 * Scenarios:
 * 1) Product response conforms to the product JSON schema
 * 2) User response conforms to the user JSON schema
 * 3) Cart response conforms to the cart JSON schema
 */

import { test, expect } from '@playwright/test';
import path from 'path';
import Ajv from 'ajv';
import { Routes } from '../../api/endpoints/routes';
import { DataProvider } from '../../utils/DataReader';
import dotenv from 'dotenv';

dotenv.config();

test.describe('JSON Schema Validation API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || 'https://fakestoreapi.com';
    const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const CART_ID = Number(process.env.CART_ID ?? 1);

    const ajv = new Ajv();

    // ---------------------------------------------------------
    // Product Response Schema
    // ---------------------------------------------------------

    test('Product Response Schema @master @regression @api', async ({ request }) => {

        const response = await request.get(
            `${BASE_URL}${Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID))}`
        );

        expect(response.status(), `Expected status 200 for product ${PRODUCT_ID}`).toBe(200);

        const responseBody = await response.json();

        const schema = DataProvider.readJson(
            path.resolve(__dirname, '../../api/schemas/product_api_schema.json')
        );
        const validate = ajv.compile(schema);
        const isValid = validate(responseBody);

        expect(isValid, `Product schema validation failed: ${JSON.stringify(validate.errors)}`).toBeTruthy();
    });

    // ---------------------------------------------------------
    // User Response Schema
    // ---------------------------------------------------------

    test('User Response Schema @master @regression @api', async ({ request }) => {

        const response = await request.get(
            `${BASE_URL}${Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID))}`
        );

        expect(response.status(), `Expected status 200 for user ${USER_ID}`).toBe(200);

        const responseBody = await response.json();

        const schema = DataProvider.readJson(
            path.resolve(__dirname, '../../api/schemas/user_api_schema.json')
        );
        const validate = ajv.compile(schema);
        const isValid = validate(responseBody);

        expect(isValid, `User schema validation failed: ${JSON.stringify(validate.errors)}`).toBeTruthy();
    });

    // ---------------------------------------------------------
    // Cart Response Schema
    // ---------------------------------------------------------

    test('Cart Response Schema @master @regression @api', async ({ request }) => {

        const response = await request.get(
            `${BASE_URL}${Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID))}`
        );

        expect(response.status(), `Expected status 200 for cart ${CART_ID}`).toBe(200);

        const responseBody = await response.json();

        const schema = DataProvider.readJson(
            path.resolve(__dirname, '../../api/schemas/cart_api_schema.json')
        );
        const validate = ajv.compile(schema);
        const isValid = validate(responseBody);

        expect(isValid, `Cart schema validation failed: ${JSON.stringify(validate.errors)}`).toBeTruthy();
    });
});

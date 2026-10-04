/**
 * Test Case: FakeStore End-to-End CRUD Workflows
 *
 * Tags: @master @regression @end-to-end @api
 *
 * Scenarios:
 * 1) Product create -> update -> delete using the generated product id
 * 2) User create -> update -> delete using the generated user id
 * 3) Cart create -> update -> delete using the generated cart id
 */

import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

test.describe('End-to-End CRUD Workflow API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || 'https://fakestoreapi.com';
    const USER_ID = Number(process.env.USER_ID ?? 1);

    // ---------------------------------------------------------
    // Product CRUD Workflow
    // ---------------------------------------------------------

    test('Product CRUD Workflow @master @regression @end-to-end @api', async ({ request }) => {

        const createPayload = RandomDataUtil.generateProductPayload();

        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, {
            data: createPayload,
        });

        expect(createResponse.status(), 'Expected status 201 when creating a product').toBe(201);

        const created = await createResponse.json();

        expect(created.id, 'Expected a generated product id to be returned').toBeTruthy();

        const updatePayload = RandomDataUtil.generateUpdatedProductPayload();

        const updateResponse = await request.put(
            `${BASE_URL}${Routes.UPDATE_PRODUCT.replace('{id}', String(created.id))}`,
            { data: updatePayload }
        );

        expect(updateResponse.status(), 'Expected status 200 when updating the created product').toBe(200);

        const updated = await updateResponse.json();

        expect(updated.id, 'Expected the updated product id to match the created product id').toBe(created.id);
        expect(updated.title, 'Expected the response to reflect the updated title').toBe(updatePayload.title);
        expect(updated.price, 'Expected the response to reflect the updated price').toBe(updatePayload.price);

        const deleteResponse = await request.delete(
            `${BASE_URL}${Routes.DELETE_PRODUCT.replace('{id}', String(created.id))}`
        );

        expect(deleteResponse.status(), 'Expected status 200 when deleting the created product').toBe(200);
    });

    // ---------------------------------------------------------
    // User CRUD Workflow
    // ---------------------------------------------------------

    test('User CRUD Workflow @master @regression @end-to-end @api', async ({ request }) => {

        const createPayload = RandomDataUtil.generateUserPayload();

        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, {
            data: createPayload,
        });

        expect(createResponse.status(), 'Expected status 201 when creating a user').toBe(201);

        const created = await createResponse.json();

        expect(created.id, 'Expected a generated user id to be returned').toBeTruthy();

        const updatePayload = RandomDataUtil.generateUserUpdatePayload();

        const updateResponse = await request.put(
            `${BASE_URL}${Routes.UPDATE_USER.replace('{id}', String(created.id))}`,
            { data: updatePayload }
        );

        expect(updateResponse.status(), 'Expected status 200 when updating the created user').toBe(200);

        const updated = await updateResponse.json();

        expect(updated.email, 'Expected the response to reflect the updated email').toBe(updatePayload.email);
        expect(updated.username, 'Expected the response to reflect the updated username').toBe(
            updatePayload.username
        );

        const deleteResponse = await request.delete(
            `${BASE_URL}${Routes.DELETE_USER.replace('{id}', String(created.id))}`
        );

        expect(deleteResponse.status(), 'Expected status 200 when deleting the created user').toBe(200);
    });

    // ---------------------------------------------------------
    // Cart CRUD Workflow
    // ---------------------------------------------------------

    test('Cart CRUD Workflow @master @regression @end-to-end @api', async ({ request }) => {

        const createPayload = RandomDataUtil.generateCartPayload(USER_ID);

        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, {
            data: createPayload,
        });

        expect(createResponse.status(), 'Expected status 201 when creating a cart').toBe(201);

        const created = await createResponse.json();

        expect(created.id, 'Expected a generated cart id to be returned').toBeTruthy();
        expect(created.userId, 'Expected the created cart to belong to the requested user').toBe(USER_ID);
        expect(created.products, 'Expected the created cart to contain the submitted products').toEqual(
            createPayload.products
        );

        const updatePayload = RandomDataUtil.generateUpdatedCartPayload(created.userId);

        const updateResponse = await request.put(
            `${BASE_URL}${Routes.UPDATE_CART.replace('{id}', String(created.id))}`,
            { data: updatePayload }
        );

        expect(updateResponse.status(), 'Expected status 200 when updating the created cart').toBe(200);

        const updated = await updateResponse.json();

        expect(updated.id, 'Expected the updated cart id to match the created cart id').toBe(created.id);
        expect(updated.products[0].quantity, 'Expected the response to reflect the updated quantity').toBe(
            updatePayload.products[0].quantity
        );

        const deleteResponse = await request.delete(
            `${BASE_URL}${Routes.DELETE_CART.replace('{id}', String(created.id))}`
        );

        expect(deleteResponse.status(), 'Expected status 200 when deleting the created cart').toBe(200);
    });
});

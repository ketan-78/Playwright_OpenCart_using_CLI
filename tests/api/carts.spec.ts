/**
 * Test Case: FakeStore Carts API
 *
 * Tags: @master @sanity @regression @api
 *
 * Scenarios:
 * 1) Get all carts
 * 2) Get a cart by ID
 * 3) Get carts by date range
 * 4) Get a user's carts
 * 5) Get carts with a limit
 * 6) Sort carts ascending / descending
 * 7) Create, update and delete a cart
 */

import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Carts API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || 'https://fakestoreapi.com';
    const CART_ID = Number(process.env.CART_ID ?? 1);
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);
    const START_DATE = process.env.START_DATE || '2019-12-10';
    const END_DATE = process.env.END_DATE || '2020-10-10';

    // ---------------------------------------------------------
    // GET - All Carts
    // ---------------------------------------------------------

    test('GET - All Carts @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CARTS}`);

        expect(response.status(), 'Expected status 200 when fetching all carts').toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'Expected the response body to be an array').toBeTruthy();
        expect(responseBody.length, 'Expected the cart array to be non-empty').toBeGreaterThan(0);
        responseBody.forEach((cart: any) => {
            expect(typeof cart.id, 'Expected cart id to be a number').toBe('number');
            expect(typeof cart.userId, 'Expected cart userId to be a number').toBe('number');
            expect(Array.isArray(cart.products), 'Expected cart products to be an array').toBeTruthy();
        });
    });

    // ---------------------------------------------------------
    // GET - Cart by ID
    // ---------------------------------------------------------

    test('GET - Cart by ID @master @sanity @api', async ({ request }) => {

        const response = await request.get(
            `${BASE_URL}${Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID))}`
        );

        expect(response.status(), `Expected status 200 for cart ${CART_ID}`).toBe(200);

        const cart = await response.json();

        expect(cart.id, 'Expected the returned cart id to match the requested id').toBe(CART_ID);
        expect(typeof cart.userId, 'Expected cart userId to be a number').toBe('number');
        expect(Array.isArray(cart.products), 'Expected cart products to be an array').toBeTruthy();
    });

    // ---------------------------------------------------------
    // GET - Carts by Date Range
    // ---------------------------------------------------------

    test('GET - Carts by Date Range @master @regression @api', async ({ request }) => {

        const dateRangeRoute = Routes.GET_CARTS_BY_DATE_RANGE
            .replace('{startdate}', START_DATE)
            .replace('{enddate}', END_DATE);

        const response = await request.get(`${BASE_URL}${dateRangeRoute}`);

        expect(response.status(), 'Expected status 200 when filtering carts by date range').toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'Expected the response body to be an array').toBeTruthy();
        responseBody.forEach((cart: any) => {
            const cartDate = new Date(cart.date).getTime();
            expect(cartDate, `Expected cart ${cart.id} to be on or after ${START_DATE}`).toBeGreaterThanOrEqual(
                new Date(START_DATE).getTime()
            );
            expect(cartDate, `Expected cart ${cart.id} to be on or before ${END_DATE}`).toBeLessThanOrEqual(
                new Date(`${END_DATE}T23:59:59.999Z`).getTime()
            );
        });
    });

    // ---------------------------------------------------------
    // GET - User Cart
    // ---------------------------------------------------------

    test('GET - User Cart @master @regression @api', async ({ request }) => {

        const response = await request.get(
            `${BASE_URL}${Routes.GET_USER_CART.replace('{userId}', String(USER_ID))}`
        );

        expect(response.status(), `Expected status 200 for user ${USER_ID} carts`).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'Expected the response body to be an array').toBeTruthy();
        expect(responseBody.length, `Expected at least one cart for user ${USER_ID}`).toBeGreaterThan(0);
        responseBody.forEach((cart: any) => {
            expect(cart.userId, `Expected every cart to belong to user ${USER_ID}`).toBe(USER_ID);
        });
    });

    // ---------------------------------------------------------
    // GET - Carts with Limit
    // ---------------------------------------------------------

    test('GET - Carts with Limit @master @sanity @api', async ({ request }) => {

        const response = await request.get(
            `${BASE_URL}${Routes.GET_CARTS_WITH_LIMIT.replace('{limit}', String(LIMIT))}`
        );

        expect(response.status(), `Expected status 200 for limit ${LIMIT}`).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'Expected the response body to be an array').toBeTruthy();
        expect(responseBody.length, `Expected the response to contain exactly ${LIMIT} carts`).toBe(LIMIT);
    });

    // ---------------------------------------------------------
    // GET - Carts Sorted Ascending
    // ---------------------------------------------------------

    test('GET - Carts Sorted Ascending @master @regression @api', async ({ request }) => {

        const response = await request.get(
            `${BASE_URL}${Routes.GET_CARTS_SORTED.replace('{order}', 'asc')}`
        );

        expect(response.status(), 'Expected status 200 for ascending sort').toBe(200);

        const responseBody = await response.json();
        const ids = responseBody.map((cart: any) => cart.id);
        const ascendingIds = [...ids].sort((a, b) => a - b);

        expect(ids, 'Expected cart ids in ascending order').toEqual(ascendingIds);
    });

    // ---------------------------------------------------------
    // GET - Carts Sorted Descending
    // ---------------------------------------------------------

    test('GET - Carts Sorted Descending @master @regression @api', async ({ request }) => {

        const response = await request.get(
            `${BASE_URL}${Routes.GET_CARTS_SORTED.replace('{order}', 'desc')}`
        );

        expect(response.status(), 'Expected status 200 for descending sort').toBe(200);

        const responseBody = await response.json();
        const ids = responseBody.map((cart: any) => cart.id);
        const descendingIds = [...ids].sort((a, b) => b - a);

        expect(ids, 'Expected cart ids in descending order').toEqual(descendingIds);
    });

    // ---------------------------------------------------------
    // POST - Create Cart
    // ---------------------------------------------------------

    test('POST - Create Cart @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateCartPayload(USER_ID);

        const response = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: payload });

        expect(response.status(), 'Expected status 201 when creating a cart').toBe(201);

        const created = await response.json();

        expect(created.id, 'Expected a generated cart id to be returned').toBeTruthy();
        expect(created.userId, 'Expected the response to contain the submitted user id').toBe(USER_ID);
        expect(created.products, 'Expected the response to contain the submitted products').toEqual(payload.products);
    });

    // ---------------------------------------------------------
    // PUT - Update Cart
    // ---------------------------------------------------------

    test('PUT - Update Cart @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUpdatedCartPayload(USER_ID);

        const response = await request.put(
            `${BASE_URL}${Routes.UPDATE_CART.replace('{id}', String(CART_ID))}`,
            { data: payload }
        );

        expect(response.status(), `Expected status 200 when updating cart ${CART_ID}`).toBe(200);

        const updated = await response.json();

        expect(updated.id, 'Expected the returned cart id to match the requested id').toBe(CART_ID);
        expect(updated.products[0].quantity, 'Expected the response to reflect the updated quantity').toBe(
            payload.products[0].quantity
        );
    });

    // ---------------------------------------------------------
    // DELETE - Cart
    // ---------------------------------------------------------

    test('DELETE - Cart @master @regression @api', async ({ request }) => {

        const response = await request.delete(
            `${BASE_URL}${Routes.DELETE_CART.replace('{id}', String(CART_ID))}`
        );

        expect(response.status(), `Expected status 200 when deleting cart ${CART_ID}`).toBe(200);

        const deleted = await response.json();

        expect(deleted.id, 'Expected the deleted cart response to contain the cart id').toBe(CART_ID);
    });
});

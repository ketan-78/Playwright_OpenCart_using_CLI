/**
 * Test Case: FakeStore Users API
 *
 * Tags: @master @sanity @regression @api
 *
 * Scenarios:
 * 1) Get all users
 * 2) Get a user by ID
 * 3) Get users with a limit
 * 4) Sort users ascending / descending
 * 5) Create, update and delete a user
 */

import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Users API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || 'https://fakestoreapi.com';
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);

    // ---------------------------------------------------------
    // GET - All Users
    // ---------------------------------------------------------

    test('GET - All Users @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_USERS}`);

        expect(response.status(), 'Expected status 200 when fetching all users').toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'Expected the response body to be an array').toBeTruthy();
        expect(responseBody.length, 'Expected the user array to be non-empty').toBeGreaterThan(0);
        responseBody.forEach((user: any) => {
            expect(typeof user.id, 'Expected user id to be a number').toBe('number');
            expect(typeof user.email, 'Expected user email to be a string').toBe('string');
            expect(typeof user.username, 'Expected user username to be a string').toBe('string');
        });
    });

    // ---------------------------------------------------------
    // GET - User by ID
    // ---------------------------------------------------------

    test('GET - User by ID @master @sanity @api', async ({ request }) => {

        const response = await request.get(
            `${BASE_URL}${Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID))}`
        );

        expect(response.status(), `Expected status 200 for user ${USER_ID}`).toBe(200);

        const user = await response.json();

        expect(user.id, 'Expected the returned user id to match the requested id').toBe(USER_ID);
        expect(typeof user.email, 'Expected user email to be a string').toBe('string');
        expect(typeof user.username, 'Expected user username to be a string').toBe('string');
    });

    // ---------------------------------------------------------
    // GET - Users with Limit
    // ---------------------------------------------------------

    test('GET - Users with Limit @master @sanity @api', async ({ request }) => {

        const response = await request.get(
            `${BASE_URL}${Routes.GET_USERS_WITH_LIMIT.replace('{limit}', String(LIMIT))}`
        );

        expect(response.status(), `Expected status 200 for limit ${LIMIT}`).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'Expected the response body to be an array').toBeTruthy();
        expect(responseBody.length, `Expected the response to contain exactly ${LIMIT} users`).toBe(LIMIT);
    });

    // ---------------------------------------------------------
    // GET - Users Sorted Ascending
    // ---------------------------------------------------------

    test('GET - Users Sorted Ascending @master @regression @api', async ({ request }) => {

        const response = await request.get(
            `${BASE_URL}${Routes.GET_USERS_SORTED.replace('{order}', 'asc')}`
        );

        expect(response.status(), 'Expected status 200 for ascending sort').toBe(200);

        const responseBody = await response.json();
        const ids = responseBody.map((user: any) => user.id);
        const ascendingIds = [...ids].sort((a, b) => a - b);

        expect(ids, 'Expected user ids in ascending order').toEqual(ascendingIds);
    });

    // ---------------------------------------------------------
    // GET - Users Sorted Descending
    // ---------------------------------------------------------

    test('GET - Users Sorted Descending @master @regression @api', async ({ request }) => {

        const response = await request.get(
            `${BASE_URL}${Routes.GET_USERS_SORTED.replace('{order}', 'desc')}`
        );

        expect(response.status(), 'Expected status 200 for descending sort').toBe(200);

        const responseBody = await response.json();
        const ids = responseBody.map((user: any) => user.id);
        const descendingIds = [...ids].sort((a, b) => b - a);

        expect(ids, 'Expected user ids in descending order').toEqual(descendingIds);
    });

    // ---------------------------------------------------------
    // POST - Create User
    // ---------------------------------------------------------

    test('POST - Create User @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUserPayload();

        const response = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: payload });

        expect(response.status(), 'Expected status 201 when creating a user').toBe(201);

        // The create-user contract returns only the generated id.
        const created = await response.json();

        expect(created.id, 'Expected a generated user id to be returned').toBeTruthy();
        expect(typeof created.id, 'Expected the generated user id to be a number').toBe('number');
    });

    // ---------------------------------------------------------
    // PUT - Update User
    // ---------------------------------------------------------

    test('PUT - Update User @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUserUpdatePayload();

        const response = await request.put(
            `${BASE_URL}${Routes.UPDATE_USER.replace('{id}', String(USER_ID))}`,
            { data: payload }
        );

        expect(response.status(), `Expected status 200 when updating user ${USER_ID}`).toBe(200);

        const updated = await response.json();

        expect(updated.email, 'Expected the response to reflect the updated email').toBe(payload.email);
        expect(updated.username, 'Expected the response to reflect the updated username').toBe(payload.username);
        expect(updated.name.firstname, 'Expected the response to reflect the updated first name').toBe(
            payload.name.firstname
        );
    });

    // ---------------------------------------------------------
    // DELETE - User
    // ---------------------------------------------------------

    test('DELETE - User @master @regression @api', async ({ request }) => {

        const response = await request.delete(
            `${BASE_URL}${Routes.DELETE_USER.replace('{id}', String(USER_ID))}`
        );

        expect(response.status(), `Expected status 200 when deleting user ${USER_ID}`).toBe(200);

        const deleted = await response.json();

        expect(deleted.id, 'Expected the deleted user response to contain the user id').toBe(USER_ID);
    });
});

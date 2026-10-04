/**
 * Test Case: FakeStore Authentication API
 *
 * Tags: @master @sanity @regression @api
 *
 * Scenarios:
 * 1) Successful login returns status 201 and a non-empty token
 * 2) Invalid login returns status 401 with the expected error message
 */

import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

// `USERNAME` is a built-in Windows environment variable, so `override: true` ensures the
// API credentials defined in `.env` take precedence over the operating-system value.
dotenv.config({ override: true });

test.describe('Authentication API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || 'https://fakestoreapi.com';
    const USERNAME = process.env.USERNAME || 'mor_2314';
    const PASSWORD = process.env.PASSWORD || '83r5^_';

    // ---------------------------------------------------------
    // POST - Successful Login
    // ---------------------------------------------------------

    test('POST - Successful Login @master @sanity @api', async ({ request }) => {

        const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
            data: { username: USERNAME, password: PASSWORD },
        });

        expect(response.status(), 'Expected status 201 for valid credentials').toBe(201);

        const responseBody = await response.json();

        expect(responseBody.token, 'Expected an authentication token in the response').toBeTruthy();
        expect(typeof responseBody.token, 'Expected the token to be a string').toBe('string');
        expect(responseBody.token.length, 'Expected the token to be a non-empty string').toBeGreaterThan(0);
    });

    // ---------------------------------------------------------
    // POST - Invalid Login
    // ---------------------------------------------------------

    test('POST - Invalid Login @master @sanity @api', async ({ request }) => {

        const payload = RandomDataUtil.generateInvalidLoginPayload();

        const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
            data: payload,
        });

        expect(response.status(), 'Expected status 401 for invalid credentials').toBe(401);

        // The API returns this error as a plain-text body, so read it as text.
        const responseBody = await response.text();

        expect(responseBody, 'Expected the authentication error message').toContain(
            'username or password is incorrect'
        );
    });
});

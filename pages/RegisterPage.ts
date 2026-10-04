import { Page, Locator } from '@playwright/test';
import { AccountSuccessPage } from './AccountSuccessPage';

export class RegisterPage {
    private readonly page: Page;

    // Locators
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly emailInput: Locator;
    private readonly telephoneInput: Locator;
    private readonly passwordInput: Locator;
    private readonly confirmPasswordInput: Locator;
    private readonly privacyPolicyCheckbox: Locator;
    private readonly continueButton: Locator;
    private readonly pageHeading: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.firstNameInput = page.locator('#input-firstname');
        this.lastNameInput = page.locator('#input-lastname');
        this.emailInput = page.locator('#input-email');
        this.telephoneInput = page.locator('#input-telephone');
        this.passwordInput = page.locator('#input-password');
        this.confirmPasswordInput = page.locator('#input-confirm');
        this.privacyPolicyCheckbox = page.locator('input[name="agree"]');
        this.continueButton = page.locator('input[type="submit"][value="Continue"]');
        this.pageHeading = page.locator('#content h1', { hasText: 'Register Account' });
    }

    /**
     * Fills the complete registration form with the supplied customer details
     * @param firstName - Customer first name
     * @param lastName - Customer last name
     * @param email - Customer email address
     * @param telephone - Customer telephone number
     * @param password - Customer password
     */
    async completeRegistration(firstName: string, lastName: string, email: string, telephone: string, password: string): Promise<void> {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.emailInput.fill(email);
        await this.telephoneInput.fill(telephone);
        await this.passwordInput.fill(password);
        await this.confirmPasswordInput.fill(password);
    }

    /**
     * Accepts the Privacy Policy checkbox
     */
    async acceptPrivacyPolicy(): Promise<void> {
        await this.privacyPolicyCheckbox.check();
    }

    /**
     * Submits the registration form
     * @returns Promise<AccountSuccessPage> - Instance of the account created confirmation page
     */
    async clickContinue(): Promise<AccountSuccessPage> {
        await this.continueButton.click();
        return new AccountSuccessPage(this.page);
    }

    /**
     * Verifies the registration page is displayed.
     * Waits for the heading because the page is loaded remotely and may render after navigation.
     * @returns Promise<boolean> - true if the registration page is displayed
     */
    async isRegisterPageExists(): Promise<boolean> {
        try {
            await this.pageHeading.waitFor({ state: 'visible', timeout: 15 * 1000 });
            return true;
        } catch (error) {
            console.log(`Error checking registration page: ${error}`);
            return false;
        }
    }
}

export class Helper {
    static convertPriceToNumber(price: string): number {
        const numericValue = price.replace(/[^0-9.]/g, '');
        return Number(numericValue);
    }

    static getProductDetails() {
        return {
            productName: 'MacBook',
            productQuantity: '1',
            totalPrice: '$602.00',
        };
    }

    static getLoginDetails() {
        return {
            email: 'ketan@gmail.com',
            password: 'password@123',
        };
    }
}

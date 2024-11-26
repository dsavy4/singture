const paypal = require('@paypal/checkout-server-sdk');

// Configure PayPal Environment
const environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID, 
    process.env.PAYPAL_CLIENT_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

// Function to create a payment (reserve)
async function createPayment(amount, currency) {
    try {
        const request = new paypal.orders.OrdersCreateRequest();
        request.requestBody({
            intent: 'CAPTURE',  // "AUTHORIZE" if funds should be captured later
            purchase_units: [{
                amount: {
                    currency_code: currency,
                    value: amount
                }
            }]
        });

        const response = await client.execute(request);
        return response.result;  // Returns the PayPal order object
    } catch (error) {
        console.error('Error creating payment:', error.message);
        throw new Error('Failed to create PayPal payment');
    }
}

// Function to capture payment (release funds)
async function capturePayment(orderId) {
    try {
        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});

        const response = await client.execute(request);
        return response.result;  // Returns the captured payment object
    } catch (error) {
        console.error('Error capturing payment:', error.message);
        throw new Error('Failed to capture PayPal payment');
    }
}

// Function to refund payment
async function refundPayment(captureId, amount, currency) {
    try {
        const request = new paypal.payments.CapturesRefundRequest(captureId);
        request.requestBody({
            amount: {
                currency_code: currency,
                value: amount
            }
        });

        const response = await client.execute(request);
        return response.result;  // Returns the refund object
    } catch (error) {
        console.error('Error refunding payment:', error.message);
        throw new Error('Failed to process PayPal refund');
    }
}

// Helper function to log detailed response (optional, for debugging)
function logResponse(response) {
    console.log(`Response: ${JSON.stringify(response, null, 2)}`);
}

module.exports = {
    createPayment,
    capturePayment,
    refundPayment,
};

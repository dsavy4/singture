const cron = require('node-cron');
const { refundPayment } = require('../services/paymentProvider');  // Import your payment provider logic
const SongRequest = require('../models/songRequest');  // Import the SongRequest model
const PaymentLog = require('../models/paymentLog');    // Import the PaymentLog model for logging transactions

// Cron job to check for expired requests and process refunds
cron.schedule('0 0 * * *', async () => {  // Runs every day at midnight
    try {
        console.log('Running cron job to check for expired song requests...');
        
        // Find requests that are pending and expired
        const expiredRequests = await SongRequest.find({
            status: 'Pending',
            expirationTime: { $lte: new Date() }
        });

        for (let request of expiredRequests) {
            if (request.paymentStatus === 'Reserved') {
                try {
                    // Refund the payment to the buyer
                    const refundResult = await refundPayment(request.captureId, request.budget, 'USD'); // Ensure 'captureId' is correctly set

                    // Log the refund transaction
                    await PaymentLog.create({
                        songRequestId: request._id,
                        transactionType: 'Refund',
                        amount: request.budget,
                        currency: 'USD',
                        status: 'Success',
                        transactionId: refundResult.id,  // PayPal refund transaction ID
                        message: 'Refund processed successfully.'
                    });

                    // Update the song request status
                    request.status = 'Refunded';
                    request.paymentStatus = 'Refunded';
                    await request.save();
                    console.log(`Refunded request ${request._id} successfully.`);
                } catch (refundError) {
                    // Log the failure
                    await PaymentLog.create({
                        songRequestId: request._id,
                        transactionType: 'Refund',
                        amount: request.budget,
                        currency: 'USD',
                        status: 'Failed',
                        message: refundError.message
                    });
                    console.error(`Failed to refund request ${request._id}:`, refundError);
                }
            }
        }
        console.log('Cron job completed.');
    } catch (error) {
        console.error('Error processing expired song requests:', error);
    }
});

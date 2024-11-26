const mongoose = require('mongoose');

const paymentLogSchema = new mongoose.Schema({
    songRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'SongRequest', required: true },
    transactionType: { type: String, enum: ['Reserve', 'Release', 'Refund'], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, enum: ['Success', 'Failed'], required: true },
    transactionId: { type: String },  // PayPal transaction ID
    message: { type: String },  // Additional info or error messages
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.models.PaymentLog || mongoose.model('payment_log', paymentLogSchema);

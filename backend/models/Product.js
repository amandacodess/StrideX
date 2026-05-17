const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    orderId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    userId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User',  required: true },
    transactionId: { type: String, required: true, unique: true },
    amount:        { type: Number, required: true },
    paymentMethod: { type: String, default: 'simulated' },
    paymentStatus: { type: String, enum: ['Paid', 'Failed', 'Pending'], default: 'Paid' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
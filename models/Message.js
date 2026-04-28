// const mongoose = require('mongoose');

// const messageSchema = new mongoose.Schema(
//   {
//     senderId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//       index: true
//     },
//     receiverId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//       index: true
//     },
//     content: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     readAt: {
//       type: Date,
//       default: null
//     }
//   },
//   {
//     timestamps: true
//   }
// );

// module.exports = mongoose.models.Message || mongoose.model('Message', messageSchema);
// models/Message.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    senderId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    receiverId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content:     { type: String, required: true, trim: true, maxlength: 4000 },
    clientId:    { type: String, default: null }, // sender-generated UUID for optimistic UI + idempotency
    deliveredAt: { type: Date, default: null },
    readAt:      { type: Date, default: null },
  },
  { timestamps: true }
);

// Conversation lookups
MessageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });
MessageSchema.index({ receiverId: 1, readAt: 1 });
// Idempotency: same sender can't insert the same clientId twice
MessageSchema.index(
  { senderId: 1, clientId: 1 },
  { unique: true, partialFilterExpression: { clientId: { $type: 'string' } } }
);

module.exports = mongoose.model('Message', MessageSchema);

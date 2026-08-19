const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'senderModel' },
    senderModel: { type: String, required: true, enum: ['Candidate', 'Company'] },
    text: { type: String, required: true, trim: true, maxlength: 4000 },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

messageSchema.index({ conversationId: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);

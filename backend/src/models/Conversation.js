const mongoose = require('mongoose');

/**
 * A 1:1 chat thread. Participants are stored as two explicit slots
 * (rather than an array) so a unique index can enforce "only one
 * conversation between any two accounts" regardless of who started it —
 * see the pre-save hook below, which canonically orders the pair.
 *
 * lastMessage is denormalized onto the conversation so the conversation
 * list screen can render previews without a join per row.
 */
const conversationSchema = new mongoose.Schema(
  {
    participantOneId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'participantOneModel' },
    participantOneModel: { type: String, required: true, enum: ['Candidate', 'Company'] },
    participantTwoId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'participantTwoModel' },
    participantTwoModel: { type: String, required: true, enum: ['Candidate', 'Company'] },

    lastMessage: {
      text: { type: String, default: '' },
      senderId: { type: mongoose.Schema.Types.ObjectId, default: null },
      createdAt: { type: Date, default: null },
    },

    // Unread count kept per side so the conversation list can show a
    // badge for "me" without counting unread messages on every fetch.
    unreadCountOne: { type: Number, default: 0, min: 0 },
    unreadCountTwo: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

conversationSchema.index(
  { participantOneId: 1, participantTwoId: 1 },
  { unique: true }
);
conversationSchema.index({ participantOneId: 1, updatedAt: -1 });
conversationSchema.index({ participantTwoId: 1, updatedAt: -1 });

module.exports = mongoose.model('Conversation', conversationSchema);

const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Candidate = require('../models/Candidate');
const Company = require('../models/Company');
const ContactUnlock = require('../models/ContactUnlock');
const { notify } = require('../utils/notify');

const MODEL_BY_ROLE = { candidate: 'Candidate', company: 'Company' };
const DOC_MODEL = { Candidate, Company };

/**
 * Messaging is a benefit of an existing hire (a Company that hired this
 * Candidate, or a Candidate that hired this Candidate as a project
 * partner) — mirrors the contact-unlock gating used everywhere else in
 * the app, so chat can't be used to route around paying to unlock
 * contact details.
 */
async function hasHireRelationship(aId, aModel, bId, bModel) {
  if (aModel === 'Company' && bModel === 'Candidate') {
    return ContactUnlock.exists({ companyId: aId, candidateId: bId, hirerType: 'company' });
  }
  if (aModel === 'Candidate' && bModel === 'Company') {
    return ContactUnlock.exists({ companyId: bId, candidateId: aId, hirerType: 'company' });
  }
  if (aModel === 'Candidate' && bModel === 'Candidate') {
    return ContactUnlock.exists({
      hirerType: 'candidate',
      $or: [
        { hiringCandidateId: aId, candidateId: bId },
        { hiringCandidateId: bId, candidateId: aId },
      ],
    });
  }
  return false;
}

function isParticipantOne(conversation, userId) {
  return String(conversation.participantOneId) === String(userId);
}

/** Loads display info (name, avatar) for whichever slot isn't "me". */
async function loadOtherParticipant(conversation, meId) {
  const otherIsOne = !isParticipantOne(conversation, meId);
  const otherId = otherIsOne ? conversation.participantOneId : conversation.participantTwoId;
  const otherModel = otherIsOne ? conversation.participantOneModel : conversation.participantTwoModel;
  const Model = DOC_MODEL[otherModel];
  const fields = otherModel === 'Company' ? 'companyName logo' : 'name profileImage headline';
  const doc = await Model.findById(otherId).select(fields);
  return {
    id: otherId,
    model: otherModel,
    name: otherModel === 'Company' ? doc?.companyName : doc?.name,
    avatar: otherModel === 'Company' ? doc?.logo : doc?.profileImage,
    headline: doc?.headline,
  };
}

/**
 * GET /api/v1/chat/conversations
 */
const getConversations = asyncHandler(async (req, res) => {
  const meId = req.user._id;
  const meModel = MODEL_BY_ROLE[req.user.role];
  if (!meModel) throw ApiError.forbidden('Only candidates and companies can use chat');

  const conversations = await Conversation.find({
    $or: [{ participantOneId: meId }, { participantTwoId: meId }],
  }).sort('-updatedAt');

  const withOther = await Promise.all(
    conversations.map(async (c) => ({
      _id: c._id,
      other: await loadOtherParticipant(c, meId),
      lastMessage: c.lastMessage,
      unreadCount: isParticipantOne(c, meId) ? c.unreadCountOne : c.unreadCountTwo,
      updatedAt: c.updatedAt,
    }))
  );

  return new ApiResponse(200, { conversations: withOther }, 'Conversations fetched').send(res);
});

/**
 * POST /api/v1/chat/conversations
 * Body: { otherUserId, otherUserModel: 'Candidate' | 'Company' }
 * Get-or-create — idempotent, returns the existing thread if one
 * already exists between these two accounts.
 */
const openConversation = asyncHandler(async (req, res) => {
  const { otherUserId, otherUserModel } = req.body;
  const meId = req.user._id;
  const meModel = MODEL_BY_ROLE[req.user.role];

  if (!meModel) throw ApiError.forbidden('Only candidates and companies can use chat');
  if (!otherUserId || !['Candidate', 'Company'].includes(otherUserModel)) {
    throw ApiError.badRequest('otherUserId and a valid otherUserModel are required');
  }
  if (String(otherUserId) === String(meId) && otherUserModel === meModel) {
    throw ApiError.badRequest('Cannot start a conversation with yourself');
  }

  const allowed = await hasHireRelationship(meId, meModel, otherUserId, otherUserModel);
  if (!allowed) {
    throw ApiError.forbidden('You can only message accounts you have an active hire with');
  }

  // Canonical ordering so the same pair always maps to the same document.
  const [a, b] = [
    { id: meId, model: meModel },
    { id: otherUserId, model: otherUserModel },
  ].sort((x, y) => String(x.id).localeCompare(String(y.id)));

  let conversation = await Conversation.findOne({
    participantOneId: a.id,
    participantTwoId: b.id,
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participantOneId: a.id,
      participantOneModel: a.model,
      participantTwoId: b.id,
      participantTwoModel: b.model,
    });
  }

  const other = await loadOtherParticipant(conversation, meId);
  return new ApiResponse(200, {
    conversation: {
      _id: conversation._id,
      other,
      lastMessage: conversation.lastMessage,
      unreadCount: isParticipantOne(conversation, meId) ? conversation.unreadCountOne : conversation.unreadCountTwo,
    },
  }, 'Conversation ready').send(res);
});

/**
 * GET /api/v1/chat/conversations/:id/messages
 * Marks all of the other participant's messages as read as a side
 * effect of viewing the thread, and zeroes my unread counter.
 */
const getMessages = asyncHandler(async (req, res) => {
  const meId = req.user._id;
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) throw ApiError.notFound('Conversation not found');

  const iAmOne = isParticipantOne(conversation, meId);
  const iAmParticipant = iAmOne || String(conversation.participantTwoId) === String(meId);
  if (!iAmParticipant) throw ApiError.forbidden('Not a participant in this conversation');

  const { page = 1, limit = 30 } = req.query;
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));

  const [messages, total] = await Promise.all([
    Message.find({ conversationId: conversation._id })
      .sort('-createdAt')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Message.countDocuments({ conversationId: conversation._id }),
  ]);

  await Message.updateMany(
    { conversationId: conversation._id, senderId: { $ne: meId }, isRead: false },
    { isRead: true }
  );
  if (iAmOne) conversation.unreadCountOne = 0;
  else conversation.unreadCountTwo = 0;
  await conversation.save();

  return new ApiResponse(200, {
    messages: messages.reverse(),
    pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
  }, 'Messages fetched').send(res);
});

/**
 * POST /api/v1/chat/conversations/:id/messages
 * Body: { text }
 */
const sendMessage = asyncHandler(async (req, res) => {
  const meId = req.user._id;
  const meModel = MODEL_BY_ROLE[req.user.role];
  const { text } = req.body;

  if (!text || !text.trim()) throw ApiError.badRequest('Message text is required');

  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) throw ApiError.notFound('Conversation not found');

  const iAmOne = isParticipantOne(conversation, meId);
  const iAmParticipant = iAmOne || String(conversation.participantTwoId) === String(meId);
  if (!iAmParticipant) throw ApiError.forbidden('Not a participant in this conversation');

  const trimmed = text.trim();
  const message = await Message.create({
    conversationId: conversation._id,
    senderId: meId,
    senderModel: meModel,
    text: trimmed,
  });

  conversation.lastMessage = { text: trimmed, senderId: meId, createdAt: message.createdAt };
  if (iAmOne) conversation.unreadCountTwo += 1;
  else conversation.unreadCountOne += 1;
  await conversation.save();

  const recipientId = iAmOne ? conversation.participantTwoId : conversation.participantOneId;
  const recipientModel = iAmOne ? conversation.participantTwoModel : conversation.participantOneModel;
  const senderName = meModel === 'Company' ? req.user.companyName : req.user.name;

  await notify({
    userId: recipientId,
    userModel: recipientModel,
    title: senderName || 'New message',
    message: trimmed.length > 120 ? `${trimmed.slice(0, 117)}...` : trimmed,
    type: 'message',
    data: { conversationId: String(conversation._id) },
  });

  return new ApiResponse(201, { message }, 'Message sent').send(res);
});

module.exports = { getConversations, openConversation, getMessages, sendMessage };

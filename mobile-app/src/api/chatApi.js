import api from './client';

// Maps 1:1 to backend/src/routes/chatRoutes.js
export const chatApi = {
  getConversations: () => api.get('/chat/conversations'),
  openConversation: (otherUserId, otherUserModel) => api.post('/chat/conversations', { otherUserId, otherUserModel }),
  getMessages: (conversationId, params) => api.get(`/chat/conversations/${conversationId}/messages`, { params }),
  sendMessage: (conversationId, text) => api.post(`/chat/conversations/${conversationId}/messages`, { text }),
};

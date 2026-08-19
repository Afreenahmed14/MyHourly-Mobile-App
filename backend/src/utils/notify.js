const Notification = require('../models/Notification');
const Candidate = require('../models/Candidate');
const Company = require('../models/Company');
const Admin = require('../models/Admin');
const { sendExpoPush } = require('./pushService');

const MODEL_BY_NAME = { Candidate, Company, Admin };

/**
 * Creates the in-app Notification row (unchanged behaviour) AND, if the
 * recipient has a registered device, sends a real mobile OS push
 * notification for it. This is now the single place notifications are
 * created — controllers should call this instead of `Notification.create`
 * directly so push delivery can't be forgotten on a new call site.
 *
 * @param {{ userId: string, userModel: 'Candidate'|'Company'|'Admin', title: string, message: string, type?: string, data?: object }} params
 */
async function notify({ userId, userModel, title, message, type = 'info', data = {} }) {
  const notification = await Notification.create({ userId, userModel, title, message, type });

  const Model = MODEL_BY_NAME[userModel];
  if (Model) {
    const recipient = await Model.findById(userId).select('pushToken');
    if (recipient?.pushToken) {
      await sendExpoPush(recipient.pushToken, {
        title,
        body: message,
        data: { type, notificationId: String(notification._id), ...data },
      });
    }
  }

  return notification;
}

module.exports = { notify };

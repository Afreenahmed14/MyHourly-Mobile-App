const EXPO_PUSH_ENDPOINT = 'https://exp.host/--/api/v2/push/send';

/**
 * Sends a real mobile OS push notification via Expo's push service.
 * Silently no-ops (and logs) on failure — a missing/invalid token or a
 * flaky push service should never break the request that triggered the
 * notification (e.g. submitting an application).
 *
 * @param {string|null|undefined} token - Expo push token, e.g. "ExponentPushToken[xxxx]".
 * @param {{ title: string, body: string, data?: object }} message
 */
async function sendExpoPush(token, { title, body, data = {} }) {
  if (!token || !token.startsWith('ExponentPushToken')) return;

  try {
    const res = await fetch(EXPO_PUSH_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: token,
        title,
        body,
        data,
        sound: 'default',
        priority: 'high',
      }),
    });

    const json = await res.json().catch(() => null);
    const error = json?.data?.details?.error || json?.data?.[0]?.details?.error;
    if (error === 'DeviceNotRegistered') {
      // Token is stale (app uninstalled/reinstalled). Caller can catch
      // this by re-registering on next login; nothing to do here.
      return;
    }
    if (json?.data?.status === 'error' || json?.errors) {
      console.error('Expo push error:', JSON.stringify(json));
    }
  } catch (err) {
    console.error('Failed to send push notification:', err.message);
  }
}

module.exports = { sendExpoPush };

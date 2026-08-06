import { createContext, useCallback, useEffect, useState } from 'react';
import { subscriptionApi } from '../api/subscriptionApi';
import { useAuth } from './useAuth';

export const SubscriptionContext = createContext(null);

/**
 * Native port of frontend/src/context/SubscriptionContext.jsx. Loads the
 * current user's subscription status (plan, quotas, usage) whenever a
 * user is authenticated, and exposes a refresh() other screens call after
 * a purchase/cancel so the whole app sees the new plan immediately.
 */
export function SubscriptionProvider({ children }) {
  const { isAuthenticated, role } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated || role === 'admin') {
      setSubscription(null);
      return;
    }
    setLoading(true);
    try {
      const res = await subscriptionApi.getStatus();
      setSubscription(res.data.data.subscription);
    } catch {
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, role]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <SubscriptionContext.Provider value={{ subscription, loading, refresh }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

import { useState, useCallback } from 'react';
import { isFeatureAvailable, getCurrentTier } from '../utils/subscriptionTiers';

export const useSubscriptionTier = (userSubscription) => {
  const [upgradeModal, setUpgradeModal] = useState({
    isOpen: false,
    featureKey: null
  });

  const currentTier = getCurrentTier(userSubscription);

  const checkFeatureAccess = useCallback((featureKey) => {
    return isFeatureAvailable(userSubscription, featureKey);
  }, [userSubscription]);

  const handleLockedFeatureClick = useCallback((featureKey, e) => {
    if (e) e.preventDefault();
    if (!checkFeatureAccess(featureKey)) {
      setUpgradeModal({
        isOpen: true,
        featureKey
      });
      return true;
    }
    return false;
  }, [checkFeatureAccess]);

  const closeUpgradeModal = useCallback(() => {
    setUpgradeModal({
      isOpen: false,
      featureKey: null
    });
  }, []);

  return {
    currentTier,
    checkFeatureAccess,
    handleLockedFeatureClick,
    closeUpgradeModal,
    upgradeModal
  };
};

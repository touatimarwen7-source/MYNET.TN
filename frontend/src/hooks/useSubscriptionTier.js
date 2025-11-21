import { useState, useCallback } from 'react';

export const useSubscriptionTier = (userSubscription) => {
  const [upgradeModal, setUpgradeModal] = useState({
    isOpen: false,
    featureKey: null
  });

  // ✅ Toutes les fonctionnalités sont disponibles pour tous
  const checkFeatureAccess = useCallback(() => {
    return true; // Toujours accessible
  }, []);

  const handleLockedFeatureClick = useCallback(() => {
    return false; // Aucune fonction verrouillée
  }, []);

  const closeUpgradeModal = useCallback(() => {
    setUpgradeModal({
      isOpen: false,
      featureKey: null
    });
  }, []);

  return {
    currentTier: 'enterprise', // Tier maximum pour tous
    checkFeatureAccess,
    handleLockedFeatureClick,
    closeUpgradeModal,
    upgradeModal
  };
};

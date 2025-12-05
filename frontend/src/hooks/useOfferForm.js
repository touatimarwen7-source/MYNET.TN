// Temporary shim: alias useOfferForm to useBidForm for shared logic
import { useBidForm } from './useBidForm';

export const useOfferForm = (...args) => {
  return useBidForm(...args);
};

export default useOfferForm;

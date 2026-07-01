import { useMemo } from 'react';

export function useTokenPreflight() {
  return useMemo(
    () => ({
      canProceed: true,
      warningMessage:
        'Token balance is low. Please buy more tokens to continue.'
    }),
    []
  );
}

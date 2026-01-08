import { useMemo } from 'react'
import useSafeInfo from '@/hooks/useSafeInfo'
import useWallet from '@/hooks/wallets/useWallet'
import { sameAddress } from '@safe-global/utils/utils/addresses'
import useAsync from '@safe-global/utils/hooks/useAsync'
import { isSmartContractWallet } from '@/utils/wallets'

/**
 * Returns true if the connected wallet address is a Smart Contract (Safe)
 * that is directly an owner of the current Safe.
 *
 * This is stricter than useIsNestedSafeOwner which returns true if the user
 * OWNS a Safe that is an owner. This hook checks if the wallet IS that Safe.
 *
 * Use case: Permission gates where signing is required (e.g., adding proposers).
 * When connected via Safe Apps/WalletConnect as a parent Safe, the wallet address
 * IS the parent Safe and can sign via EIP-1271.
 */
export const useIsWalletNestedOwner = () => {
  const wallet = useWallet()
  const { safe, safeLoaded } = useSafeInfo()

  const isWalletInOwners = useMemo(() => {
    if (!wallet || !safeLoaded) return false
    return safe.owners.some((owner) => sameAddress(owner.value, wallet.address))
  }, [wallet, safe.owners, safeLoaded])

  const [isSmartContract] = useAsync(async () => {
    if (!wallet || !isWalletInOwners) return false
    return isSmartContractWallet(wallet.chainId, wallet.address)
  }, [wallet, isWalletInOwners])

  return isWalletInOwners && isSmartContract === true
}

import type { BigNumberish, BytesLike } from 'ethers'

export type SpendingLimitState = {
  beneficiary: string
  token: {
    address: string
    symbol: string
    decimals?: number | null
    logoUri?: string
  }
  amount: string
  nonce: string
  resetTimeMin: string
  lastResetMin: string
  spent: string
}

export type NewSpendingLimitData = {
  beneficiary: string
  tokenAddress: string
  amount: string
  resetTime: string
}

export type SpendingLimitTxParams = {
  safeAddress: string
  token: string
  to: string
  amount: BigNumberish
  paymentToken: string
  payment: BigNumberish
  delegate: string
  signature: BytesLike
}

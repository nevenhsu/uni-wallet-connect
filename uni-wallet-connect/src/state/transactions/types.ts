interface SerializableTransactionReceipt {
  to: string
  from: string
  contractAddress: string
  transactionIndex: number
  blockHash: string
  transactionHash: string
  blockNumber: number
  status?: number
}

/**
 * Be careful adding to this enum, always assign a unique value (typescript will not prevent duplicate values).
 * These values is persisted in state and if you change the value it will cause errors
 */
export enum TransactionType {
  APPROVAL = 0,
  SWAP = 1,
  DEPOSIT_LIQUIDITY_STAKING = 2,
  WITHDRAW_LIQUIDITY_STAKING = 3,
  CLAIM = 4,
  VOTE = 5,
  DELEGATE = 6,
  WRAP = 7,
  CREATE_V3_POOL = 8,
  ADD_LIQUIDITY_V3_POOL = 9,
  ADD_LIQUIDITY_V2_POOL = 10,
  MIGRATE_LIQUIDITY_V3 = 11,
  COLLECT_FEES = 12,
  REMOVE_LIQUIDITY_V3 = 13,
  SUBMIT_PROPOSAL = 14,
}

export interface BaseTransactionInfo {
  type: any
}

export type TransactionInfo = BaseTransactionInfo

export interface TransactionDetails {
  hash: string
  receipt?: SerializableTransactionReceipt
  lastCheckedBlockNumber?: number
  addedTime: number
  confirmedTime?: number
  from: string
  info: TransactionInfo
}

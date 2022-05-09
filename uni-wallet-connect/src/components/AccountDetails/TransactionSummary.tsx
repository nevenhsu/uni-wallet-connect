import { TransactionInfo, TransactionType } from '../../state/transactions/types'

export function TransactionSummary({ info }: { info: TransactionInfo }) {
  switch (info.type) {
    default:
      return null
  }
}

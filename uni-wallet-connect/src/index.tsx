import React from 'react'
import useBlockNumber, { BlockNumberProvider } from './lib/hooks/useBlockNumber'
import { MulticallUpdater } from './lib/state/multicall'

import Header from './components/Header'
import Web3Provider from './components/Web3Provider'
import ApplicationUpdater from './state/application/updater'
import TransactionUpdater from './state/transactions/updater'
import UserUpdater from './state/user/updater'

export * from './components'
export * from './theme/components'
export * from './state'
export * from './state/application/hooks'
export * from './state/transactions/hooks'
export * from './state/user/hooks'
export * from './state/hooks'
export * from './utils/retry'
export * from './utils/switchToNetwork'
export { ApplicationModal } from './state/application/reducer'
export { TransactionType } from './state/transactions/types'
export { SupportedChainId } from './constants/chains'
export { default as ThemeProvider, ThemedText, MEDIA_WIDTHS, Z_INDEX } from './theme'
export { useBlockNumber }

export type { RetryOptions } from './utils/retry'
export type { SupportedL1ChainId, SupportedL2ChainId } from './constants/chains'
export type { StoreOptions } from './state'
export type { TransactionInfo, TransactionDetails } from './state/transactions/types'
export type { ButtonProps } from './components/Button'
export type { CardProps } from './components/Card'
export type { ColumnGapProps } from './components/Column'
export type { ModalProps } from './components/Modal'
export type { PopoverProps } from './components/Popover'
export type { RowProps, RowGapProps } from './components/Row'
export type { NumericalInputProps } from './components/NumericalInput'

function Updaters() {
  if (window?.ethereum?.autoRefreshOnNetworkChange) {
    window.ethereum.autoRefreshOnNetworkChange = false
  }

  return (
    <React.Fragment>
      <UserUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </React.Fragment>
  )
}

export default function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <Web3Provider>
      <BlockNumberProvider>
        <Updaters />
        <Header />
        {children}
      </BlockNumberProvider>
    </Web3Provider>
  )
}

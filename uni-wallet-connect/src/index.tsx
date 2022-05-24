import React, { useEffect } from 'react'
import useBlockNumber, { BlockNumberProvider } from './lib/hooks/useBlockNumber'
import useAppContext, { AppProvider } from './hooks/useAppContext'
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
export * from './utils'
export * from './utils/retry'
export * from './utils/switchToNetwork'
export * from './hooks/useContract'
export { ApplicationModal } from './state/application/reducer'
export { TransactionType } from './state/transactions/types'
export { SupportedChainId } from './constants/chains'
export { default as ThemeProvider, ThemedText, MEDIA_WIDTHS, Z_INDEX } from './theme'
export { default as useAppContext } from './hooks/useAppContext'
export { default as useInterval } from './lib/hooks/useInterval'
export { default as uriToHttp } from './lib/utils/uriToHttp'
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

export type AppStateProps = {
  [key: string | number]: any
  renderSummary?: (info: any) => JSX.Element
}

function AppState(props: AppStateProps): null {
  const { setState } = useAppContext()

  useEffect(() => {
    if (props) {
      const keys = Object.keys(props)

      keys.forEach((k) => {
        const v = props[k]
        setState(k, v)
      })
    }
    console.log('AppState', props)
  }, [props])

  return null
}

export default function Wrapper(props: React.PropsWithChildren<AppStateProps>) {
  const { children, ...others } = props

  return (
    <Web3Provider>
      <BlockNumberProvider>
        <AppProvider>
          <Updaters />
          <Header />
          <AppState {...others} />
          {children}
        </AppProvider>
      </BlockNumberProvider>
    </Web3Provider>
  )
}

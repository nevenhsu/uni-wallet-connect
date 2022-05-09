import React from 'react'
import useBlockNumber, { BlockNumberProvider } from './lib/hooks/useBlockNumber'
import { MulticallUpdater } from './lib/state/multicall'
import { useAppDispatch, useAppSelector } from './state/hooks'

import Header from './components/Header'
import Web3Provider from './components/Web3Provider'
import { makeStore } from './state'
import ApplicationUpdater from './state/application/updater'
import TransactionUpdater from './state/transactions/updater'
import UserUpdater from './state/user/updater'
import ThemeProvider from './theme'

export { useAppDispatch, useAppSelector, makeStore, useBlockNumber, ThemeProvider }

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

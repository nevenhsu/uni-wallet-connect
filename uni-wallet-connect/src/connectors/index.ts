import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { initializeConnector, Web3ReactHooks } from '@web3-react/core'
import { GnosisSafe } from '@web3-react/gnosis-safe'
import { MetaMask } from '@web3-react/metamask'
import { Network } from '@web3-react/network'
import { Connector } from '@web3-react/types'
import { WalletConnect } from '@web3-react/walletconnect'
import { ALL_SUPPORTED_CHAIN_IDS, SupportedChainId } from '../constants/chains'
import { INFURA_NETWORK_URLS } from '../constants/infura'

const APP_NAME = process.env.REACT_APP_NAME || process.env.NEXT_PUBLIC_APP_NAME || 'dapp'
const LOGO_URL = process.env.REACT_APP_LOGO_URL || process.env.NEXT_PUBLIC_LOGO_URL

export enum Wallet {
  INJECTED = 'INJECTED',
  COINBASE_WALLET = 'COINBASE_WALLET',
  WALLET_CONNECT = 'WALLET_CONNECT',
}

export const WALLETS = [Wallet.COINBASE_WALLET, Wallet.WALLET_CONNECT, Wallet.INJECTED]

export const getWalletForConnector = (connector: Connector) => {
  switch (connector) {
    case injected:
      return Wallet.INJECTED
    case coinbaseWallet:
      return Wallet.COINBASE_WALLET
    case walletConnect:
      return Wallet.WALLET_CONNECT
    default:
      throw Error('unsupported connector')
  }
}

export const getConnectorForWallet = (wallet: Wallet) => {
  switch (wallet) {
    case Wallet.INJECTED:
      return injected
    case Wallet.COINBASE_WALLET:
      return coinbaseWallet
    case Wallet.WALLET_CONNECT:
      return walletConnect
  }
}

const getConnectorListItemForWallet = (wallet: Wallet) => {
  return {
    connector: getConnectorForWallet(wallet),
    hooks: getHooksForWallet(wallet),
  }
}

export const getHooksForWallet = (wallet: Wallet) => {
  switch (wallet) {
    case Wallet.INJECTED:
      return injectedHooks
    case Wallet.COINBASE_WALLET:
      return coinbaseWalletHooks
    case Wallet.WALLET_CONNECT:
      return walletConnectHooks
  }
}

export const [network, networkHooks] = initializeConnector<Network>(
  (actions) => new Network(actions, INFURA_NETWORK_URLS, true, 1),
  Object.keys(INFURA_NETWORK_URLS).map((chainId) => Number(chainId))
)

export const [injected, injectedHooks] = initializeConnector<MetaMask>(
  (actions) => new MetaMask(actions),
  ALL_SUPPORTED_CHAIN_IDS
)

export const [gnosisSafe, gnosisSafeHooks] = initializeConnector<GnosisSafe>((actions) => new GnosisSafe(actions))

export const [walletConnect, walletConnectHooks] = initializeConnector<WalletConnect>(
  (actions) =>
    new WalletConnect(actions, {
      rpc: INFURA_NETWORK_URLS,
      qrcode: true,
    }),
  ALL_SUPPORTED_CHAIN_IDS
)

export const [coinbaseWallet, coinbaseWalletHooks] = initializeConnector<CoinbaseWallet>(
  (actions) =>
    new CoinbaseWallet(actions, {
      url: INFURA_NETWORK_URLS[SupportedChainId.MAINNET],
      appName: APP_NAME,
      appLogoUrl: LOGO_URL,
    }),
  ALL_SUPPORTED_CHAIN_IDS
)

interface ConnectorListItem {
  connector: Connector
  hooks: Web3ReactHooks
}

export const createOrderedConnectors = (walletOverride: Wallet | undefined) => {
  const connectors: ConnectorListItem[] = [{ connector: gnosisSafe, hooks: gnosisSafeHooks }]
  if (walletOverride) {
    connectors.push(getConnectorListItemForWallet(walletOverride))
  }
  WALLETS.filter((wallet) => wallet !== walletOverride).forEach((wallet) => {
    connectors.push(getConnectorListItemForWallet(wallet))
  })
  connectors.push({ connector: network, hooks: networkHooks })
  const web3ReactConnectors: [Connector, Web3ReactHooks][] = connectors.map(({ connector, hooks }) => [
    connector,
    hooks,
  ])
  return web3ReactConnectors
}

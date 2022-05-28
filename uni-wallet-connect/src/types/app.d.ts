/// <reference types="react-scripts" />

declare module '*.svg' {
  const content: any
  export const ReactComponent: any
  export default content
}

declare module '*.png' {
  const value: any
  export = value
}

declare module '@metamask/jazzicon' {
  export default function (diameter: number, seed: number): HTMLElement
}

declare module 'fortmatic'

interface Window {
  // walletLinkExtension is injected by the Coinbase Wallet extension
  walletLinkExtension?: any
  ethereum?: {
    // value that is populated and returns true by the Coinbase Wallet mobile dapp browser
    isCoinbaseWallet?: true
    isMetaMask?: true
    isTally?: false
    autoRefreshOnNetworkChange?: boolean
  }
  web3?: Record<string, unknown>
}

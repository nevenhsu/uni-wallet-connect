/// <reference types="react-scripts" />

interface Window {
  ethereum: any
  web3: any
}

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
  export default any
}

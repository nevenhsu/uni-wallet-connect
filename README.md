# Uni-wallet-connect

A library extracted from the Uniswap v3 codebase and rewritten for reusability.
It uses [@web-react](https://github.com/NoahZinsmeister/web3-react#readme) and [ethers.js](https://github.com/ethers-io/ethers.js).
NextJS is supported by default.

## [Demo](https://nevenhsu.github.io/uni-wallet-connect/)

## How to use

See [next example](./next-example) for complete details.

```bash
npm install uni-wallet-connect
# or
yarn add uni-wallet-connect
```

**pages/\_app.tsx**

```javascript
import '@reach/dialog/styles.css'
import 'inter-ui/inter.css'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import React, { StrictMode } from 'react'

const Wrapper = dynamic(() => import('../components/Wrapper'), {
  ssr: false,
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StrictMode>
      <Wrapper>
        <Component {...pageProps} />
      </Wrapper>
    </StrictMode>
  )
}

export default MyApp
```

**components/Wrapper.tsx**

```javascript
import React from 'react'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import Uniswap, { ThemeProvider, makeStore } from '@nevenhsu/uni-wallet-connect'

const store = makeStore()

export default function Wrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <HashRouter>
          <Uniswap>{children}</Uniswap>
        </HashRouter>
      </ThemeProvider>
    </Provider>
  )
}
```

**.env**

```sh
NEXT_PUBLIC_INFURA_KEY=xxxxxyyyyyzzzzz
NEXT_PUBLIC_APP_NAME=uni-wallet
NEXT_PUBLIC_LOGO_URL=http://localhost:3000/icon.png
NEXT_PUBLIC_DEFAULT_CHAIN_ID=1
```

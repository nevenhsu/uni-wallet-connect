import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import Uniswap, { ThemeProvider, makeStore } from '@nevenhsu/uni-wallet-connect'

const store = makeStore()

export default function Wrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <Uniswap>{children}</Uniswap>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  )
}

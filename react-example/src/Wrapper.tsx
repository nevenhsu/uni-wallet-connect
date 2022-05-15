import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import Uniswap, { ThemeProvider, makeStore } from '@nevenhsu/uni-wallet-connect'

const store = makeStore()

export default function Wrapper({ children }: React.PropsWithChildren<{}>) {
    return (
        <BrowserRouter>
            <Provider store={store}>
                <ThemeProvider>
                    <Uniswap>{children}</Uniswap>
                </ThemeProvider>
            </Provider>
        </BrowserRouter>
    )
}

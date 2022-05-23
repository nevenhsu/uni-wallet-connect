import '@reach/dialog/styles.css'
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

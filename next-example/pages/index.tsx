import type { NextPage } from 'next'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'

const Root = styled.div``

const Home: NextPage = () => {
  const { account } = useWeb3React()

  useEffect(() => {
    console.log(account)
  }, [account])

  return <Root>Hello, world!</Root>
}

export default Home

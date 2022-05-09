import { useEffect } from 'react'
import logo from './logo.svg'
import './App.css'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'

const Root = styled.div``

function App() {
    const { account } = useWeb3React()

    useEffect(() => {
        console.log(account)
    }, [account])

    return (
        <Root className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                    Learn React
                </a>
            </header>
        </Root>
    )
}

export default App

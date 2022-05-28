import clsx, { ClassValue } from 'clsx'
import { CHAIN_INFO } from '../../constants/chainInfo'
import { SupportedChainId } from '../../constants/chains'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { Text } from 'rebass'
import { useNativeCurrencyBalances } from '../../state/wallet/hooks'
import styled from 'styled-components'

import Web3Status from '../Web3Status'
import NetworkSelector from './NetworkSelector'
import useAppContext from '../../hooks/useAppContext'

type HeaderProps = {
  classes?: ClassValue
}

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;
  position: fixed;
  right: 24px;
  top: 16px;
  z-index: 1;
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;

  &:not(:first-child) {
    margin-left: 0.5em;
  }

  /* addresses safari's lack of support for "gap" */
  & > *:not(:first-child) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: center;
  `};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg0 : theme.bg0)};
  border-radius: 16px;
  white-space: nowrap;
  width: 100%;
  height: 40px;

  :focus {
    border: 1px solid blue;
  }
`

const BalanceText = styled(Text)`
  color: ${({ theme }) => theme.text1};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

export default function Header(props: HeaderProps) {
  const { classes } = props
  const { account, chainId } = useActiveWeb3React()

  const userEthBalance = useNativeCurrencyBalances(account ? [account] : [])?.[account ?? '']
  const { state } = useAppContext()

  const {
    nativeCurrency: { symbol: nativeCurrencySymbol },
  } = CHAIN_INFO[chainId ? chainId : SupportedChainId.MAINNET]

  return (
    <HeaderControls className={clsx('uni-wallet-header', state.walletClasses)}>
      <HeaderElement>
        <NetworkSelector />
      </HeaderElement>
      <HeaderElement>
        <AccountElement active={!!account}>
          {account && userEthBalance ? (
            <BalanceText style={{ flexShrink: 0, userSelect: 'none' }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
              {userEthBalance?.toSignificant(3)} {nativeCurrencySymbol}
            </BalanceText>
          ) : null}
          <Web3Status />
        </AccountElement>
      </HeaderElement>
    </HeaderControls>
  )
}

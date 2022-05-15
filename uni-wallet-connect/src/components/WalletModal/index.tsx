import { useWeb3React } from '@web3-react/core'
import { ChainIdNotAllowedError } from '@web3-react/store'
import { Connector } from '@web3-react/types'
import { AutoColumn } from '../../components/Column'
import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, X as Close } from 'react-feather'
import { useAppDispatch } from '../../state/hooks'
import { updateWalletOverride } from '../../state/user/reducer'
import styled from 'styled-components'

import MetamaskIcon from '../../assets/images/metamask.png'
import { coinbaseWallet, injected, network, walletConnect } from '../../connectors'
import { getWalletForConnector, SUPPORTED_WALLETS, Wallet } from '../../constants/wallet'
import usePrevious from '../../hooks/usePrevious'
import { useModalOpen, useWalletModalToggle } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/reducer'
import { isMobileFn } from '../../utils/userAgent'
import AccountDetails from '../AccountDetails'
import Modal from '../Modal'
import Option from './Option'
import PendingView from './PendingView'

const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const CloseColor = styled(Close)`
  path {
    stroke: ${({ theme }) => theme.text4};
  }
`

const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 0;
  width: 100%;
`

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1rem 1rem;
  font-weight: 500;
  color: ${(props) => (props.color === 'blue' ? ({ theme }) => theme.primary1 : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`

const ContentWrapper = styled.div`
  background-color: ${({ theme }) => theme.bg0};
  padding: 0 1rem 1rem 1rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 0 1rem 1rem 1rem`};
`

const UpperSection = styled.div`
  position: relative;
  color: ${({ theme }) => theme.text1};

  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }
  h5:last-child {
    margin-bottom: 0px;
  }
  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`

const OptionGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    grid-gap: 10px;
  `};
`

const HoverText = styled.div`
  text-decoration: none;
  color: ${({ theme }) => theme.text1};
  display: flex;
  align-items: center;
  :hover {
    cursor: pointer;
  }
`

const WALLET_VIEWS = {
  OPTIONS: 'options',
  ACCOUNT: 'account',
  PENDING: 'pending',
}

export default function WalletModal({
  pendingTransactions,
  confirmedTransactions,
  ENSName,
}: {
  pendingTransactions: string[] // hashes of pending
  confirmedTransactions: string[] // hashes of confirmed
  ENSName?: string
}) {
  const isMobile = isMobileFn()
  const dispatch = useAppDispatch()
  const { connector, error, hooks } = useWeb3React()
  const isActiveMap: Record<Wallet, boolean> = {
    [Wallet.INJECTED]: hooks.useSelectedIsActive(injected),
    [Wallet.COINBASE_WALLET]: hooks.useSelectedIsActive(coinbaseWallet),
    [Wallet.WALLET_CONNECT]: hooks.useSelectedIsActive(walletConnect),
  }
  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)

  const [pendingConnector, setPendingConnector] = useState<Connector | undefined>()
  // Need to pass network as a default case because useSelectedError requirse a connector
  const pendingError = hooks.useSelectedError(pendingConnector || network)

  const walletModalOpen = useModalOpen(ApplicationModal.WALLET)
  const toggleWalletModal = useWalletModalToggle()

  const previousConnector = usePrevious(connector)

  const resetAccountView = useCallback(() => {
    setWalletView(WALLET_VIEWS.ACCOUNT)
  }, [setWalletView])

  useEffect(() => {
    if (walletModalOpen && connector && connector !== previousConnector && !error) {
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [setWalletView, error, connector, walletModalOpen, previousConnector])

  useEffect(() => {
    if (walletModalOpen) {
      setWalletView(connector === network ? WALLET_VIEWS.OPTIONS : WALLET_VIEWS.ACCOUNT)
    }
  }, [walletModalOpen, setWalletView, connector])

  const tryActivation = async (connector: Connector) => {
    connector.activate()
    const wallet = getWalletForConnector(connector)
    if (isActiveMap[wallet]) {
      dispatch(updateWalletOverride({ wallet }))
      setWalletView(WALLET_VIEWS.ACCOUNT)
    } else {
      setPendingConnector(connector)
      setWalletView(WALLET_VIEWS.PENDING)
    }
  }

  // get wallets user can switch too, depending on device/browser
  function getOptions() {
    const isMetamask = !!window.ethereum?.isMetaMask
    return Object.keys(SUPPORTED_WALLETS).map((key) => {
      const option = SUPPORTED_WALLETS[key]
      const isActive = option.connector === connector

      const optionProps = {
        active: isActive,
        id: `connect-${key}`,
        link: option.href,
        header: option.name,
        color: option.color,
        key,
        icon: option.iconURL,
      }

      // check for mobile options
      if (isMobile) {
        if (!window.web3 && !window.ethereum && option.mobile) {
          return (
            <Option
              {...optionProps}
              onClick={() => {
                if (!isActive && !option.href && !!option.connector) {
                  tryActivation(option.connector)
                }
              }}
              subheader={null}
            />
          )
        }
        return null
      }

      // overwrite injected when needed
      if (option.connector === injected) {
        // don't show injected if there's no injected provider
        if (!(window.web3 || window.ethereum)) {
          if (option.name === 'MetaMask') {
            return (
              <Option
                id={`connect-${key}`}
                key={key}
                color={'#E8831D'}
                header={<>Install Metamask</>}
                subheader={null}
                link={'https://metamask.io/'}
                icon={MetamaskIcon}
              />
            )
          } else {
            return null //dont want to return install twice
          }
        }
        // don't return metamask if injected provider isn't metamask
        else if (option.name === 'MetaMask' && !isMetamask) {
          return null
        }
        // likewise for generic
        else if (option.name === 'Injected' && isMetamask) {
          return null
        }
      }

      // return rest of options
      return (
        !isMobile &&
        !option.mobileOnly && (
          <Option
            {...optionProps}
            onClick={() => {
              option.connector === connector
                ? setWalletView(WALLET_VIEWS.ACCOUNT)
                : !option.href && option.connector && tryActivation(option.connector)
            }}
            subheader={null} //use option.descriptio to bring back multi-line
          />
        )
      )
    })
  }

  function getModalContent() {
    if (error) {
      return (
        <UpperSection>
          <CloseIcon onClick={toggleWalletModal}>
            <CloseColor />
          </CloseIcon>
          <HeaderRow>{error instanceof ChainIdNotAllowedError ? <>Wrong Network</> : <>Error connecting</>}</HeaderRow>
          <ContentWrapper>
            {error instanceof ChainIdNotAllowedError ? (
              <h5>
                <>Please connect to a supported network in the dropdown menu or in your wallet.</>
              </h5>
            ) : (
              <>Error connecting. Try refreshing the page.</>
            )}
          </ContentWrapper>
        </UpperSection>
      )
    }
    if (walletView === WALLET_VIEWS.ACCOUNT) {
      return (
        <AccountDetails
          toggleWalletModal={toggleWalletModal}
          pendingTransactions={pendingTransactions}
          confirmedTransactions={confirmedTransactions}
          ENSName={ENSName}
          openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)}
        />
      )
    }
    return (
      <UpperSection>
        <CloseIcon onClick={toggleWalletModal}>
          <CloseColor />
        </CloseIcon>
        <HeaderRow color="blue">
          <HoverText onClick={() => setWalletView(WALLET_VIEWS.OPTIONS)}>
            <ArrowLeft />
          </HoverText>
        </HeaderRow>
        <ContentWrapper>
          <AutoColumn gap="16px">
            {walletView === WALLET_VIEWS.PENDING && (
              <PendingView
                resetAccountView={resetAccountView}
                connector={pendingConnector}
                error={!!pendingError}
                tryActivation={tryActivation}
              />
            )}
            {walletView !== WALLET_VIEWS.PENDING && <OptionGrid data-cy="option-grid">{getOptions()}</OptionGrid>}
          </AutoColumn>
        </ContentWrapper>
      </UpperSection>
    )
  }

  return (
    <Modal isOpen={walletModalOpen} onDismiss={toggleWalletModal} minHeight={false} maxHeight={90}>
      <Wrapper className="uni-wallet-modal">{getModalContent()}</Wrapper>
    </Modal>
  )
}

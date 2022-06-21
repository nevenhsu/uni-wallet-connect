import { useWeb3React } from '@web3-react/core'
import { getWalletForConnector } from '../../connectors'
import { CHAIN_INFO } from '../../constants/chainInfo'
import { CHAIN_IDS_TO_NAMES, SupportedChainId } from '../../constants/chains'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import useParsedQueryString from '../../hooks/useParsedQueryString'
import usePrevious from '../../hooks/usePrevious'
import { ParsedQs } from 'qs'
import { useCallback, useEffect, useRef } from 'react'
import { ArrowDownCircle, ChevronDown } from 'react-feather'
import { useSearchParams } from 'react-router-dom'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'
import { addPopup, ApplicationModal } from '../../state/application/reducer'
import { useAppDispatch } from '../../state/hooks'
import { updateWalletError } from '../../state/wallet/reducer'
import styled from 'styled-components'
import { ExternalLink, MEDIA_WIDTHS, Z_INDEX } from '../../theme'
import { isChainAllowed, switchChain } from '../../utils/switchChain'

const ActiveRowLinkList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 8px;
  & > a {
    align-items: center;
    color: ${({ theme }) => theme.text2};
    display: flex;
    flex-direction: row;
    font-size: 14px;
    font-weight: 500;
    justify-content: space-between;
    padding: 8px 0 4px;
    text-decoration: none;
  }
  & > a:first-child {
    margin: 0;
    margin-top: 0px;
    padding-top: 10px;
  }
`
const ActiveRowWrapper = styled.div`
  background-color: ${({ theme }) => theme.bg1};
  border-radius: 8px;
  cursor: pointer;
  padding: 8px;
  width: 100%;
`
const FlyoutHeader = styled.div`
  color: ${({ theme }) => theme.text2};
  font-weight: 400;
`
const FlyoutMenu = styled.div`
  color: ${({ theme }) => theme.text1};
  position: absolute;
  top: 54px;
  width: 272px;
  z-index: ${Z_INDEX.modal};
  padding-top: 10px;
  @media screen and (min-width: ${MEDIA_WIDTHS.upToSmall}px) {
    top: 40px;
  }
`
const FlyoutMenuContents = styled.div`
  align-items: flex-start;
  background-color: ${({ theme }) => theme.bg0};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  overflow: auto;
  padding: 16px;
  & > *:not(:last-child) {
    margin-bottom: 12px;
  }
`
const FlyoutRow = styled.div<{ active: boolean }>`
  align-items: center;
  background-color: ${({ active, theme }) => (active ? theme.bg1 : 'transparent')};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  font-weight: 500;
  justify-content: space-between;
  padding: 6px 8px;
  text-align: left;
  width: 100%;
`
const FlyoutRowActiveIndicator = styled.div`
  background-color: ${({ theme }) => theme.green1};
  border-radius: 50%;
  height: 9px;
  width: 9px;
`

const CircleContainer = styled.div`
  width: 20px;
  display: flex;
  justify-content: center;
`

const LinkOutCircle = styled(ArrowDownCircle)`
  transform: rotate(230deg);
  width: 16px;
  height: 16px;
`
const Logo = styled.img`
  height: 20px;
  width: 20px;
  margin-right: 8px;
`
const NetworkLabel = styled.div`
  flex: 1 1 auto;
`
const SelectorLabel = styled(NetworkLabel)`
  display: none;
  @media screen and (min-width: ${MEDIA_WIDTHS.upToSmall}px) {
    display: block;
    margin-right: 8px;
  }
`
const SelectorControls = styled.div<{ interactive: boolean }>`
  align-items: center;
  background-color: ${({ theme }) => theme.bg0};
  border: 2px solid ${({ theme }) => theme.bg0};
  border-radius: 16px;
  color: ${({ theme }) => theme.text1};
  cursor: ${({ interactive }) => (interactive ? 'pointer' : 'auto')};
  display: flex;
  font-weight: 500;
  justify-content: space-between;
  padding: 6px 8px;
`
const SelectorLogo = styled(Logo)<{ interactive?: boolean }>`
  margin-right: ${({ interactive }) => (interactive ? 8 : 0)}px;
  @media screen and (min-width: ${MEDIA_WIDTHS.upToSmall}px) {
    margin-right: 8px;
  }
`
const SelectorWrapper = styled.div`
  @media screen and (min-width: ${MEDIA_WIDTHS.upToSmall}px) {
    position: relative;
  }
`
const StyledChevronDown = styled(ChevronDown)`
  width: 16px;
`
const BridgeLabel = ({ chainId }: { chainId: SupportedChainId }) => {
  switch (chainId) {
    case SupportedChainId.ARBITRUM_ONE:
    case SupportedChainId.ARBITRUM_RINKEBY:
      return <>Arbitrum Bridge</>
    case SupportedChainId.OPTIMISM:
    case SupportedChainId.OPTIMISTIC_KOVAN:
      return <>Optimism Bridge</>
    case SupportedChainId.POLYGON:
    case SupportedChainId.POLYGON_MUMBAI:
      return <>Polygon Bridge</>
    default:
      return <>Bridge</>
  }
}
const ExplorerLabel = ({ chainId }: { chainId: SupportedChainId }) => {
  switch (chainId) {
    case SupportedChainId.ARBITRUM_ONE:
    case SupportedChainId.ARBITRUM_RINKEBY:
      return <>Arbiscan</>
    case SupportedChainId.OPTIMISM:
    case SupportedChainId.OPTIMISTIC_KOVAN:
      return <>Optimistic Etherscan</>
    case SupportedChainId.POLYGON:
    case SupportedChainId.POLYGON_MUMBAI:
      return <>Polygonscan</>
    default:
      return <>Etherscan</>
  }
}

function Row({
  targetChain,
  onSelectChain,
}: {
  targetChain: SupportedChainId
  onSelectChain: (targetChain: number) => void
}) {
  const { provider, chainId } = useWeb3React()
  if (!provider || !chainId) {
    return null
  }
  const active = chainId === targetChain
  const { helpCenterUrl, explorer, bridge, label, logoUrl } = CHAIN_INFO[targetChain]

  const rowContent = (
    <FlyoutRow onClick={() => onSelectChain(targetChain)} active={active}>
      <Logo src={logoUrl} />
      <NetworkLabel>{label}</NetworkLabel>
      {chainId === targetChain && (
        <CircleContainer>
          <FlyoutRowActiveIndicator />
        </CircleContainer>
      )}
    </FlyoutRow>
  )

  if (active) {
    return (
      <ActiveRowWrapper>
        {rowContent}
        <ActiveRowLinkList>
          {bridge && (
            <ExternalLink href={bridge}>
              <BridgeLabel chainId={chainId} />
              <CircleContainer>
                <LinkOutCircle />
              </CircleContainer>
            </ExternalLink>
          )}
          {explorer && (
            <ExternalLink href={explorer}>
              <ExplorerLabel chainId={chainId} />
              <CircleContainer>
                <LinkOutCircle />
              </CircleContainer>
            </ExternalLink>
          )}
          {helpCenterUrl && (
            <ExternalLink href={helpCenterUrl}>
              <>Help Center</>
              <CircleContainer>
                <LinkOutCircle />
              </CircleContainer>
            </ExternalLink>
          )}
        </ActiveRowLinkList>
      </ActiveRowWrapper>
    )
  }
  return rowContent
}

const getParsedChainId = (parsedQs?: ParsedQs) => {
  const chain = parsedQs?.chain
  if (!chain || typeof chain !== 'string') return { urlChain: undefined, urlChainId: undefined }

  return { urlChain: chain.toLowerCase(), urlChainId: getChainIdFromName(chain) }
}

const getChainIdFromName = (name: string) => {
  const entry = Object.entries(CHAIN_IDS_TO_NAMES).find(([_, n]) => n === name)
  const chainId = entry?.[0]
  return chainId ? parseInt(chainId) : undefined
}

const getChainNameFromId = (id: string | number) => {
  // casting here may not be right but fine to return undefined if it's not a supported chain ID
  return CHAIN_IDS_TO_NAMES[id as SupportedChainId] || ''
}

const NETWORK_SELECTOR_CHAINS = [
  SupportedChainId.MAINNET,
  SupportedChainId.POLYGON,
  SupportedChainId.OPTIMISM,
  SupportedChainId.ARBITRUM_ONE,
]

export default function NetworkSelector() {
  const dispatch = useAppDispatch()
  const { chainId, provider, connector } = useWeb3React()
  const parsedQs = useParsedQueryString()
  const { urlChain, urlChainId } = getParsedChainId(parsedQs)
  const prevChainId = usePrevious(chainId)
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.NETWORK_SELECTOR)
  const toggle = useToggleModal(ApplicationModal.NETWORK_SELECTOR)
  useOnClickOutside(node, open ? toggle : undefined)

  const [searchParams, setSearchParams] = useSearchParams()

  const info = chainId ? CHAIN_INFO[chainId] : undefined

  const onSelectChain = useCallback(
    async (targetChain: number, skipToggle?: boolean) => {
      if (!connector) return

      const wallet = getWalletForConnector(connector)

      try {
        dispatch(updateWalletError({ wallet, error: undefined }))
        await switchChain(connector, targetChain)
        if (!skipToggle) {
          toggle()
        }
        setSearchParams({ chain: getChainNameFromId(targetChain) })
      } catch (error) {
        console.error('Failed to switch networks', error)

        // we want app network <-> chainId param to be in sync, so if user changes the network by changing the URL
        // but the request fails, revert the URL back to current chainId
        if (chainId) {
          setSearchParams({ chain: getChainNameFromId(chainId) })
        }

        if (!skipToggle) {
          toggle()
        }

        dispatch(updateWalletError({ wallet, error: error.message }))
        dispatch(addPopup({ content: { failedSwitchNetwork: targetChain }, key: `failed-network-switch` }))
      }
    },
    [connector, toggle, dispatch, chainId]
  )

  useEffect(() => {
    if (!chainId || !prevChainId) return

    // when network change originates from wallet or dropdown selector, just update URL
    if (chainId !== prevChainId) {
      setSearchParams({ chain: getChainNameFromId(chainId) })
      // otherwise assume network change originates from URL
    } else if (urlChainId && urlChainId !== chainId) {
      onSelectChain(urlChainId, true)
    }
  }, [chainId, urlChainId, prevChainId, onSelectChain])

  // set chain parameter on initial load if not there
  useEffect(() => {
    if (chainId && !urlChainId) {
      setSearchParams({ chain: getChainNameFromId(chainId) })
    }
  }, [chainId, urlChainId, urlChain])

  if (!chainId || !info || !provider) {
    return null
  }

  return (
    <SelectorWrapper className="uni-network-selector" ref={node as any} onMouseEnter={toggle} onMouseLeave={toggle}>
      <SelectorControls interactive>
        <SelectorLogo interactive src={info.logoUrl} />
        <SelectorLabel>{info.label}</SelectorLabel>
        <StyledChevronDown />
      </SelectorControls>
      {open && (
        <FlyoutMenu>
          <FlyoutMenuContents>
            <FlyoutHeader>
              <>Select a network</>
            </FlyoutHeader>
            {NETWORK_SELECTOR_CHAINS.map((chainId: SupportedChainId) =>
              isChainAllowed(connector, chainId) ? (
                <Row onSelectChain={onSelectChain} targetChain={chainId} key={chainId} />
              ) : null
            )}
          </FlyoutMenuContents>
        </FlyoutMenu>
      )}
    </SelectorWrapper>
  )
}

import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import useIsWindowVisible from '../../hooks/useIsWindowVisible'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const MISSING_PROVIDER = Symbol()
const BlockNumberContext = createContext<
  | {
      value?: number
      fastForward(block: number): void
    }
  | typeof MISSING_PROVIDER
>(MISSING_PROVIDER)

function useBlockNumberContext() {
  const blockNumber = useContext(BlockNumberContext)
  if (blockNumber === MISSING_PROVIDER) {
    throw new Error('BlockNumber hooks must be wrapped in a <BlockNumberProvider>')
  }
  return blockNumber
}

/** Requires that BlockUpdater be installed in the DOM tree. */
export default function useBlockNumber(): number | undefined {
  return useBlockNumberContext().value
}

export function useFastForwardBlockNumber(): (block: number) => void {
  return useBlockNumberContext().fastForward
}

export function BlockNumberProvider(props: React.PropsWithChildren<{}>) {
  const { children } = props
  const { chainId: activeChainId, provider } = useActiveWeb3React()
  const [{ chainId, block }, setChainBlock] = useState<{ chainId?: number; block?: number }>({ chainId: activeChainId })

  const onBlock = useCallback(
    (block: number) => {
      setChainBlock((chainBlock) => {
        if (chainBlock.chainId === activeChainId) {
          if (!chainBlock.block || chainBlock.block < block) {
            return { chainId: activeChainId, block }
          }
        }
        return chainBlock
      })
    },
    [activeChainId, setChainBlock]
  )

  const windowVisible = useIsWindowVisible()
  useEffect(() => {
    if (provider && activeChainId && windowVisible) {
      // If chainId hasn't changed, don't clear the block. This prevents re-fetching still valid data.
      setChainBlock((chainBlock) => (chainBlock.chainId === activeChainId ? chainBlock : { chainId: activeChainId }))

      provider
        .getBlockNumber()
        .then(onBlock)
        .catch((error) => {
          console.error(`Failed to get block number for chainId ${activeChainId}`, error)
        })

      provider.on('block', onBlock)
      return () => {
        provider.removeListener('block', onBlock)
      }
    }
    return undefined
  }, [activeChainId, provider, onBlock, setChainBlock, windowVisible])

  const value = useMemo(
    () => ({
      value: chainId === activeChainId ? block : undefined,
      fastForward: (block: number) => setChainBlock({ chainId: activeChainId, block }),
    }),
    [activeChainId, block, chainId]
  )
  return <BlockNumberContext.Provider value={value}>{children}</BlockNumberContext.Provider>
}

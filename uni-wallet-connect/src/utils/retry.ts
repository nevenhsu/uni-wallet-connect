import { SupportedChainId } from '../constants/chains'

export interface RetryOptions {
  n: number
  minWait: number
  maxWait: number
}

export const RETRY_OPTIONS_BY_CHAIN_ID: { [chainId: number]: RetryOptions } = {
  [SupportedChainId.ARBITRUM_ONE]: { n: 10, minWait: 250, maxWait: 1000 },
  [SupportedChainId.ARBITRUM_RINKEBY]: { n: 10, minWait: 250, maxWait: 1000 },
  [SupportedChainId.OPTIMISTIC_KOVAN]: { n: 10, minWait: 250, maxWait: 1000 },
  [SupportedChainId.OPTIMISM]: { n: 10, minWait: 250, maxWait: 1000 },
}
export const DEFAULT_RETRY_OPTIONS: RetryOptions = { n: 1, minWait: 0, maxWait: 0 }

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function waitRandom(min: number, max: number): Promise<void> {
  return wait(min + Math.round(Math.random() * Math.max(0, max - min)))
}

/**
 * This error is thrown if the function is cancelled before completing
 */
class CancelledError extends Error {
  public isCancelledError: true = true
  constructor() {
    super('Cancelled')
  }
}

/**
 * Throw this error if the function should retry
 */
export class RetryableError extends Error {
  public isRetryableError: true = true
}

/**
 * Retries the function that returns the promise until the promise successfully resolves up to n retries
 * @param fn function to retry
 * @param n how many times to retry
 * @param minWait min wait between retries in ms
 * @param maxWait max wait between retries in ms
 */
export function retry<T>(
  fn: () => Promise<T>,
  options?: Partial<RetryOptions>
): { promise: Promise<T>; cancel: () => void } {
  let { n = 1, minWait = 0, maxWait = 0 } = options ?? {}
  let completed = false
  let rejectCancelled: (error: Error) => void
  const promise = new Promise<T>(async (resolve, reject) => {
    rejectCancelled = reject
    while (true) {
      let result: T
      try {
        result = await fn()
        if (!completed) {
          resolve(result)
          completed = true
        }
        break
      } catch (error) {
        if (completed) {
          break
        }
        if (n <= 0 || !error.isRetryableError) {
          reject(error)
          completed = true
          break
        }
        n--
      }
      await waitRandom(minWait, maxWait)
    }
  })
  return {
    promise,
    cancel: () => {
      if (completed) return
      completed = true
      rejectCancelled(new CancelledError())
    },
  }
}

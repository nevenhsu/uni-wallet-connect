import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'
import multicall from '../lib/state/multicall'
import { load, save } from 'redux-localstorage-simple'

import application from './application/reducer'
import transactions from './transactions/reducer'
import user from './user/reducer'
import wallet from './wallet/reducer'
import type { Reducer, AnyAction } from '@reduxjs/toolkit'

const PERSISTED_KEYS: string[] = ['user', 'transactions']

export type StoreOptions = {
  reducers: { [key: string]: Reducer<any, AnyAction> }
  middleware: any[]
  persistedKeys: string[]
}

export function makeStore(options: Partial<StoreOptions> = {}) {
  const { reducers = [], middleware = [], persistedKeys: keys = [] } = options || {}
  const persistedKeys = [...PERSISTED_KEYS, ...keys]

  const store = configureStore({
    reducer: {
      ...reducers,
      application,
      user,
      wallet,
      transactions,
      multicall: multicall.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: true })
        .concat(save({ states: persistedKeys, debounce: 1000, disableWarnings: true }))
        .concat(middleware),
    preloadedState: load({ states: persistedKeys, disableWarnings: true }),
  })

  setupListeners(store.dispatch)

  return store
}

export type Store = ReturnType<typeof makeStore>
export type AppState = ReturnType<Store['getState']>
export type AppDispatch = Store['dispatch']

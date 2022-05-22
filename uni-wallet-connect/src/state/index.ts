import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'
import multicall from '../lib/state/multicall'
import { load, save } from 'redux-localstorage-simple'

import application from './application/reducer'
import logs from './logs/slice'
import transactions from './transactions/reducer'
import user from './user/reducer'
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

  return configureStore({
    reducer: {
      ...reducers,
      application,
      user,
      transactions,
      multicall: multicall.reducer,
      logs,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: true })
        .concat(save({ states: persistedKeys, debounce: 1000, disableWarnings: true }))
        .concat(middleware),
    preloadedState: load({ states: persistedKeys, disableWarnings: true }),
  })
}

const store = makeStore()

setupListeners(store.dispatch)

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

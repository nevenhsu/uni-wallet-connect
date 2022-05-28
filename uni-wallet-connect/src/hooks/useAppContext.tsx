import { ClassValue } from 'clsx'
import { createContext, useContext, useMemo, useState } from 'react'

const MISSING_PROVIDER = Symbol()
const AppContext = createContext<
  | {
      state: { [key: string | number]: any }
      setState: (key: string | number, value: any) => void
    }
  | typeof MISSING_PROVIDER
>(MISSING_PROVIDER)

export default function useAppContext() {
  const app = useContext(AppContext)
  if (app === MISSING_PROVIDER) {
    throw new Error('App hooks must be wrapped in a <AppProvider>')
  }
  return app
}

export function AppProvider(props: React.PropsWithChildren<{}>) {
  const { children } = props
  const [state, setState] = useState<{ [key: string | number]: any }>({})

  const value = useMemo(
    () => ({
      state,
      setState: (key: string | number, value: any) => setState((state) => ({ ...state, [key]: value })),
    }),
    [state]
  )
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

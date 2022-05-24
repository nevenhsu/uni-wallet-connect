import useAppContext from '../../hooks/useAppContext'

export function TransactionSummary({ info }: { info: any }) {
  const { state } = useAppContext()
  const { renderSummary } = state

  if (renderSummary) {
    return renderSummary(info) ?? null
  }

  return null
}

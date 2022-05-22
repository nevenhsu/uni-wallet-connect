import { Box, BoxProps as BoxPropsOriginal } from 'rebass/styled-components'
import styled from 'styled-components'

type BoxProps = Omit<BoxPropsOriginal, 'css'>

export type RowProps = BoxProps & {
  width?: string
  align?: string
  justify?: string
  padding?: string
  border?: string
  borderRadius?: string
}

const Row = styled(Box)<RowProps>`
  width: ${({ width }) => width ?? '100%'};
  display: flex;
  padding: 0;
  align-items: ${({ align }) => align ?? 'center'};
  justify-content: ${({ justify }) => justify ?? 'flex-start'};
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
`

export const RowBetween = styled(Row)`
  justify-content: space-between;
`

export const RowFlat = styled.div`
  display: flex;
  align-items: flex-end;
`

export type RowGapProps = BoxProps & { gap?: string; justify?: string }

export const AutoRow = styled(Row)<RowGapProps>`
  flex-wrap: wrap;
  margin: ${({ gap }) => gap && `-${gap}`};
  justify-content: ${({ justify }) => justify && justify};

  & > * {
    margin: ${({ gap }) => gap} !important;
  }
`

export const RowFixed = styled(Row)<RowGapProps>`
  width: fit-content;
  margin: ${({ gap }) => gap && `-${gap}`};
`

export default Row

import { FC }       from 'react'

import { Global }   from '@emotion/react'
import { useTheme } from '@mui/joy'
import { Theme }    from '@mui/joy'

const global = (theme: Theme) => () => ({
  '*:where(:not(html, iframe, canvas, img, svg, video, audio):not(svg *, symbol *))': {
    all: 'unset',
    display: 'revert',
  },

  '*,*::before,*::after': {
    boxSizing: 'border-box',
  },

  'a,button': {
    cursor: 'revert',
  },

  'ol,ul,menu': {
    listStyle: 'none',
  },

  img: {
    maxInlineSize: '100%',
    maxBlockSize: '100%',
  },

  table: {
    borderCollapse: 'collapse',
  },

  'input,textarea': {
    WebkitUserSelect: 'auto',
  },

  textarea: {
    whiteSpace: 'revert',
  },

  ':where(pre)': {
    all: 'revert',
  },

  '::placeholder': {
    color: 'unset',
  },

  '::marker': {
    content: 'initial',
  },

  ":where([contenteditable]:not([contenteditable='false']))": {
    MozUserModify: 'read-write',
    WebkitUserModify: 'read-write',
    overflowWrap: 'break-word',
    WebkitUserSelect: 'auto',
  },

  'html,body,#root': {
    width: '100vw',
    height: '100vh',
    position: 'relative',
    fontSize: '16px',
    zIndex: 1,
    backgroundColor: theme.vars.palette.background.body,
    fontFamily: theme.fontFamily.body,
    color: theme.palette.text.primary,
  },

  'img,button': {
    userSelect: 'none',
  },

  '*::-webkit-scrollbar': {
    display: 'none',
  },
})

export const GlobalStyles: FC = () => {
  const theme = useTheme()

  return <Global styles={global(theme) as never} />
}

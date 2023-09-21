import type { FC }                from 'react'
import type { PropsWithChildren } from 'react'

import      { CssVarsProvider }   from '@mui/joy/styles'
import      { FontStyles }        from 'theme/font/index.js'
import      { GlobalStyles }      from 'theme/global/index.js'
import      { baseTheme }         from 'theme/schema/index.js'

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => (
  <CssVarsProvider
    defaultMode='dark'
    disableNestedContext
    colorSchemeSelector='#root'
    modeStorageKey='dark-mode'
    theme={baseTheme}
  >
    <GlobalStyles />
    <FontStyles />
    {children}
  </CssVarsProvider>
)

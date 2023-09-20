import { FC }                 from 'react'

import { Global }             from '@emotion/react'

import { jetbrainsFontFaces } from './jetbrains.js'
import { mabryFontFaces }     from './mabry.js'

export const FontStyles: FC = () => <Global styles={[...mabryFontFaces, ...jetbrainsFontFaces]} />

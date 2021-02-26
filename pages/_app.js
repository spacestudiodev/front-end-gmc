import { ThemeProvider } from 'styled-components'
import theme from '../style/theme/default.style'

import '../style/main.css'

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
    return <ThemeProvider theme={theme}><Component {...pageProps} /></ThemeProvider>
}

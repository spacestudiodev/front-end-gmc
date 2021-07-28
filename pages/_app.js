import { ThemeProvider } from 'styled-components'
import theme from '../style/theme/default.style'

import App from './index'

import '../style/main.css'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import '../style/slider.css'
import WithRouterSSR from '../components/Helper/WithRouterSSR'

let StartComponent = undefined

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps, router }) {
    // Page props es el codigo que bota esta respuesta (ejemplo: 404)
    const asPath = router.asPath
    const isServer = router.isSsr === undefined
    const isError = pageProps.statusCode !== 404

    if (!isServer) {
        if (!StartComponent)
            StartComponent = Component
    }
    else
        StartComponent = Component

    return (
        <WithRouterSSR asPath={asPath}>
            <ThemeProvider theme={theme}>
                <StartComponent {...pageProps} />
            </ThemeProvider>
        </WithRouterSSR>
    )
}

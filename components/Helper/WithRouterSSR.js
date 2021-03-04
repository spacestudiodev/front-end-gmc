import { BrowserRouter as Router } from 'react-router-dom';
const isServer = typeof window === 'undefined';

export default function WithRouterSSR({ asPath, children }) {

    if (isServer) {
        const { StaticRouter } = require('react-router-dom');

        return <StaticRouter location={asPath}>{children}</StaticRouter>
    }
    else
        return <Router>{children}</Router>

}
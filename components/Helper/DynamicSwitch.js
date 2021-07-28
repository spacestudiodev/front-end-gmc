import {Children, cloneElement, useEffect} from "react";
import {useLocation, matchPath} from 'react-router-dom';
import {useState} from 'react';

export default function DynamicSwitch({path, children}) {
    const [firstLoad, setFirstLoad] = useState([]);
    let [last, setLast] = useState();

    const {pathname, hash} = useLocation();

    const [inLocation, setInLocation] = useState()

    const [_children, setChildren] = useState([]);
    
    useEffect(() => {
        if (pathname !== "/" && pathname !== last) {
            last = pathname
            setLast(pathname);
        }

        let canLocation = true

        if(path) {
            canLocation = matchPath(pathname, {
                path,
                exact: false,
                strict: false,
            }) !== null;
        }
        
        if (canLocation) {
            setChildren(Children.map(children, (c, index) => {
                const props = {
                    pathname,
                    match: matchPath(pathname, {
                        path: c.props.path,
                        exact: c.props.exact,
                        strict: c.props.strict,
                    }),
                    lastPathname: last,
                    key: index,
                }

                if (props.match && !firstLoad[index]) {
                    firstLoad[index] = true;
                    setFirstLoad(firstLoad);
                }

                if (!firstLoad[index]) return null

                return cloneElement(c, props);
            }))

            if (!inLocation)
                setInLocation(true)
        }
        else if (inLocation) {
            setChildren(Children.map(children, (c, index) => {
                const props = {
                    pathname,
                    match: null,
                    lastPathname: last,
                    key: index,
                }

                if (!firstLoad[index]) return null

                return cloneElement(c, props);
            }))

            setInLocation(false)
        }

    }, [pathname, hash])

    return (
        <>
            {_children}
        </>
    )
}

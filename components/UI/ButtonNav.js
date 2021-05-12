import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import {
    BNavCont,
    BNavIconCont,
    BNavTitle,
    BNavDescription
} from './ButtonNav.style'

export default function ButtonNav({ title, description, icon = "/default.jpg", link = "", onHover }) {
    return (
        <Link to={link}
            onMouseEnter={() => {
                if (!onHover)
                    return

                onHover(link, title)
            }}
            onMouseLeave={() => {
                if (!onHover)
                    return

                onHover("", "")
            }}>
            <BNavCont
                as={motion.div}
                whileHover={{ scale: 1.025 }}
            >
                <div id="bnavicon">
                    <BNavIconCont>
                        <img src={icon} width="17px" height="17px" />
                    </BNavIconCont>
                </div>
                <div id="bnavcontent">
                    <BNavTitle bold>
                        {title}
                    </BNavTitle>
                    <BNavDescription>
                        {description}
                    </BNavDescription>
                </div>
            </BNavCont>
        </Link>
    )
}
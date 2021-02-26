import {
    SMBarCont,
    SMBarIcon,
    SMBarButtExitCont,
    SMBarDDownCont
} from './SideMapBar.style'

import Dropdown from './Dropdown'

export default function SideMapBar() {
    return (
        <SMBarCont>
            <SMBarButtExitCont>

            </SMBarButtExitCont>
            <div id="content">
                <SMBarIcon>

                </SMBarIcon>

                <SMBarDDownCont>
                    <Dropdown data={["hola1", "hola2", "hola3"]} value={0} />
                </SMBarDDownCont>
            </div>
        </SMBarCont>
    )
}
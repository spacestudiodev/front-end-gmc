import {
    SMBarCont,
    SMBarHeader,
    SMBarButtExitCont,
    SMBarDDownCont
} from './SideMapBar.style'

import Dropdown from './Dropdown'
import Arrow from './Arrow'

const dropdownValues = [
    "Hello World 1", "Hello World 2", "Hello World 3", "Hello World 4", "Hello World 5", "Hello World 6"
]

export default function SideMapBar() {
    return (
        <SMBarCont>
            <SMBarHeader>
            </SMBarHeader>

            <SMBarButtExitCont>
                <Arrow dir="l" size={20} />
            </SMBarButtExitCont>

            <div id="content">
                <SMBarDDownCont>
                    <Dropdown
                        data={dropdownValues}
                        value={undefined}
                        placeholder="Select a District" />
                </SMBarDDownCont>
            </div>
        </SMBarCont>
    )
}
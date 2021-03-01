import Image from 'next/image'

import {
    SMBarCont,
    SMBarHeader,
    SMBarButtExitCont,
    SMBarDDownCont
} from './SideMapBar.style'

import Dropdown from '../UI/Dropdown'
import Arrow from '../UI/Arrow'


const dropdownValues = [
    "Hello World 1", "Hello World 2", "Hello World 3", "Hello World 4", "Hello World 5", "Hello World 6"
]

export default function SideMapBar() {
    return (
        <SMBarCont>
            <SMBarHeader>
                <Image src="/images/logogmc.png"
                    alt="Logo GMC"
                    width={130}
                    height={50}
                    id="logogmc"></Image>
            </SMBarHeader>

            <SMBarButtExitCont>
                <Arrow dir="l" size={23} />
            </SMBarButtExitCont>

            <div id="content">
                <SMBarDDownCont>
                    <Dropdown
                        data={dropdownValues}
                        value={undefined}
                        placeholder="Select a District" />
                </SMBarDDownCont>
            </div>
        </SMBarCont >
    )
}
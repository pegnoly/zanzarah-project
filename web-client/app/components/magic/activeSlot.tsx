import natureIcon from "../../assets/spells_active/nature.svg";
import waterIcon from "../../assets/spells_active/water.svg";
import stoneIcon from "../../assets/spells_active/stone.svg";
import fireIcon from "../../assets/spells_active/fire.svg";
import psiIcon from "../../assets/spells_active/psi.svg";
import airIcon from "../../assets/spells_active/air.svg";
import lightIcon from "../../assets/spells_active/light.svg";
import darkIcon from "../../assets/spells_active/dark.svg";
import energyIcon from "../../assets/spells_active/energy.svg";
import metallIcon from "../../assets/spells_active/metall.svg";
import chaosIcon from "../../assets/spells_active/chaos.svg";
import iceIcon from "../../assets/spells_active/ice.svg";
import jokerIcon from "../../assets/spells_active/joker.svg";
import blankIcon from "../../assets/spells_active/blank.png";

import { useEffect, useState } from "react";
import { MagicSlotSchema } from "./passiveSlot";
import { MagicElementType } from "../../graphql/graphql";

export function ActiveMagicSlot(schema: MagicSlotSchema) {

    const [firstElement, setFirstElement] = useState<MagicElementType | undefined>(undefined);
    const [secondElement, setSecondElement] = useState<MagicElementType | undefined>(undefined);
    const [thirdElement, setThirdElement] = useState<MagicElementType | undefined>(undefined);

    useEffect(() => {
        if(schema.slot != undefined) {
            setFirstElement(schema.slot?.firstElement);
            setSecondElement(schema.slot?.secondElement);
            setThirdElement(schema.slot?.thirdElement);
        }
    }, [schema])


    function getIcon(e: MagicElementType | undefined) {

        if (e == undefined) {
            return undefined;
        }
        switch(e) {
            case MagicElementType.None: return blankIcon; break
            case MagicElementType.Nature: return natureIcon; break
            case MagicElementType.Air: return airIcon; break
            case MagicElementType.Water: return waterIcon; break
            case MagicElementType.Light: return lightIcon; break
            case MagicElementType.Energy: return energyIcon; break
            case MagicElementType.Psi: return psiIcon; break
            case MagicElementType.Stone: return stoneIcon; break
            case MagicElementType.Ice: return iceIcon; break
            case MagicElementType.Fire: return fireIcon; break
            case MagicElementType.Dark: return darkIcon; break
            case MagicElementType.Chaos: return chaosIcon; break
            case MagicElementType.Metall: return metallIcon; break
            case MagicElementType.Joker: return jokerIcon; break
            case MagicElementType.Error: return blankIcon; break
        }
    }

    return (
        <div style={{width: '40%', height: '20%', position: "relative", display: 'flex', flexDirection: 'row'}}>
            <img width={15} height={15} src={getIcon(firstElement)}></img>
            <img width={15} height={15} src={getIcon(secondElement)}></img>
            <img width={15} height={15} src={getIcon(thirdElement)}></img>
        </div>
    )
}
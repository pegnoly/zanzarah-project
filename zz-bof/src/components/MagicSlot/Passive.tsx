import natureIcon from "../../assets/spells_passive/nature.svg";
import waterIcon from "../../assets/spells_passive/water.svg";
import stoneIcon from "../../assets/spells_passive/stone.svg";
import fireIcon from "../../assets/spells_passive/fire.svg";
import psiIcon from "../../assets/spells_passive/psi.svg";
import airIcon from "../../assets/spells_passive/air.svg";
import lightIcon from "../../assets/spells_passive/light.svg";
import darkIcon from "../../assets/spells_passive/dark.svg";
import energyIcon from "../../assets/spells_passive/energy.svg";
import metallIcon from "../../assets/spells_passive/metall.svg";
import chaosIcon from "../../assets/spells_passive/chaos.svg";
import iceIcon from "../../assets/spells_passive/ice.svg";
import jokerIcon from "../../assets/spells_passive/joker.svg";
import blankIcon from "../../assets/spells_passive/blank.png";


import { MagicElementType, MagicSlot } from "../types";
import { useEffect, useState } from "react";

export interface MagicSlotSchema {
    slot: MagicSlot | undefined
}

export function PassiveMagicSlot(schema: MagicSlotSchema) {

    const [firstElement, setFirstElement] = useState<MagicElementType | undefined>(undefined);
    const [secondElement, setSecondElement] = useState<MagicElementType | undefined>(undefined);
    const [thirdElement, setThirdElement] = useState<MagicElementType | undefined>(undefined);

    useEffect(() => {
        if(schema.slot != undefined) {
            setFirstElement(schema.slot?.first_element);
            setSecondElement(schema.slot?.second_element);
            setThirdElement(schema.slot?.third_element);
        }
    }, [schema])


    function getIcon(e: MagicElementType | undefined) {

        if (e == undefined) {
            return "";
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
            <img 
                width={15} 
                height={15} 
                src={getIcon(firstElement)}/>
            <img 
                width={15} 
                height={15} 
                src={getIcon(secondElement)}/>
            <img 
                width={15} 
                height={15} 
                src={getIcon(thirdElement)}/>
        </div>
    )
}
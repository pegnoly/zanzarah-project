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

import { MagicElementType } from "../types";
import { useEffect, useState } from "react";
import { MagicSlotSchema } from "./Passive";

export function ActiveMagicSlot(schema: MagicSlotSchema) {

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
        <div style={{width: 50, height: 50, position: "relative"}}>
            <img width={15} height={15} style={{position: "absolute", top: 5, left: 5}} src={getIcon(firstElement)}></img>
            <img width={15} height={15} style={{position: "absolute", top: 15, left: 15}} src={getIcon(secondElement)}></img>
            <img width={15} height={15} style={{position: "absolute", top: 25, left: 25}} src={getIcon(thirdElement)}></img>
        </div>
    )
}
import { List } from "antd";
import { WizformMagicLevel } from "./MagicLevel/WizformMagicLevel";
import { LevelOfMagic } from "../types";

interface WizformMagicsSchema {
    magics: LevelOfMagic[] | undefined
}



export function WizformMagics(schema: WizformMagicsSchema) {
    return (
        <>
            <List itemLayout="horizontal">{schema?.magics?.map((lm, i) => (
                <WizformMagicLevel key={i} level={lm}/>
            ))}</List>
        </>
    )
}
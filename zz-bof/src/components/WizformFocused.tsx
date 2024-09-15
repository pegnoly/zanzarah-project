import { Col, Image, List, Row, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MagicElement, Wizform } from "./types";
import { createStyles } from "antd-style";
import { convertFileSrc } from "@tauri-apps/api/core";
import { appDataDir, appLocalDataDir, join } from "@tauri-apps/api/path";

import natureIcon from "../assets/spells_active/nature.svg";
import { ActiveMagicSlot } from "./MagicSlot/Active";
import { WizformMagics } from "./WizformMagics";
import { ScrollArea, ScrollAreaScrollbar, ScrollAreaViewport } from "@radix-ui/react-scroll-area";
import { WizformMagicLevel } from "./MagicLevel/WizformMagicLevel";

interface WizformFocusedSchema {
    wizforms: Wizform[],
    elements: MagicElement[]
}

const wizformFocusedStyles = createStyles(({}) => ({
    main_block: {
        width: '98dvw',
        height: '30vh'
    },
    evolution_block: {
        width: '98dvw',
        height: '15vh'
    },
    magics_block: {
        width: '98dvw',
        height: '50vh'
    },
    magics_scroll: {
        width: '100%',
        height: '100%'
    }
}));

export function WizformFocused(schema: WizformFocusedSchema) {

    const [wizform, setWizform] = useState<Wizform | undefined>(undefined);
    console.log("Focused wizform: ", wizform);

    const {id} = useParams();

    useEffect(() => {
        setWizform(schema.wizforms.find((w) => w.id == id));
    }, [id])


    function getEvolutionForm(form: number) {
        if (form < 0) {
            return "Отсутствует";
        }
        else {
            return schema.wizforms.find(w => w.number == form)?.name;
        }
    }


    const styles = wizformFocusedStyles();

    return (
        <>
            <div className={styles.styles.main_block}>
                <Row>
                    <Col span={12} style={{display: "flex", flexDirection: "column"}}>
                        <img 
                        width={40} 
                        height={40} 
                        src="data:image/bmp;base64,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"></img>
                        <Typography.Text>{wizform?.name}</Typography.Text>
                        <Typography.Text>{schema.elements.find(e => e.element == wizform?.element)?.name}</Typography.Text>   
                    </Col>
                    <Col span={12} style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <Typography.Text>{`Здоровье: ${wizform?.hitpoints}`}</Typography.Text>
                        <Typography.Text>{`Ловкость: ${wizform?.agility}`}</Typography.Text>
                        <Typography.Text>{`Прыгучесть: ${wizform?.jump_ability}`}</Typography.Text>
                        <Typography.Text>{`Меткость: ${wizform?.precision}`}</Typography.Text>
                    </Col>
                </Row>
            </div>
            <div className={styles.styles.evolution_block}>
                <Typography.Text>{`Эволюция: ${getEvolutionForm(wizform?.evolution_form as number)}`}</Typography.Text>
                <Typography.Text>{`Уровень эволюции: ${getEvolutionForm(wizform?.evolution_form as number)}`}</Typography.Text>
            </div>
            <div className={styles.styles.magics_block}>
                <ScrollArea className={styles.styles.magics_scroll}>
                    <ScrollAreaViewport className={styles.styles.magics_scroll}>
                        <WizformMagics magics={wizform?.magics}/>
                    </ScrollAreaViewport>
                    <ScrollAreaScrollbar orientation="vertical"/>
                </ScrollArea>
            </div>
        </>
    )
}
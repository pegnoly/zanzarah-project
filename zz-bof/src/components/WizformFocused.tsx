import { Carousel, Col, Image, List, Row, Space, Typography } from "antd";
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
        // height: '15vh'
    },
    desc_block: {
        width: '98dvw',
        // height: '25vh',
        paddingTop: '3%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    evolution_block: {
        width: '98dvw',
        // height: '15vh',
        paddingTop: '3%',
        display: 'flex',
        flexDirection: 'column'
    },
    magics_block: {
        width: '98dvw',
        paddingTop: '3%',
        display: 'flex',
        flexDirection: 'column',
        //alignItems: 'center'
        //height: '50vh'
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

    function getEvolutionLevel(level: number) {
        if (level < 0) {
            return "Отсутствует"
        }
        else {
            return level
        }
    }


    const styles = wizformFocusedStyles();

    return (
        <>
            <div className={styles.styles.main_block}>
                <Row>
                    <Col span={12} style={{display: "flex", flexDirection: "column", alignItems: 'center'}}>
                        <img 
                        width={40} 
                        height={40} 
                        src={`data:image/bmp;base64,${wizform?.icon}`}></img>
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
            <div className={styles.styles.desc_block}>
                <Typography.Text>{wizform?.desc}</Typography.Text>
            </div>
            <div className={styles.styles.evolution_block}>
                <Typography.Text style={{textAlign: 'center'}}>{`Эволюция: ${getEvolutionForm(wizform?.evolution_form as number)}`}</Typography.Text>
                <Typography.Text style={{textAlign: 'center'}}>{`Уровень эволюции: ${getEvolutionLevel(wizform?.evolution_level as number)}`}</Typography.Text>
            </div>
            <div className={styles.styles.magics_block}>
                <Carousel style={{padding: '5%'}}>{wizform?.magics.map((m, i) => (
                    <div key={i} style={{display: 'flex', flexDirection: 'row', alignContent: 'center'}}>
                        <WizformMagicLevel level={m}></WizformMagicLevel>
                    </div>
                ))}</Carousel>
                {/* <ScrollArea className={styles.styles.magics_scroll}>
                    <ScrollAreaViewport className={styles.styles.magics_scroll}>
                        <WizformMagics magics={wizform?.magics}/>
                    </ScrollAreaViewport>
                    <ScrollAreaScrollbar orientation="vertical"/>
                </ScrollArea> */}
            </div>
        </>
    )
}
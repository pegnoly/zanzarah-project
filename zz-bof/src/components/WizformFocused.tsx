import { Carousel, Col, Row, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LevelOfMagic, Wizform, WizformElementType } from "./types";
import { createStyles } from "antd-style";
import { WizformMagicLevel } from "./MagicLevel/WizformMagicLevel";
import { useWizformStore } from "../stores/Wizform";
import { invoke } from "@tauri-apps/api/core";
import { useBooksStore } from "../stores/Book";
import { useShallow } from "zustand/shallow";

const wizformFocusedStyles = createStyles(({css}) => ({
    body: css`
        width: 100%;
        height: 100%;
        position: absolute;
        // background-color: red;
        background: rgb(2,0,36);
        background: linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(14,14,17,1) 45%, rgba(0,212,255,1) 100%);
        background-size: 100%;
    `,
    main_block: {
        width: '90dvw',
        paddingTop: '3%'
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
        alignContent: 'center'
        //height: '50vh'
    },
    magics_scroll: {
        width: '80%',
        // height: '100%'
    }
}));

export function WizformFocused() {
    
    const {id} = useParams();

    const [getIcon, getEvolutionName] = useWizformStore(useShallow((state) => [state.get_icon, state.get_evolution_name]));
    const elements = useBooksStore((state) => state.elements);

    const [name, setName] = useState<string>("");
    const [element, setElement] = useState<WizformElementType>(WizformElementType.None);
    const [desc, setDesc] = useState<string>("");
    const [hitpoints, setHitpoints] = useState<number>(0);
    const [agility, setAgility] = useState<number>(0);
    const [jumpAbility, setJumpAbility] = useState<number>(0);
    const [precision, setPrecision] = useState<number>(0);
    const [evolutionForm, setEvolutionForm] = useState<number>(0);
    const [evolutionLevel, setEvolutionLevel] = useState<number>(0);
    const [expModifier, setExpModifier] = useState<number>(0);
    const [magics, setMagics] = useState<LevelOfMagic[]>([]);

    useEffect(() => {
        invoke("load_wizform", {id: id})
            .then((value) => {
                const wizform = value as Wizform;
                setName(wizform.name);
                setElement(wizform.element);
                setDesc(wizform.desc);
                setHitpoints(wizform.hitpoints);
                setAgility(wizform.agility);
                setJumpAbility(wizform.jump_ability);
                setPrecision(wizform.precision);
                setEvolutionForm(wizform.evolution_form);
                setEvolutionLevel(wizform.evolution_level);
                setExpModifier(wizform.exp_modifier)
                setMagics(wizform.magics);
            })
    }, [id])


    function getEvolutionForm(form: number) {
        if (form < 0) {
            return "Отсутствует";
        }
        else {
            return getEvolutionName(form);
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
            <div className={styles.styles.body}
            >
                <div className={styles.styles.main_block}>
                    <Row>
                        <Col span={12} style={{display: "flex", flexDirection: "column", alignItems: 'center'}}>
                            <img 
                            width={40} 
                            height={40} 
                            src={`data:image/bmp;base64,${getIcon(id!)}`}></img>
                            <Typography.Text style={{fontFamily: 'Shantell Sans', textAlign: 'center'}}>{name}</Typography.Text>
                            <Typography.Text style={{fontFamily: 'Shantell Sans', fontWeight: 'bold'}}>{elements.find(e => e.element == element)?.name}</Typography.Text>   
                        </Col>
                        <Col span={12} style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                            <Space>
                                <Typography.Text style={{fontFamily: 'Shantell Sans', fontWeight: 'bolder'}}>Здоровье: </Typography.Text>
                                <Typography.Text style={{fontFamily: 'Shantell Sans', color: 'red'}}>{hitpoints}</Typography.Text>
                            </Space>
                            <Space>
                                <Typography.Text style={{fontFamily: 'Shantell Sans', fontWeight: 'bolder'}}>Ловкость: </Typography.Text>
                                <Typography.Text style={{fontFamily: 'Shantell Sans', color: 'red'}}>{agility}</Typography.Text>
                            </Space>
                            <Space>
                                <Typography.Text style={{fontFamily: 'Shantell Sans', fontWeight: 'bolder'}}>Прыгучесть: </Typography.Text>
                                <Typography.Text style={{fontFamily: 'Shantell Sans', color: 'red'}}>{jumpAbility}</Typography.Text>
                            </Space>
                            <Space>
                                <Typography.Text style={{fontFamily: 'Shantell Sans', fontWeight: 'bolder'}}>Меткость: </Typography.Text>
                                <Typography.Text style={{fontFamily: 'Shantell Sans', color: 'red'}}>{precision}</Typography.Text>
                            </Space>
                        </Col>
                    </Row>
                </div>
                <div className={styles.styles.desc_block}>
                    <Typography.Text style={{textAlign: 'center', fontFamily: 'Shantell Sans', fontWeight: 'bold'}}>{desc}</Typography.Text>
                </div>
                <div className={styles.styles.evolution_block}>
                    <div style={{display: "flex", flexDirection: "row", justifyContent: 'center'}}>
                        <Typography.Text style={{textAlign: 'center', fontFamily: 'Shantell Sans', color: 'white'}}>Эволюция:</Typography.Text>
                        <Typography.Text style={{textAlign: 'center', fontFamily: 'Shantell Sans', color: 'red', paddingLeft: 5}}>{`${getEvolutionForm(evolutionForm as number)}`}</Typography.Text>
                    </div>
                    <div style={{display: "flex", flexDirection: "row", justifyContent: 'center'}}>
                        <Typography.Text style={{textAlign: 'center', fontFamily: 'Shantell Sans', color: 'white'}}>Уровень эволюции:</Typography.Text>
                        <Typography.Text style={{textAlign: 'center', fontFamily: 'Shantell Sans', color: 'red', paddingLeft: 5}}>{`${getEvolutionLevel(evolutionLevel as number)}`}</Typography.Text>
                    </div>
                    <div style={{display: "flex", flexDirection: "row", justifyContent: 'center'}}>
                        <Typography.Text style={{textAlign: 'center', fontFamily: 'Shantell Sans', color: 'white'}}>Скорость повышения уровня:</Typography.Text>
                        <Typography.Text style={{textAlign: 'center', fontFamily: 'Shantell Sans', color: 'red', paddingLeft: 5}}>{expModifier}</Typography.Text>
                    </div>
                </div>
                <div className={styles.styles.magics_block}>
                    <Carousel arrows style={{padding: '10%', width: '95%'}}>{magics.map((m, i) => (
                        <div key={i} style={{display: 'flex', flexDirection: 'row', alignContent: 'center'}}>
                            <WizformMagicLevel level={m}></WizformMagicLevel>
                        </div>
                    ))}</Carousel>
                    {/* <div style={{display: 'flex', }}>
                        <Slider arrows dots slidesToShow={2}>
                            {magics.map((m, i) => (
                                <div key={i} style={{display: 'flex', flexDirection: 'row', alignContent: 'center'}}>
                                    <WizformMagicLevel level={m}></WizformMagicLevel>
                                </div>
                            ))}
                        </Slider>
                    </div> */}
                    {/* <ScrollArea className={styles.styles.magics_scroll}>
                        <ScrollAreaViewport className={styles.styles.magics_scroll}>
                            <WizformMagics magics={wizform?.magics}/>
                        </ScrollAreaViewport>
                        <ScrollAreaScrollbar orientation="vertical"/>
                    </ScrollArea> */}
                </div>
            </div>
        </>
    )
}
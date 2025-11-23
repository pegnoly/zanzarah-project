import { useActiveBook } from "@/contexts/activeBook";
import { RegistrationState, useAuth } from "@/contexts/auth";
import { ItemTransformType, type ItemEvolutionModel } from "@/queries/wizforms/types";
import { Collapse, Divider, Group, Image, List, Tabs, Text, Tooltip, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "react-router";

function WizformEvolutionsList({evolutions}: {evolutions: ItemEvolutionModel[]}) {
    return (
        evolutions.length == 0 ?
        <Text>Для данной феи нет взаимодействий с эволюционными предметами</Text> :
        <div style={{overflowY: 'auto', maxHeight: 500}}>
            <Tabs defaultValue={ItemTransformType.To} variant="pills" radius={0} color="teal">
                <Tabs.List grow>
                    <Tabs.Tab value={ItemTransformType.To} >
                        Превращается в...
                    </Tabs.Tab>
                    <Tabs.Tab value={ItemTransformType.From}>
                        Получается из...
                    </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value={ItemTransformType.To}>
                    <div style={{paddingTop: '4%'}}>
                        <List>{evolutions
                            .filter(
                                e => e.transformType == ItemTransformType.To && 
                                e.id != null &&
                                e.enabled != null &&
                                e.wizformIcon != null &&
                                e.wizformName != null
                            ).map((e, i) => (
                            <>                
                                <WizformEvolutionListItem key={i} model={e} index={i}/>
                                {
                                    i != (evolutions.length - 1) ? <Divider/> : null
                                }
                            </>
                        ))}</List>
                    </div>
                </Tabs.Panel>
                <Tabs.Panel value={ItemTransformType.From}>
                    <div style={{paddingTop: '4%'}}>
                        <List>{evolutions
                            .filter(                                
                                e => e.transformType == ItemTransformType.From && 
                                e.wizformIcon != null &&
                                e.wizformName != null
                            ).map((e, i) => (
                            <>                
                                <WizformEvolutionListItem key={i} model={e} index={i}/>
                                {
                                    i != (evolutions.length - 1) ? <Divider/> : null
                                }
                            </>
                        ))}</List>
                    </div>
                </Tabs.Panel>
            </Tabs>
        </div>
    )
}

function WizformEvolutionListItem({model ,index}: {model: ItemEvolutionModel, index: number}) {
    const auth = useAuth();
    const currentBook = useActiveBook();

    const [opened, {open, close}] = useDisclosure(false);
    if (model.spoilerable && auth?.registrationState != RegistrationState.Confirmed) {
        return null;
    }
    return (
        <Group justify="space-between">
            <div id={`elem${index}1`} style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '45%'}}>
                {
                    model.transformType == ItemTransformType.From ?
                    (
                        model.spoilerable == true ?
                        <div style={{width: '100%'}}>
                            <UnstyledButton hidden={opened} onClick={open}>
                                Показать
                            </UnstyledButton>
                            <Collapse in={opened} onClick={close}>
                                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'end', alignItems: 'center', width: '100%', gap: '5%'}}>
                                    <Tooltip label={model.wizformName}>
                                        <Text 
                                            style={{fontSize: 10, alignSelf: 'center', lineBreak: 'strict'}}
                                        >{model.wizformName}</Text>
                                    </Tooltip>
                                    {
                                        model.enabled ? 
                                        <Link 
                                            to={`/wizforms/${currentBook?.id}/focused/${model.id}`}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                flex: '0 0 auto',
                                                alignSelf: 'center'
                                            }}
                                        >
                                            <Image 
                                                w={40} 
                                                h={40} 
                                                style={{alignContent: 'self-end'}} 
                                                src={`data:image/bmp;base64,${model.wizformIcon}`}
                                            />
                                        </Link> :
                                        <Image w={40} h={40} style={{alignContent: 'self-end'}} src={`data:image/bmp;base64,${model.wizformIcon}`}/>
                                    }
                                </div>
                            </Collapse>
                        </div> :
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'end', alignItems: 'center', width: '100%', gap: '5%'}}>
                            <Tooltip label={model.wizformName}>
                                <Text style={{fontSize: 10, alignSelf: 'center', lineBreak: 'strict'}}>{model.wizformName}</Text>
                            </Tooltip>
                            {
                                model.enabled ? 
                                <Link 
                                    to={`/wizforms/${currentBook?.id}/focused/${model.id}`}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        flex: '0 0 auto',
                                        alignSelf: 'center'
                                    }}
                                >
                                    <Image 
                                        w={40} 
                                        h={40} 
                                        style={{alignContent: 'self-end'}} 
                                        src={`data:image/bmp;base64,${model.wizformIcon}`}
                                    />
                                </Link> :
                                <Image w={40} h={40} style={{alignContent: 'self-end'}} src={`data:image/bmp;base64,${model.wizformIcon}`}/>
                            }
                        </div>
                    ) :
                    <>
                        <Tooltip label={model.itemName}>
                            <Text style={{fontSize: 10, alignSelf: 'center', lineBreak: 'strict'}}>{model.itemName}</Text>
                        </Tooltip>
                        <Image w={40} h={40} style={{alignContent: 'self-end'}} src={`data:image/bmp;base64,${model.itemIcon}`}/>
                    </>
                }
            </div> 
            <div id={`elem${index}2`} style={{display: 'flex', flexDirection: 'row', width: '45%', gap: '5%', justifyContent: 'space-between', alignItems: 'center'}}>
                {
                    model.transformType == ItemTransformType.To ? 
                    (
                        model.spoilerable == true ?
                        <div style={{width: '100%'}}>
                            <UnstyledButton hidden={opened} onClick={open}>
                                Показать
                            </UnstyledButton>
                            <Collapse in={opened}>
                                <div style={{display: 'flex', flexDirection: 'row', gap: '5%', alignContent: 'center'}}>
                                    {
                                        model.enabled ?
                                        <Link 
                                            to={`/wizforms/${currentBook?.id}/focused/${model.id}`}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                flex: '0 0 auto',
                                                alignSelf: 'center'
                                            }}
                                        >
                                            <Image 
                                                w={40} 
                                                h={40} 
                                                // style={{alignContent: 'self-end'}} 
                                                src={`data:image/bmp;base64,${model.wizformIcon}`}
                                            />
                                        </Link> :
                                        <Image 
                                            w={40} 
                                            h={40} 
                                            // style={{alignContent: 'self-end'}} 
                                            src={`data:image/bmp;base64,${model.wizformIcon}`}
                                        />
                                    }
                                    <Tooltip label={model.wizformName}>
                                        <Text 
                                            style={{fontSize: 10, alignSelf: 'center', lineBreak: 'strict'}}
                                        >{model.wizformName}</Text>
                                    </Tooltip>
                                </div>
                            </Collapse>
                        </div> :
                        <div style={{width: '100%'}}>
                            <div style={{display: 'flex', flexDirection: 'row', gap: '5%', alignItems: 'center'}}>                    
                                {
                                    model.enabled ? 
                                    <Link 
                                        to={`/wizforms/${currentBook?.id}/focused/${model.id}`}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            flex: '0 0 auto',
                                            alignSelf: 'center'
                                        }}
                                    >
                                        <Image 
                                            w={40} 
                                            h={40}
                                            src={`data:image/bmp;base64,${model.wizformIcon}`}
                                        />
                                    </Link> 
                                    :
                                    <Image 
                                        w={40} 
                                        h={40} 
                                        src={`data:image/bmp;base64,${model.wizformIcon}`}
                                    />
                                }
                                <Tooltip label={model.wizformName}>
                                    <Text style={{fontSize: 10, justifySelf: 'center', lineBreak: 'strict'}}>{model.wizformName}</Text>
                                </Tooltip>
                            </div>   
                        </div>
                    ) : 
                    <>
                        <Image w={40} h={40} style={{alignContent: 'self-start'}} src={`data:image/bmp;base64,${model.itemIcon}`}/>
                        <Tooltip label={model.itemName}>
                            <Text style={{fontSize: 10, alignSelf: 'center', lineBreak: 'strict'}}>{model.itemName}</Text>
                        </Tooltip>
                    </>
                }
            </div>
        </Group>
    )
}

export default WizformEvolutionsList;
import { RegistrationState, useAuth } from "@/contexts/auth";
import { ItemTransformType, type ItemEvolutionModel } from "@/queries/wizforms/types";
import { Collapse, Divider, Group, Image, List, Tabs, Text, Tooltip, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

function WizformEvolutionsList({evolutions}: {evolutions: ItemEvolutionModel[]}) {
    console.log("Evolutions: ", evolutions)
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
    const [opened, {open, close}] = useDisclosure(false);
    if (model.spoilerable && auth?.registrationState != RegistrationState.Confirmed) {
        return null;
    }
    return (
        <Group justify="space-between">
            <div id={`elem${index}1`} style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '45%'}}>
                {
                    model.spoilerable == true && model.transformType == ItemTransformType.From ?
                    <div style={{width: '100%'}}>
                        <UnstyledButton hidden={opened} onClick={open}>
                            Показать
                        </UnstyledButton>
                        <Collapse in={opened} onClick={close}>
                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                                <Tooltip label={model.transformType == ItemTransformType.From ? model.wizformName : model.itemName}>
                                    <Text 
                                        style={{fontSize: 10, alignSelf: 'center', lineBreak: 'strict'}}
                                    >{model.transformType == ItemTransformType.From ? model.wizformName : model.itemName}</Text>
                                </Tooltip>
                                <Image 
                                    w={40} 
                                    h={40} 
                                    style={{alignContent: 'self-end'}} 
                                    src={`data:image/bmp;base64,${model.transformType == ItemTransformType.From ? model.wizformIcon : model.itemIcon}`}/>
                            </div>
                        </Collapse>
                    </div> :
                    <>
                        <Tooltip label={model.transformType == ItemTransformType.To ? model.itemName : model.wizformName}>
                            <Text style={{fontSize: 10, alignSelf: 'center', lineBreak: 'strict'}}>{model.transformType == ItemTransformType.To ? model.itemName : model.wizformName}</Text>
                        </Tooltip>
                        <Image w={40} h={40} style={{alignContent: 'self-end'}} src={`data:image/bmp;base64,${model.transformType == ItemTransformType.To ? model.itemIcon : model.wizformIcon}`}/>
                    </>
                }
            </div> 
            <div id={`elem${index}2`} style={{display: 'flex', flexDirection: 'row', width: '45%', gap: '5%', alignItems: 'center'}}>
                {
                    (model.spoilerable == true && model.transformType == ItemTransformType.To) ?
                    <div style={{width: '100%'}}>
                        <UnstyledButton hidden={opened} onClick={open}>
                            Показать
                        </UnstyledButton>
                        <Collapse in={opened}>
                            <div style={{display: 'flex', flexDirection: 'row', gap: '5%', alignContent: 'center'}}>
                                <Image 
                                    w={40} 
                                    h={40} 
                                    // style={{alignContent: 'self-end'}} 
                                    src={`data:image/bmp;base64,${model.transformType == ItemTransformType.To ? model.wizformIcon : model.itemIcon}`}/>
                                <Tooltip label={model.transformType == ItemTransformType.To ? model.wizformName : model.itemName}>
                                    <Text 
                                        style={{fontSize: 10, alignSelf: 'center', lineBreak: 'strict'}}
                                    >{model.transformType == ItemTransformType.To ? model.wizformName : model.itemName}</Text>
                                </Tooltip>
                            </div>
                        </Collapse>
                    </div> :
                    <>
                        <Image w={40} h={40} style={{alignSelf: 'center'}} src={`data:image/bmp;base64,${model.transformType == ItemTransformType.From ? model.itemIcon : model.wizformIcon}`}/>
                        <Tooltip label={model.transformType == ItemTransformType.From ? model.itemName : model.wizformName}>
                            <Text style={{fontSize: 10, alignSelf: 'center', justifySelf: 'center', lineBreak: 'strict'}}>{model.transformType == ItemTransformType.From ? model.itemName : model.wizformName}</Text>
                        </Tooltip>
                    </>
                }
            </div>
        </Group>
    )
}

export default WizformEvolutionsList;
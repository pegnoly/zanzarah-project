import { ItemTransformType, type ItemEvolutionModel } from "@/queries/wizforms/types";
import { Divider, Group, Image, List, Tabs, Text, Tooltip } from "@mantine/core";

function WizformEvolutionsList({evolutions}: {evolutions: ItemEvolutionModel[]}) {
    console.log("Evolutions: ", evolutions)
    return (
        evolutions.length == 0 ?
        <Text>Для данной феи нет взаимодействий с эволюционными предметами</Text> :
        <div style={{overflowY: 'auto', maxHeight: 500}}>
            <Tabs defaultValue={ItemTransformType.To} style={{justifyItems: 'center'}}>
                <Tabs.List>
                    <Tabs.Tab value={ItemTransformType.To}>
                        Превращается в...
                    </Tabs.Tab>
                    <Tabs.Tab value={ItemTransformType.From}>
                        Получается из...
                    </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value={ItemTransformType.To}>
                    <div style={{paddingTop: '4%'}}>
                        <List>{evolutions.filter(e => e.transformType == ItemTransformType.To && e.spoilerable == false).map((e, i) => (
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
                        <List>{evolutions.filter(e => e.transformType == ItemTransformType.From && e.spoilerable == false).map((e, i) => (
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

    return (
            <Group justify="space-between">
                <div id={`elem${index}1`} style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '45%'}}>
                    <Tooltip label={model.transformType == ItemTransformType.To ? model.itemName : model.wizformName}>
                        <Text style={{fontSize: 10, alignSelf: 'center', lineBreak: 'strict'}}>{model.transformType == ItemTransformType.To ? model.itemName : model.wizformName}</Text>
                    </Tooltip>
                    <Image w={40} h={40} style={{alignContent: 'self-end'}} src={`data:image/bmp;base64,${model.transformType == ItemTransformType.To ? model.itemIcon : model.wizformIcon}`}/>
                </div> 
                <div id={`elem${index}2`} style={{display: 'flex', flexDirection: 'row', width: '45%', gap: '5%', alignItems: 'center'}}>
                    <Image w={40} h={40} style={{alignSelf: 'center'}} src={`data:image/bmp;base64,${model.transformType == ItemTransformType.From ? model.itemIcon : model.wizformIcon}`}/>
                    <Tooltip label={model.transformType == ItemTransformType.From ? model.itemName : model.wizformName}>
                        <Text style={{fontSize: 10, alignSelf: 'center', justifySelf: 'center', lineBreak: 'strict'}}>{model.transformType == ItemTransformType.From ? model.itemName : model.wizformName}</Text>
                    </Tooltip>
                </div>
            </Group>
    )
}

export default WizformEvolutionsList;
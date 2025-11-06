import type { ItemEvolutionModel } from "@/queries/wizforms/types";
import { Divider, Group, Image, List, Text, Tooltip } from "@mantine/core";

function WizformEvolutionsList({evolutions}: {evolutions: ItemEvolutionModel[]}) {

    return (
        evolutions.length == 0 ?
        <Text>Для данной феи нет взаимодействий с эволюционными предметами</Text> :
        <div style={{overflowY: 'auto', maxHeight: 500}}>
            <List>{evolutions.map((e, i) => (
                <>                
                    <WizformEvolutionListItem model={e} index={i}/>
                    {
                        i != (evolutions.length - 1) ? <Divider/> : null
                    }
                </>
            ))}</List>
        </div>
    )
}

function WizformEvolutionListItem({model ,index}: {model: ItemEvolutionModel, index: number}) {

    return (
            <Group justify="space-between">
                <div id={`elem${index}1`} style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '45%'}}>
                    <Tooltip label={model.itemName}>
                        <Text style={{fontSize: 10, alignSelf: 'center'}}>{model.itemName}</Text>
                    </Tooltip>
                    <Image w={40} h={40} style={{alignContent: 'self-end'}} src={`data:image/bmp;base64,${model.itemIcon}`}/>
                </div> 
                <div id={`elem${index}2`} style={{display: 'flex', flexDirection: 'row', width: '45%', gap: '5%'}}>
                    <Image w={40} h={40} style={{alignSelf: 'start'}} src={`data:image/bmp;base64,${model.wizformIcon}`}/>
                    <Tooltip label={model.wizformName}>
                        <Text style={{fontSize: 10, alignSelf: 'center', justifySelf: 'center'}}>{model.wizformName}</Text>
                    </Tooltip>
                </div>
            </Group>
    )
}

export default WizformEvolutionsList;
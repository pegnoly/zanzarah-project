import type { ItemEvolutionModel } from "@/queries/wizforms/types";
import { Group, Image, List, Stack, Text, Tooltip } from "@mantine/core";

function WizformEvolutionsList({evolutions}: {evolutions: ItemEvolutionModel[]}) {

    return (
        evolutions.length == 0 ?
        <Text>Для данной феи нет взаимодействий с эволюционными предметами</Text> :
        <div style={{overflowY: 'auto', maxHeight: 500}}>
            <List>{evolutions.map((e, i) => (
                <Group key={i} justify="space-between">
                    <div style={{display: 'flex', flexDirection: 'column', alignContent: 'center', width: '40%'}}>
                        <Image w={40} h={40} style={{position: 'relative', left: '30%'}} src={`data:image/bmp;base64,${e.itemIcon}`}/>
                        <Tooltip label={e.itemName}>
                            <Text lineClamp={1} style={{fontSize: 10}}>{e.itemName}</Text>
                        </Tooltip>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', alignContent: 'center', width: '40%'}}>
                        <Image w={40} h={40} style={{alignSelf: 'center'}} src={`data:image/bmp;base64,${e.wizformIcon}`}/>
                        <Tooltip label={e.wizformName}>
                            <Text lineClamp={1} style={{fontSize: 10, alignSelf: 'center'}}>{e.wizformName}</Text>
                        </Tooltip>
                    </div>
                </Group>
            ))}</List>
        </div>
    )
}

export default WizformEvolutionsList;
import type { WizformFull } from "@/queries/wizforms/types";
import { Badge, Group, Image, Text } from "@mantine/core";

type WizformBasePropsSchema = Omit<WizformFull, "magics">;

function WizformBaseProps(params: {
    model: WizformBasePropsSchema
}) {

    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{ display: 'flex', flexDirection: 'column', alignSelf: 'start'}}>
                <Badge radius={0}>
                    Характеристики
                </Badge>
                <Group gap="xs">
                    <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>{`Максимальное здоровье:`}</Text>
                    <Text size="md" style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}>{params.model!.hitpoints}</Text>
                </Group>
                <Group gap="xs">
                    <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>{`Ловкость:`}</Text>
                    <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}>{params.model!.agility}</Text>
                </Group>
                <Group gap="xs">
                    <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>{`Прыгучесть:`}</Text>
                    <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}>{params.model!.jumpAbility}</Text>
                </Group>
                <Group gap="xs">
                    <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>{`Меткость:`}</Text>
                    <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}>{params.model!.precision}</Text>
                </Group>
                <Group gap="xs">
                    <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>{`Скорость прокачки:`}</Text>
                    <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}>{params.model!.expModifier}</Text>
                </Group>
            </div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingTop: '5%', gap: '5%'}}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4%', width: '50%'}}>
                    <Badge radius={0}>
                        Эволюция
                    </Badge>
                    {
                        params.model.evolutionForm == -1 ? 
                        <Text style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red', fontSize: 15}}>Нет</Text> : 
                        <div style={{display: 'flex', flexDirection: 'column', gap: '2%', alignItems: 'center', paddingTop: '4%'}}>
                            <Image w={40} h={40} src={`data:image/bmp;base64,${params.model.evolutionIcon}`}/>
                            <Text 
                                style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}
                            >{`${params.model.evolutionName}`}</Text>
                            <Group gap={5}>
                                <Text size="sm" style={{fontFamily: 'Comfortaa', fontWeight: 'bold'}}>{`Уровень: `}</Text>
                                <Text size="sm" c="red" style={{fontFamily: 'Comfortaa', fontWeight: 'bold'}}>{params.model.evolutionLevel}</Text>
                            </Group>
                        </div>
                    }
                </div>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4%', width: '50%'}}>
                    <Badge radius={0}>
                        Предыдущая форма
                    </Badge>
                    {
                        params.model.previousForm == undefined ?
                        <Text style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red', fontSize: 15}}>Нет</Text> :
                        <div style={{display: 'flex', flexDirection: 'column', paddingTop: '2%', alignItems: 'center'}}>
                            <Image w={40} h={40} src={`data:image/bmp;base64,${params.model.previousIcon}`}/>
                            <Text 
                                style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}
                            >{`${params.model.previousFormName}`}</Text>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default WizformBaseProps;
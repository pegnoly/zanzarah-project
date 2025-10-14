import type { WizformFull } from "@/queries/wizforms/types";
import { Badge, Group, Text } from "@mantine/core";

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
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'end', paddingTop: '5%'}}>
                <Badge radius={0}>
                    Превращения
                </Badge>
                <div style={{display: 'flex', flexDirection: 'column', gap: '2%', alignItems: 'end'}}>
                    <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>{`Эволюция:`}</Text>
                    <Text 
                        size='md' 
                        lineClamp={1}
                        style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}
                    >{params.model!.evolutionForm == -1 ? 'Отстуствует' : params.model!.evolutionName}</Text>
                </div>
                <Group gap="xs">
                    <Text span size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>{`Уровень эволюции:`}</Text>
                    <Text 
                        span
                        size='md' 
                        style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}
                    >{params.model!.evolutionLevel == -1 ? 'Отсутствует' : params.model!.evolutionLevel!}</Text>
                </Group>
                <div style={{display: 'flex', flexDirection: 'column', gap: '2%', alignItems: 'end'}}>
                    <Text span size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>{`Предыдущая форма:`}</Text>
                    <Text 
                        span
                        size='md' 
                        lineClamp={1}
                        style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}
                    >{params.model!.previousForm == undefined ? 'Отсутствует' : params.model!.previousFormName!}</Text>
                </div>
            </div>
        </div>
    )
}

export default WizformBaseProps;
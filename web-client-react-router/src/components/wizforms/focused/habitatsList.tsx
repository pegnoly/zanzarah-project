import type { WizformHabitatModel } from "@/queries/wizforms/types";
import { Group, List, Popover, PopoverDropdown, PopoverTarget, Text, UnstyledButton } from "@mantine/core";
import { IconQuestionMark } from "@tabler/icons-react";

function WizformHabitatsList(params: {
    habitats: WizformHabitatModel []
}) {
    return (
        params.habitats.length == 0 ?
        <Text>Для данной феи еще не отмечено ни одного места обитания</Text> :
        <List>{params.habitats.map((h, i) => (
            <Group key={i} justify="space-between">
                <div style={{display: 'flex', flexDirection: 'column', gap: '3%', paddingTop: '2%'}}>
                    <Text style={{fontFamily: 'Comfortaa', fontSize: '0.85rem', color: 'gray', wordBreak: 'normal'}}>{`${h.sectionName}: `}</Text>
                    <Text style={{fontFamily: 'Comfortaa', fontSize: '0.85rem', fontWeight: 'bold', wordBreak: 'normal'}}>{h.locationName}</Text>
                </div>
                {
                    !h.comment ?
                    null :
                    <WizformHabitatComment comment={h.comment}/>
                }
            </Group>
        ))}</List>
    )
}

function WizformHabitatComment(params: {
    comment: string
}) {

    return (
        <Popover>
            <PopoverTarget>
                <UnstyledButton>
                    <IconQuestionMark/>
                </UnstyledButton>
            </PopoverTarget>
            <PopoverDropdown>
                <Text>{params.comment}</Text>
            </PopoverDropdown>
        </Popover>
    )
}

export default WizformHabitatsList;
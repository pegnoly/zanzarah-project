import ElementsSelector from "@/components/utils/elementsSelector";
import { WizformElementType } from "@/graphql/graphql";
import useMapStore from "@/stores/map";
import { addLocationWizform } from "@/utils/queries/map/addEntryMutation";
import { LocationWizformEntry } from "@/utils/queries/map/types";
import { Button, Group, Select, TextInput } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useShallow } from "zustand/shallow";

function LocationEntryCreator(params: {
    currentLocation: string,
    onEntryCreated: (wizformId: string, entry: LocationWizformEntry) => void 
}) {
    const selectables = useMapStore(useShallow((state) => state.selectablesData?.get(params.currentLocation)));

    const [elementFilter, setElementFilter] = useState<WizformElementType>(WizformElementType.Nature);
    const [nameFilter, setNameFilter] = useState<string>("");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const addLocationEntryMutation = useMutation({
        mutationFn: addLocationWizform,
        onSuccess: (data) => {
            setSelectedId(null);
            if (data != undefined) {
                const selectable = selectables?.find(s => s.id == selectedId);
                params.onEntryCreated(
                    selectedId!, 
                    {
                        id: data, 
                        wizformElement: selectable?.element!, 
                        wizformName: selectable?.name!,
                        wizformNumber: selectable?.number!,
                        comment: null
                    }
                );
            }
        }
    })

    return <div style={{display: 'flex', flexDirection: 'column', alignContent: 'center'}}>
        <Group>
            <ElementsSelector 
                current={elementFilter} 
                disabled={false}
                label="Выбрать элемент"
                selectedCallback={setElementFilter}
            /> 
            <TextInput label="Указать имя" value={nameFilter} onChange={(e) => setNameFilter(e.currentTarget.value)}/>
        </Group>
        <div style={{paddingTop: '5%'}}>
            <Select
                style={{justifyItems: 'center'}}
                value={selectedId}
                onChange={setSelectedId}
                data={selectables!
                    .filter(s => s.element == elementFilter)
                    .filter(s => nameFilter == "" ? s : s.name.toLowerCase().startsWith(nameFilter.toLowerCase()))
                    .sort((s1, s2) => s1.number - s2.number)
                    .map((s) => ({
                    value: s.id, label: s.name
                }))}
            />
        </div>
        <Group justify="flex-end" pt="lg">
            <Button 
                disabled={!selectedId} 
                onClick={() => addLocationEntryMutation.mutate({
                    data: {locationId: params.currentLocation, wizformId: selectedId!, comment: ""}
                })}>Добавить</Button>
        </Group>
    </div>
}

export default LocationEntryCreator;
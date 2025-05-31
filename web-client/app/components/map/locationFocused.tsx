import { Accordion, Button, Group, List, Modal, Select, Tabs, Text, TextInput } from "@mantine/core";
import { AuthProps, RegistrationState, UserPermissionType } from "../../utils/auth/utils";
import { WizformElement } from "../../utils/queries/elements";
import { addLocationWizform, Location, LocationFullModel, LocationWizformEntry, SelectableWizform } from "../../utils/queries/map";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "@tanstack/react-router";
import { useCommonStore } from "../../stores/common";
import { useState } from "react";
import { WizformElementType } from "../../graphql/graphql";
import ElementsSelector from "../utils/elementsSelector";
import { useMutation } from "@tanstack/react-query";
import { IconTrashFilled } from "@tabler/icons-react";

enum TabsVariant {
    EntriesList = "EntriesList",
    EntryCreator = "EntryCreator"
}

function LocationFocused(params: {
    models: LocationWizformEntry [] | undefined,
    selectableWizforms: SelectableWizform [] | undefined,
    auth: AuthProps,
    location: Location
}) {
    const navigate = useNavigate();
    const [opened, {open, close}] = useDisclosure(true);
    const [entries, setEntries] = useState<LocationWizformEntry [] | undefined>(params.models);
    const [selectables, setSelectables] = useState<SelectableWizform [] | undefined>(params.selectableWizforms);

    async function entryAdded(entry: LocationWizformEntry) {
        setEntries([...entries!, entry])
    }

    async function selectableRemoved(wizformId: string) {
        const updatedSelectables = selectables?.filter(s => s.id != wizformId);
        setSelectables(updatedSelectables);
    }

    return <>
    <Modal.Root opened={opened} centered={true} onClose={() => navigate({to: '.', search: {focused: undefined}})}>
        <Modal.Overlay/>
        <Modal.Content>
            <Modal.Header>
                <Modal.Title>{`Феи локации ${params.location.name}`}</Modal.Title>
                <Modal.CloseButton/>
            </Modal.Header>
            <Modal.Body>
            {
                params.auth.userState == RegistrationState.Confirmed && 
                (params.auth.userPermission == UserPermissionType.Editor || params.auth.userPermission == UserPermissionType.Admin) ?
                <EditorTabs 
                    auth={params.auth}
                    currentLocation={params.location.id}
                    models={entries}
                    selectables={selectables!}
                    onModelsUpdated={entryAdded}
                    onSelectablesUpdated={selectableRemoved}
                /> :
                <WizformsList 
                    auth={params.auth}
                    models={params.models}
                />
            }
            </Modal.Body>
        </Modal.Content>
    </Modal.Root>
    </>
}

function EditorTabs(params: {
    auth: AuthProps,
    models: LocationWizformEntry [] | undefined,
    selectables: SelectableWizform [],
    onSelectablesUpdated: (wizformId: string) => void,
    onModelsUpdated: (entry: LocationWizformEntry) => void
    currentLocation: string
}) {

    async function entryCreated(wizformId: string, entry: LocationWizformEntry) {
        params.onModelsUpdated(entry);
        params.onSelectablesUpdated(wizformId);
    }

    return (
    <>
        <Tabs variant="outline" defaultValue={TabsVariant.EntriesList}>
            <Tabs.List>
                <Tabs.Tab value={TabsVariant.EntriesList}>
                    Список фей локации
                </Tabs.Tab>
                <Tabs.Tab value={TabsVariant.EntryCreator}>
                    Добавление фей
                </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value={TabsVariant.EntriesList}>
                <WizformsList 
                    auth={params.auth}
                    models={params.models}
                />
            </Tabs.Panel>
            <Tabs.Panel value={TabsVariant.EntryCreator}>
                <LocationEntryCreator onEntryCreated={entryCreated} selectables={params.selectables} currentLocation={params.currentLocation}/>
            </Tabs.Panel>
        </Tabs> 
    </>
    )
}

function WizformsList(params: {
    models: LocationWizformEntry [] | undefined
    auth: AuthProps
}) {
    const presentedElements = [...new Set(params.models?.map(m => m.wizformElement))];
    const elements = useCommonStore(state => state.elements);

    return <>
        <Accordion>{presentedElements.map((e, i) => (
            <Accordion.Item key={i} value={e}>
                <Accordion.Control style={{backgroundColor: 'silver'}}>{elements?.find(el => el.element == e)?.name}</Accordion.Control>
                <Accordion.Panel>
                    <List>{params.models?.filter(m => m.wizformElement == e).map((m, mi) => (
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text key={mi}>{m.wizformName}</Text>
                            {
                                params.auth.userState == RegistrationState.Confirmed &&
                                (params.auth.userPermission == (UserPermissionType.Admin || UserPermissionType.Editor)) ?
                                <Button size="compact-xs">
                                    <IconTrashFilled/>
                                </Button> :
                                null
                            }
                        </div>
                    ))}</List> 
                </Accordion.Panel>
            </Accordion.Item>
        ))}
        </Accordion>
    </>
}

function LocationEntryCreator(params: {
    selectables: SelectableWizform [],
    currentLocation: string,
    onEntryCreated: (wizformId: string, entry: LocationWizformEntry) => void 
}) {
    const [elementFilter, setElementFilter] = useState<WizformElementType>(WizformElementType.Nature);
    const [nameFilter, setNameFilter] = useState<string>("");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const addLocationEntryMutation = useMutation({
        mutationFn: addLocationWizform,
        onSuccess: (data) => {
            setSelectedId(null);
            if (data != undefined) {
                const selectable = params.selectables.find(s => s.id == selectedId);
                params.onEntryCreated(
                    selectedId!, 
                    {
                        id: data, 
                        wizformElement: selectable?.element!, 
                        wizformName: selectable?.name!,
                        wizformNumber: selectable?.number!
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
                data={params.selectables
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

export default LocationFocused;
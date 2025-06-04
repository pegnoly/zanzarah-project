import { Accordion, Button, Group, List, Modal, Select, Tabs, Text, TextInput } from "@mantine/core";
import { AuthProps, RegistrationState, UserPermissionType } from "../../utils/auth/utils";
import { addLocationWizform, deleteLocationWizform, fetchLocationEntriesOptions, Location, LocationFullModel, LocationWizformEntry, SelectableWizform } from "../../utils/queries/map";
import { useNavigate, useRouteContext } from "@tanstack/react-router";
import { useCommonStore } from "../../stores/common";
import { useState } from "react";
import { WizformElementType } from "../../graphql/graphql";
import ElementsSelector from "../utils/elementsSelector";
import { useMutation } from "@tanstack/react-query";
import { IconTrashFilled } from "@tabler/icons-react";
import useMapStore from "@/stores/map";
import { useShallow } from "zustand/shallow";

enum TabsVariant {
    EntriesList = "EntriesList",
    EntryCreator = "EntryCreator"
}

function LocationFocused(params: {
    bookId: string,
    sectionId: string,
    auth: AuthProps,
    location: Location,
    entries: LocationWizformEntry [],
    selectables: SelectableWizform [],
}) {
    const navigate = useNavigate();
    // const context = Route.useRouteContext();
    const [entries, setEntries, selectables, setSelectables] = useMapStore(useShallow((state) => [
        state.entriesData,
        state.setEntries,
        state.selectablesData,
        state.setSelectables,
    ]));

    if (entries?.get(params.location.id) == undefined) {
        const updatedEntriesData = entries?.set(params.location.id, params.entries);
        setEntries(updatedEntriesData!);
    }
    if (selectables?.get(params.location.id) == undefined) {
        const updatedSelectablesData = selectables?.set(params.location.id, params.selectables);
        setSelectables(updatedSelectablesData!);
    }

    async function entryAdded(wizformId: string, entry: LocationWizformEntry) {
        setSelectables(selectables?.set(params.location.id, selectables.get(params.location.id)?.filter(s => s.id != wizformId))!);
        setEntries(entries?.set(params.location.id, [...entries.get(params.location.id)!, entry])!);
    }

    async function entryRemoved(entryId: string, selectable: SelectableWizform) {
        setEntries(entries?.set(params.location.id, entries.get(params.location.id)?.filter(e => e.id != entryId))!);
        setSelectables(selectables?.set(params.location.id, [...selectables.get(params.location.id)!, selectable])!);
    }

    return <>
    <Modal.Root opened={true} centered={true} onClose={() => navigate({to: '/map/$bookId/section/$id', params: {bookId: params.bookId, id: params.sectionId}})}>
        <Modal.Overlay/>
        <Modal.Content>
            <Modal.Header>
                <Modal.Title style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '2rem'}}>{`Феи локации ${params.location.name}`}</Modal.Title>
                <Modal.CloseButton/>
            </Modal.Header>
            <Modal.Body>
            {
                params.auth.userState == RegistrationState.Confirmed && 
                (params.auth.userPermission == UserPermissionType.Editor || params.auth.userPermission == UserPermissionType.Admin) ?
                <EditorTabs 
                    auth={params.auth}
                    currentLocation={params.location.id}
                    entryAddedCallback={entryAdded}
                    entryRemovedCallback={entryRemoved}
                    // entries={params.entries}
                    // selectables={params.selectables}
                /> :
                <WizformsList 
                    modelRemovedCallback={entryRemoved}
                    auth={params.auth}
                    currentLocation={params.location.id}
                    // entries={params.entries}
                />  
            }
            </Modal.Body>
        </Modal.Content>
    </Modal.Root>
    </>
}

function EditorTabs(params: {
    auth: AuthProps,
    currentLocation: string,
    entryAddedCallback: (wizformId: string, entry: LocationWizformEntry) => void,
    entryRemovedCallback: (id: string, selectable: SelectableWizform) => void,
}) {
    async function entryCreated(wizformId: string, entry: LocationWizformEntry) {
        params.entryAddedCallback(wizformId, entry);
    }

    async function entryRemoved(id: string, selectable: SelectableWizform) {
        params.entryRemovedCallback(id, selectable);
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
                    modelRemovedCallback={entryRemoved}
                    currentLocation={params.currentLocation}
                />
            </Tabs.Panel>
            <Tabs.Panel value={TabsVariant.EntryCreator}>
                <LocationEntryCreator 
                    onEntryCreated={entryCreated} 
                    currentLocation={params.currentLocation}
                />
            </Tabs.Panel>
        </Tabs> 
    </>
    )
}

function WizformsList(params: {
    currentLocation: string,
    auth: AuthProps,
    modelRemovedCallback: (id: string, selectable: SelectableWizform) => void
}) {
    const elements = useCommonStore(useShallow((state) => state.elements));
    const entries = useMapStore(useShallow((state) => state.entriesData?.get(params.currentLocation)));
    console.log("Entries after update: ", entries)

    const presentedElements = [...new Set(entries?.map(m => m.wizformElement))];

    const deleteLocationEntryMutation = useMutation({
        mutationFn: deleteLocationWizform,
        onSuccess(data, variables, context) {
            if (data) {
                params.modelRemovedCallback(variables.data.id, data!);
            }
        },
    })

    return <>
        <Accordion>{presentedElements.map((e, i) => (
            <Accordion.Item key={i} value={e}>
                <Accordion.Control style={{backgroundColor: 'silver'}}>{elements?.find(el => el.element == e)?.name}</Accordion.Control>
                <Accordion.Panel>
                    <List>{entries?.filter(m => m.wizformElement == e).map((m, mi) => (
                        <div key={mi} style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text>{m.wizformName}</Text>
                            {
                                params.auth.userState == RegistrationState.Confirmed &&
                                (params.auth.userPermission == (UserPermissionType.Admin || UserPermissionType.Editor)) ?
                                <Button onClick={() => deleteLocationEntryMutation.mutate({data: {id: m.id}})} size="compact-xs">
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

export default LocationFocused;
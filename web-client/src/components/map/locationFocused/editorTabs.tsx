// import { AuthProps } from "@/utils/auth/utils";
// import { LocationWizformEntry, SelectableWizform } from "@/utils/queries/map/types";
// import { Tabs } from "@mantine/core";
// import WizformsList from "./wizformsList";
// import LocationEntryCreator from "./entryCreator";

// enum TabsVariant {
//     EntriesList = "EntriesList",
//     EntryCreator = "EntryCreator"
// }

// function EditorTabs(params: {
//     auth: AuthProps,
//     currentLocation: string,
//     entryAddedCallback: (wizformId: string, entry: LocationWizformEntry) => void,
//     entryRemovedCallback: (id: string, selectable: SelectableWizform) => void,
//     commentAddedCallback: (id: string, comment: string) => void,
//     commentDeletedCallback: (id: string) => void
// }) {
//     async function entryCreated(wizformId: string, entry: LocationWizformEntry) {
//         params.entryAddedCallback(wizformId, entry);
//     }

//     async function entryRemoved(id: string, selectable: SelectableWizform) {
//         params.entryRemovedCallback(id, selectable);
//     }

//     async function commentAdded(id: string, comment: string) {
//         params.commentAddedCallback(id, comment);
//     }

//     async function commentDeleted(id: string) {
//         params.commentDeletedCallback(id);
//     }

//     return (
//     <>
//         <Tabs variant="outline" defaultValue={TabsVariant.EntriesList}>
//             <Tabs.List>
//                 <Tabs.Tab value={TabsVariant.EntriesList}>
//                     Список фей локации
//                 </Tabs.Tab>
//                 <Tabs.Tab value={TabsVariant.EntryCreator}>
//                     Добавление фей
//                 </Tabs.Tab>
//             </Tabs.List>
//             <Tabs.Panel value={TabsVariant.EntriesList}>
//                 <WizformsList 
//                     auth={params.auth}
//                     modelRemovedCallback={entryRemoved}
//                     currentLocation={params.currentLocation}
//                     commentAddedCallback={commentAdded}
//                     commentDeletedCallback={commentDeleted}
//                 />
//             </Tabs.Panel>
//             <Tabs.Panel value={TabsVariant.EntryCreator}>
//                 <LocationEntryCreator 
//                     onEntryCreated={entryCreated} 
//                     currentLocation={params.currentLocation}
//                 />
//             </Tabs.Panel>
//         </Tabs> 
//     </>
//     )
// }

// export default EditorTabs;
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { fetchLocationEntriesOptions, fetchLocationsOptions, fetchSelectableWizformsOptions, Location, LocationFullModel, LocationWizformEntry, SelectableWizform } from '../../utils/queries/map';
import LocationsGrid from '../../components/map/locationGrid';
import { fetchElementsOptions, WizformElement } from '../../utils/queries/elements';
import { AuthProps, processAuth, RegistrationState, UserPermissionType } from '../../utils/auth/utils';
import LocationFocused from '../../components/map/locationFocused';
import { useCommonStore } from '../../stores/common';
import { Button } from '@mantine/core';
import { useShallow } from 'zustand/shallow';
import useMapStore from '@/stores/map';

type LoaderData = {
  locations: Location[] | undefined,
  // elements: WizformElement [] | undefined,
  // focused: LocationWizformEntry [] | undefined,
  // auth: AuthProps | undefined,
  // selectableWizforms: SelectableWizform [] | undefined
}

export const Route = createFileRoute('/map/$bookId/section/$id')({
  component: RouteComponent,
  loader: async({params, context}): Promise<LoaderData | undefined> => {
    let loaderData: LoaderData = {
      locations: undefined,
    }
    const locationsData = await context.queryClient.ensureQueryData(fetchLocationsOptions({sectionId: params.id}));
    loaderData = {...loaderData, locations: locationsData};
    return loaderData;
  }
})

function RouteComponent() {
  const loaderData = Route.useLoaderData();
  const params = Route.useParams();

  const navigate = useNavigate();
  const [setEntries, setSelectables, setLocations] = useMapStore(useShallow((state) => [
    state.setEntries,
    state.setSelectables,
    state.setLocations
  ]));

  setLocations(loaderData?.locations!);
  // setEntries(undefined);
  // setSelectables(undefined);

  // const setElements = useCommonStore(useShallow((state) => state.setElements));
  // setElements(loaderData?.elements)

  // const [entries, setEntries, selectables, setSelectables, currentLocation, setCurrentLocation] = useMapStore(useShallow((state) => [
  //   state.entries,
  //   state.setEntries,
  //   state.selectables,
  //   state.setSelectables,
  //   state.currentLocation,
  //   state.setCurrentLocation
  // ]));

  // if (focused != undefined) {
  //   if (entries == undefined || currentLocation != focused) {
  //     setEntries(loaderData?.focused!);
  //   }
  //   if (selectables == undefined || currentLocation != focused) {
  //     setSelectables(loaderData?.selectableWizforms!);
  //   }
  //   setCurrentLocation(focused);
  // }

  // async function onEntryAdded(wizformId: string, entry: LocationWizformEntry) {
  //   setEntries([...entries!, entry]);
  //   const updatedSelectables = selectables?.filter(s => s.id != wizformId);
  //   setSelectables(updatedSelectables);
  // }

  // async function onEntryRemoved(entryId: string, selectable: SelectableWizform) {
  //   setSelectables([...selectables!, selectable])
  //   const updatedEntries = entries?.filter(e => e.id != entryId);
  //   setEntries(updatedEntries);
  // }

  return (
    <>
      <LocationsGrid locations={loaderData!.locations!} bookId={params.bookId} sectionId={params.id}/>
      {/* {
        focused != undefined ? 
        <LocationFocused 
          entryAddedCallback={onEntryAdded}
          entryRemovedCallback={onEntryRemoved}
          location={loaderData?.locations?.find(l => l.id == focused)!}
          auth={loaderData?.auth!} 
        /> :
        null
      } */}
      <Button
        onClick={() => navigate({to: '/'})} 
        style={{position: 'sticky', bottom: '95%', left: '0%'}} size='xl' radius={0} color='grey'>
        На главную
      </Button>
      <Outlet/>
    </>
  )

}

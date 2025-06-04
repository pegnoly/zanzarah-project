import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { fetchLocationEntriesOptions, fetchLocationsOptions, fetchSelectableWizformsOptions, Location, LocationFullModel, LocationWizformEntry, SelectableWizform } from '../../utils/queries/map';
import LocationsGrid from '../../components/map/locationGrid';
import { fetchElementsOptions, WizformElement } from '../../utils/queries/elements';
import { AuthProps, processAuth, RegistrationState, UserPermissionType } from '../../utils/auth/utils';
import LocationFocused from '../../components/map/locationFocused';
import { useCommonStore } from '../../stores/common';
import { Button } from '@mantine/core';

type LoaderData = {
  locations: Location[] | undefined,
  elements: WizformElement [] | undefined,
  focused: LocationWizformEntry [] | undefined,
  auth: AuthProps | undefined,
  selectableWizforms: SelectableWizform [] | undefined
}

export const Route = createFileRoute('/map/$bookId/section/$id')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): {focused: string | undefined} => {
    return {
      focused: search["focused"] as string
    }
  },
  loaderDeps: ({search: {focused}}) => ({focused}),
  loader: async({params, context, deps: {focused}}): Promise<LoaderData | undefined> => {
    let loaderData: LoaderData = {
      auth: undefined,
      locations: undefined,
      elements: undefined,
      focused: undefined,
      selectableWizforms: undefined
    }
    const locationsData = await context.queryClient.ensureQueryData(fetchLocationsOptions({sectionId: params.id}));
    loaderData = {...loaderData, locations: locationsData};
    if (focused != undefined) {
      const elements = await context.queryClient.ensureQueryData(fetchElementsOptions({bookId: params.bookId}));
      const auth = await processAuth();
      const focusedData = await context.queryClient.ensureQueryData(fetchLocationEntriesOptions({locationId: focused}));
      loaderData = {...loaderData, auth: auth, elements: elements?.elements, focused: focusedData};
      if (auth.userState == RegistrationState.Confirmed && (auth.userPermission == UserPermissionType.Editor || auth.userPermission == UserPermissionType.Admin)) {
        const selectableWizforms = await context.queryClient.ensureQueryData(fetchSelectableWizformsOptions({bookId: params.bookId, locationId: focused}));
        loaderData = {...loaderData, selectableWizforms: selectableWizforms};
      } 
    }
    return loaderData;
  }
})

function RouteComponent() {
  const loaderData = Route.useLoaderData();
  // console.log("Focused: ", loaderData?.focused);
  const { focused } = Route.useSearch();
  const navigate = useNavigate();

  const setElements = useCommonStore(state => state.setElements);
  setElements(loaderData?.elements)

  return (
    <>
      <LocationsGrid locations={loaderData!.locations!}/>
      {
        focused != undefined ? 
        <LocationFocused 
          location={loaderData?.locations?.find(l => l.id == focused)!}
          auth={loaderData?.auth!} 
          selectableWizforms={loaderData?.selectableWizforms} 
          models={loaderData?.focused}
        /> :
        null
      }
      <Button
        onClick={() => navigate({to: '/'})} 
        style={{position: 'sticky', bottom: '95%', left: '0%'}} size='xl' radius={0} color='grey'>
        На главную
      </Button>
    </>
  )

}

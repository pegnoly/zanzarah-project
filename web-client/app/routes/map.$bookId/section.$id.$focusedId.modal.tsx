import LocationFocused from '@/components/map/locationFocused'
import { useCommonStore } from '@/stores/common'
import useMapStore from '@/stores/map'
import { AuthProps, processAuth, RegistrationState, UserPermissionType } from '@/utils/auth/utils'
import { fetchElementsOptions, WizformElement } from '@/utils/queries/elements'
import { fetchLocationEntriesOptions } from '@/utils/queries/map/locationEntriesQuery'
import { fetchSelectableWizformsOptions } from '@/utils/queries/map/selectableWizformsQuery'
import { LocationWizformEntry, SelectableWizform } from '@/utils/queries/map/types'
import { createFileRoute } from '@tanstack/react-router'
import { useShallow } from 'zustand/shallow'

type LoaderData = {
  elements: WizformElement [] | undefined,
  entries: LocationWizformEntry [] | undefined,
  auth: AuthProps | undefined,
  selectables: SelectableWizform [] | undefined
}

export const Route = createFileRoute(
  '/map/$bookId/section/$id/$focusedId/modal',
)({
  component: RouteComponent,
  loader: async({params, context}): Promise<LoaderData> => {
    let loaderData: LoaderData = {
      elements: undefined,
      entries: undefined,
      auth: undefined,
      selectables: undefined
    };
    const elements = await context.queryClient.ensureQueryData(fetchElementsOptions({bookId: params.bookId}));
    const auth = await processAuth();
    const entriesData = await context.queryClient.ensureQueryData(fetchLocationEntriesOptions({locationId: params.focusedId}));
    loaderData = {...loaderData, auth: auth, elements: elements, entries: entriesData};
    if (auth.userState == RegistrationState.Confirmed && (auth.userPermission == UserPermissionType.Editor || auth.userPermission == UserPermissionType.Admin)) {
      const selectableWizforms = await context.queryClient.ensureQueryData(fetchSelectableWizformsOptions({bookId: params.bookId, locationId: params.focusedId}));
      loaderData = {...loaderData, selectables: selectableWizforms};
    }
    return loaderData;
  }
})

function RouteComponent() {
  const data = Route.useLoaderData();
  const params = Route.useParams();

  const locations = useMapStore(useShallow((state) => state.locations));
  const setElements = useCommonStore(useShallow((state) => state.setElements));
  setElements(data.elements);

  return (
    <LocationFocused 
      bookId={params.bookId}
      sectionId={params.id}
      auth={data.auth!} 
      entries={data.entries!} 
      selectables={data.selectables!} 
      location={locations?.find(l => l.id == params.focusedId)!}
    />
  )
}

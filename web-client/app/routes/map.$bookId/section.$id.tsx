import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import LocationsGrid from '../../components/map/locationGrid';
import { Button } from '@mantine/core';
import { useShallow } from 'zustand/shallow';
import useMapStore from '@/stores/map';
import { Location } from '@/utils/queries/map/types';
import { fetchLocationsOptions } from '@/utils/queries/map/locationsQuery';

type LoaderData = {
  locations: Location[] | undefined
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
  const setLocations = useMapStore(useShallow((state) =>state.setLocations));

  setLocations(loaderData?.locations!);

  return (
    <>
      <LocationsGrid locations={loaderData!.locations!} bookId={params.bookId} sectionId={params.id}/>
      <Button
        onClick={() => navigate({to: '/'})} 
        style={{position: 'sticky', bottom: '95%', left: '0%'}} size='xl' radius={0} color='grey'>
        На главную
      </Button>
      <Outlet/>
    </>
  )

}

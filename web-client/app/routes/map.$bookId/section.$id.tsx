import { createFileRoute } from '@tanstack/react-router'
import { fetchLocationsOptions, Location } from '../../utils/queries/map';
import LocationsGrid from '../../components/map/locationGrid';

export const Route = createFileRoute('/map/$bookId/section/$id')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): {focused: string | undefined} => {
    return {
      focused: search["focused"] as string
    }
  },
  loaderDeps: ({search: {focused}}) => ({focused}),
  loader: async({params, context, deps: {focused}}): Promise<Location[] | undefined> => {
    const data = await context.queryClient.ensureQueryData(fetchLocationsOptions({sectionId: params.id}));
    return data;
  }
})

function RouteComponent() {
  const loaderData = Route.useLoaderData();

  return (
    <>
      <LocationsGrid locations={loaderData!}/>
    </>
  )

}

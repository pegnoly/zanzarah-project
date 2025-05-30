import { createFileRoute } from '@tanstack/react-router'
import { fetchSectionsOptions, LocationSection } from '../../utils/queries/map'
import SectionsGrid from '../../components/map/sectionsGrid';

export const Route = createFileRoute('/map/$bookId/')({
  component: RouteComponent,
  loader: async({params, context}): Promise<LocationSection[] | undefined> => {
    const data = await context.queryClient.ensureQueryData(fetchSectionsOptions({bookId: params.bookId}));
    return data;
  }
})

function RouteComponent() {
  const loaderData = Route.useLoaderData();
  const params = Route.useParams();

  return (
    <>
      <SectionsGrid bookId={params.bookId} sections={loaderData!}/>
    </>
  )
}

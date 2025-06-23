import { createFileRoute, useNavigate } from '@tanstack/react-router'
import SectionsGrid from '../../components/map/sectionsGrid';
import { Button } from '@mantine/core';
import { LocationSection } from '@/utils/queries/map/types';
import { fetchSectionsOptions } from '@/utils/queries/map/sectionsQuery';

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
  const navigate = useNavigate()

  return (
    <>
      <SectionsGrid bookId={params.bookId} sections={loaderData!}/>
      <Button
        onClick={() => navigate({to: '/'})} 
        style={{position: 'sticky', bottom: '95%', left: '0%'}} size='xl' radius={0} color='grey'>
        На главную
      </Button>
    </>
  )
}

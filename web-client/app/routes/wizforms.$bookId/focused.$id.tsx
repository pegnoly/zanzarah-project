import { Modal, Text } from '@mantine/core'
import { createFileRoute, useLoaderData, useNavigate } from '@tanstack/react-router'
import { fetchWizformOptions } from '../../utils/queries/wizform';

export const Route = createFileRoute('/wizforms/$bookId/focused/$id')({
  component: RouteComponent,
  loader: async({context, params}) => {
    console.log("Params: ", params);
    const data = await context.queryClient.ensureQueryData(fetchWizformOptions(params.id));
    return data;
  }
})

function RouteComponent() {
  const navigate = useNavigate();
  const data = Route.useLoaderData();
  const params = Route.useParams();

  return <Modal opened={true} onClose={() => {navigate({to: '/wizforms/$bookId', params: {bookId: params.bookId}})}}>
    <Text size='lg'>{data?.wizform.name}</Text>
    <Text size='md'>{`Здоровье: ${data?.wizform.hitpoints}`}</Text>
  </Modal>
}
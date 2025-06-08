import WizformFocused from '@/components/wizforms/focused'
import { fetchWizformCompleteOptions, WizformCompleteQueryResult } from '@/utils/queries/wizforms/wizformCompleteQuery'
import { createFileRoute } from '@tanstack/react-router'

type SuspensedData = {
  model: Promise<WizformCompleteQueryResult | null | undefined>
}

export const Route = createFileRoute('/wizforms/$bookId/$focusedId/modal')({
  component: RouteComponent,
  loader: async({params, context}): Promise<SuspensedData> => {
    const data = context.queryClient.ensureQueryData(fetchWizformCompleteOptions({collectionId: context.currentCollection!, wizformId: params.focusedId}));
    return {
      model: data
    }
  }
})

function RouteComponent() {
  const { model } = Route.useLoaderData();
  const context = Route.useRouteContext();
  const params = Route.useParams()

  return (
    <WizformFocused 
      auth={context.auth!}
      bookId={params.bookId}
      collectionId={context.currentCollection!}
      model={model}
    />
  )
}

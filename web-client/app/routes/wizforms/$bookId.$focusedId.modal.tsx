import WizformFocused from '@/components/wizforms/focused'
import useWizformsStore from '@/stores/wizforms'
import { AuthProps, processAuth, RegistrationState } from '@/utils/auth/utils'
import { fetchActiveCollectionOptions } from '@/utils/queries/collections/activeCollectionQuery'
import { WizformFull, WizformHabitatModel } from '@/utils/queries/wizforms/types'
import { fetchWizformHabitatsOptions } from '@/utils/queries/wizforms/wizformHabitatsQuery'
import { fetchWizformOptions } from '@/utils/queries/wizforms/wizformQuery'
import { createFileRoute } from '@tanstack/react-router'
import { useShallow } from 'zustand/shallow'

type LoaderData = {
  model: WizformFull | undefined,
  habitats: WizformHabitatModel [] | undefined,
  currentCollection: string | null,
  auth: AuthProps | undefined
}

export const Route = createFileRoute('/wizforms/$bookId/$focusedId/modal')({
  component: RouteComponent,
  loader: async({params, context}): Promise<LoaderData> => {
    let loaderData: LoaderData = {
      habitats: undefined,
      model: undefined,
      auth: await processAuth(),
      currentCollection: null
    }
    if (loaderData.auth!.userState == RegistrationState.Confirmed) {
      const activeCollection = await context.queryClient.ensureQueryData(fetchActiveCollectionOptions({bookId: params.bookId, userId: loaderData.auth!.userId!}));
      loaderData = {...loaderData, currentCollection: activeCollection!}
    }
    const wizformData = await context.queryClient.ensureQueryData(fetchWizformOptions({id: params.focusedId, collectionId: loaderData.currentCollection}));
    const habitatsData = await context.queryClient.ensureQueryData(fetchWizformHabitatsOptions({wizformId: params.focusedId}));
    loaderData = {...loaderData, model: wizformData, habitats: habitatsData};
    return loaderData;
  }
})

function RouteComponent() {
  const loaderData = Route.useLoaderData();
  const params = Route.useParams()

  const [focusedWizform, setFocusedWizform] = useWizformsStore(useShallow((state) => [state.focusedWizform, state.setFocusedWizform]));
  if (focusedWizform == undefined || (loaderData.model != undefined && (focusedWizform.id != loaderData.model.id))) {
    setFocusedWizform(loaderData.model!);
  }

  return (
    <WizformFocused 
      auth={loaderData.auth!}
      bookId={params.bookId}
      collectionId={loaderData.currentCollection}
      habitats={loaderData.habitats!}
      // model={loaderData.model!}
    />
  )
}

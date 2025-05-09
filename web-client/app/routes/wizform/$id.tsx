import { createFileRoute } from '@tanstack/react-router'
import { fetchWizformNameOptions } from '../../utils/queries/wizformName'

export const Route = createFileRoute('/wizform/$id')({
    component: WizformFocused,
    loader: async ({params, context}) => {
        const data = await context.queryClient.ensureQueryData(fetchWizformNameOptions(params.id))
        return data
    }
})

function WizformFocused() {
    const data = Route.useLoaderData()
    return <>
        <h1>{`Wizform ${data?.wizform.name}`}</h1>
    </>
}

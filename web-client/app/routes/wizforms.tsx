import { createFileRoute } from '@tanstack/react-router'
import { WizformElementType } from '../graphql/graphql'
import { fetchWizformsOptions } from '../utils/queries/wizforms'
import { Button } from '@mantine/core';

export const Route = createFileRoute('/wizforms')({
    component: RouteComponent,
    loader: async ({context}) => {
        const data = await context.queryClient.ensureQueryData(fetchWizformsOptions({
            bookId: '5a5247c2-273b-41e9-8224-491e02f77d8d',
            enabled: true,
            elementFilter: WizformElementType.Chaos,
            nameFilter: "Ха"
        }));
        return data;
    }
})

function RouteComponent() {
    const wizformsData = Route.useLoaderData();
    return <div>
        <Button>Test button</Button>
        <ol>
            {wizformsData?.wizforms.map((w, i) => (
                <li key={i}>
                    <div style={{display: 'flex', flexDirection: 'row', gap: 20}}>
                        <img width={40} height={40} src={`data:image/bmp;base64,${w.icon64}`}/>
                        {w.name}
                    </div>
                </li>
            ))}
        </ol>
    </div>
}

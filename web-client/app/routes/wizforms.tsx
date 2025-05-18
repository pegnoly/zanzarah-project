import { createFileRoute, createRoute, Link, Outlet } from '@tanstack/react-router'
import { WizformElementType, WizformModel } from '../graphql/graphql'
import { fetchWizformsOptions, WizformsModel } from '../utils/queries/wizforms'
import { Button, Card, Image, Modal, SimpleGrid, Text } from '@mantine/core';

export const Route = createFileRoute('/wizforms')({
    component: RouteComponent,
    loader: async ({context}) => {
        const queryData = context.queryClient.getQueryData<WizformsModel>(['wizforms']);
        //console.log("Query data: ", queryData);
        if (queryData != undefined) {
            return queryData;
        } else {
            const data = await context.queryClient.ensureQueryData(fetchWizformsOptions({
                bookId: '5a5247c2-273b-41e9-8224-491e02f77d8d',
                enabled: true,
                elementFilter: WizformElementType.Nature,
                nameFilter: undefined
            }));
            return data;
        }
    }
})

function RouteComponent() {
    const wizformsData = Route.useLoaderData();
    return <div>
        <SimpleGrid
            style={{padding: '3%'}}
            cols={{ base: 1, sm: 2, md: 3, lg: 4 }} 
        >{wizformsData?.wizforms.map((w, i) => (
            <Link to="/wizforms/focused/$id" params={{id: w.id}} style={{textDecoration: 'none'}}>
                <Card key={w.id} shadow='sm' padding='lg' withBorder style={{height: '100%'}}>
                    <Card.Section w={40} h={40} style={{position: 'absolute', top: '40%', right: '8%'}}>
                        <Image width={40} height={40} src={`data:image/bmp;base64,${w.icon64}`}></Image>
                    </Card.Section>
                    {/* <Card.Section w={60} h={60} style={{position: 'absolute', top: '72%', right: '3%'}}>
                        <Text size='sm' style={{fontWeight: 'bold', fontSize: 12}}>{`№ ${w.number}`}</Text>
                    </Card.Section> */}
                    <div style={{width: '80%'}}>
                        <Text size='md' lineClamp={1}>{w.name}</Text>
                    </div>
                </Card>
            </Link>
            // <li key={i}>
            //     <div style={{display: 'flex', flexDirection: 'row', gap: 20}}>
            //         <img width={40} height={40} src={`data:image/bmp;base64,${w.icon64}`}/>
            //         {w.name}
            //     </div>
            // </li>
        ))}</SimpleGrid>
        <Outlet/>
    </div>
}

function WizformsList(params: {
    models: WizformModel[]
}) {

}

function WizformsFilter() {

}

// export const focusedRoute = createRoute({
//     getParentRoute: () => Route,
//     path: '$id',
//     component: WizformFocused,
//     loader: async ({params, context}) => {
//         const data = await context.queryClient.ensureQueryData(fetchWizformNameOptions(params.id))
//         return data
//     }
// })

// function WizformFocused() {
//     const data = Route.useLoaderData()
//     return <Modal 
//         opened={true}
//         onClose={() => {}}
//     >
//         <h1><data value=""></data></h1>
//     </Modal>
// }

import { createFileRoute, createRoute, Link, Outlet } from '@tanstack/react-router'
import { WizformElementType, WizformModel } from '../graphql/graphql'
import { fetchWizformsOptions, fetchWizformsOptionsClient, WizformSimpleModel, WizformsModel } from '../utils/queries/wizforms'
import { Button, Card, Dialog, Image, Modal, Select, SimpleGrid, Stack, Text, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { useCommonStore } from '../stores/common';
import { useShallow } from 'zustand/shallow'

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
                elementFilter: WizformElementType.None,
                nameFilter: undefined
            }));
            return data;
        }
    }
})

function RouteComponent() {
    const wizformsData = Route.useLoaderData();
    const context = Route.useRouteContext();

    const [wizforms, setWizforms] = useState<WizformSimpleModel[] | undefined>(wizformsData?.wizforms);
    const [elementFilter, nameFilter] = useCommonStore(useShallow((state) => [state.currentElementFilter, state.currentNameFilter]));

    async function onFiltersChanged() {
      //console.log("Filters updated with: ", elementFilter, ", ", nameFilter);
      context.queryClient.fetchQuery(fetchWizformsOptionsClient({
        bookId: "5a5247c2-273b-41e9-8224-491e02f77d8d",
        enabled: true,
        elementFilter: elementFilter,
        nameFilter: nameFilter
      }))
      .then((data) => {
        //console.log("Wizforms data: ", data);
        setWizforms(data?.wizforms)
      });
    }

    return <div>
      <WizformsList models={wizforms}/>  
      <WizformsFilter filtersUpdatedCallback={onFiltersChanged}/>
      <Outlet/>
    </div>
}

function WizformsList(params: {
    models: WizformSimpleModel[] | undefined
}) {
  console.log("Rerendered with: ", params.models);
  const wizformsDisabled = useCommonStore(state => state.wizformsDisabled);
  return <SimpleGrid
        style={{padding: '3%'}}
        cols={{ base: 1, sm: 2, md: 3, lg: 4 }} 
    >{params.models!.map((w, _i) => (
      <Link key={w.id} disabled={wizformsDisabled} to="/wizforms/focused/$id" params={{id: w.id}} style={{textDecoration: 'none'}}>
          <Card shadow='sm' padding='lg' withBorder style={{height: '100%'}}>
              <Card.Section w={40} h={40} style={{position: 'absolute', top: '50%', right: '8%'}}>
                  <Image width={40} height={40} src={`data:image/bmp;base64,${w.icon64}`}></Image>
              </Card.Section>
              <div style={{width: '80%'}}>
                  <Text size='md' lineClamp={1}>{w.name}</Text>
              </div>
          </Card>
      </Link>
    ))}</SimpleGrid>
}

function WizformsFilter(params: {
  filtersUpdatedCallback: () => void
}) {
  const [opened, {open, close}] = useDisclosure(false);
  const [wizformsDisabled, setWizformsDisabled, elementFilter, nameFilter, setElementFilter, setNameFilter] = useCommonStore(useShallow((state) => [
    state.wizformsDisabled, 
    state.setWizformsDisabled,
    state.currentElementFilter,
    state.currentNameFilter,
    state.setElementFilter,
    state.setNameFilter
  ]));

  return <>
    <Button disabled={wizformsDisabled} onClick={() => {
        setWizformsDisabled(true);
        open()
      }}
      size='lg' radius='xs' style={{position: 'sticky', bottom: '95%', left: '1%'}}>
      Фильтры
    </Button>
    <Dialog
      opened={opened}
      withBorder
      withCloseButton
      size='lg'
      radius='xs'
    >
      <Stack>
        <Select
          value={elementFilter}
          onChange={(value) => setElementFilter(value as WizformElementType)}
          placeholder='Сортировать фей по стихии'
          data={[
            {label: 'Хаос', value: WizformElementType.Chaos},
            {label: 'Воздух', value: WizformElementType.Air},
            {label: 'Природа', value: WizformElementType.Nature},
            {label: 'Вода', value: WizformElementType.Water},
            {label: 'Тьма', value: WizformElementType.Dark},
            {label: 'Свет', value: WizformElementType.Light}
          ]}
        />
        <TextInput
          value={nameFilter} 
          onChange={(event) => setNameFilter(event.currentTarget.value)}
          placeholder='Сортировать фей по имени'/>
        <Button onClick={() => {
          setWizformsDisabled(false);
          close();
          params.filtersUpdatedCallback();
        }}>Применить</Button>
      </Stack>
    </Dialog>
  </>
}
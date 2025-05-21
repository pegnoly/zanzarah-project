import { createFileRoute, createRoute, Link, Outlet, useNavigate } from '@tanstack/react-router'
import { WizformElementType, WizformModel } from '../graphql/graphql'
import { fetchWizformsOptions, fetchWizformsOptionsClient, WizformSimpleModel, WizformsModel } from '../utils/queries/wizforms'
import { Button, ButtonGroup, Card, Dialog, filterProps, Image, Modal, Select, SimpleGrid, Stack, Text, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { useCommonStore } from '../stores/common';
import { useShallow } from 'zustand/shallow'
import ElementsSelector from '../components/utils/elementsSelector';
import { createServerFn } from '@tanstack/react-start';
import { getCookie, setCookie } from '@tanstack/react-start/server';
import { ElementsModel, fetchElementsOptions } from '../utils/queries/elements';
import { useSuspenseQueries } from '@tanstack/react-query';

const setLastNameFilterCookie = createServerFn({method: 'POST'})
  .validator((filter: string) => filter)
  .handler(async({data}) => {
    setCookie('zanzarah-project-name-filter', data, {maxAge: 86400});
  })

const getLastNameFilterCookie = createServerFn({method: 'GET'})
  .handler(async() => {
    const cookie = getCookie('zanzarah-project-name-filter');
    return cookie;
  })

const setLastElementFilterCookie = createServerFn({method: 'POST'})
  .validator((filter: WizformElementType) => filter)
  .handler(async({data}) => {
    setCookie('zanzarah-project-element-filter', data, {maxAge: 86400});
  })

const getLastElementFilterCookie = createServerFn({method: 'GET'})
  .handler(async() => {
    const cookie = getCookie('zanzarah-project-element-filter');
    return cookie;
  })

export const Route = createFileRoute('/wizforms/$bookId')({
    component: RouteComponent,
    // validateSearch: (search: Record<string, unknown>): {bookId: string} => {
    //   return {
    //     bookId: search.bookId as string
    //   }
    // },
    // loaderDeps: ({search: {bookId}}) => ({bookId}),
    loader: async ({context, params}) => {
      const nameFilterCookie = await getLastNameFilterCookie();
      const elementFilterCookie = await getLastElementFilterCookie();
      await context.queryClient.ensureQueryData(fetchWizformsOptions({
        bookId: params.bookId,
        enabled: true,
        elementFilter: elementFilterCookie == undefined ? WizformElementType.Nature : elementFilterCookie as WizformElementType,
        nameFilter: nameFilterCookie
      }));
      await context.queryClient.ensureQueryData(fetchElementsOptions({bookId: params.bookId}));
      return {
        nameFilter: nameFilterCookie,
        elementFilter: elementFilterCookie == undefined ? WizformElementType.Nature : elementFilterCookie as WizformElementType
      }
    }
});

function RouteComponent() {
    const loaderData = Route.useLoaderData();
    const params = Route.useParams();
    const context = Route.useRouteContext();

    const queriesData = useSuspenseQueries({queries: [
      fetchWizformsOptions({bookId: params.bookId, enabled: true, elementFilter: loaderData.elementFilter, nameFilter: loaderData.nameFilter}),
      fetchElementsOptions({bookId: params.bookId})
    ]});

    const [wizforms, setWizforms] = useState<WizformSimpleModel[] | undefined>(queriesData?.[0].data?.wizforms);
    const setElements = useCommonStore(state => state.setElements);

    setElements(queriesData[1].data?.elements);
    // setNameFilter(loaderData.nameFilter);
    // setElementFilter(loaderData.elementFilter);

    async function onFiltersChanged(element: WizformElementType, name: string) {
      //console.log("Filters updated with: ", elementFilter, ", ", nameFilter);
      context.queryClient.fetchQuery(fetchWizformsOptionsClient({
        bookId: params.bookId,
        enabled: true,
        elementFilter: element,
        nameFilter: name
      }))
      .then((data) => {
        //console.log("Wizforms data: ", data);
        setWizforms(data?.wizforms)
      });
    }

    return <div>
      <WizformsList 
        bookId={params.bookId}
        models={wizforms}/>  
      <WizformsFilter 
        currentElementFilter={loaderData.elementFilter} 
        currentNameFilter={loaderData.nameFilter} 
        filtersUpdatedCallback={onFiltersChanged}
      />
      <Outlet/>
    </div>
}

function WizformsList(params: {
  bookId: string,
  models: WizformSimpleModel[] | undefined
}) {
  const wizformsDisabled = useCommonStore(state => state.wizformsDisabled);
  return <SimpleGrid
        style={{padding: '3%'}}
        cols={{ base: 1, sm: 2, md: 3, lg: 4 }} 
    >{params.models!.map((w, _i) => (
      <Link key={w.id} disabled={wizformsDisabled} to={`/wizforms/$bookId/focused/$id`} params={{id: w.id, bookId: params.bookId}} style={{textDecoration: 'none'}}>
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
  currentElementFilter: WizformElementType,
  currentNameFilter: string | undefined,
  filtersUpdatedCallback: (element: WizformElementType, name: string | undefined) => void
}) {
  const navigate = useNavigate();
  const [opened, {open, close}] = useDisclosure(false);
  const [elementFilter, setElementFilter] = useState<WizformElementType>(params.currentElementFilter);
  const [nameFilter, setNameFilter] = useState<string | undefined>(params.currentNameFilter);

  const [wizformsDisabled, setWizformsDisabled] = useCommonStore(useShallow((state) => [
    state.wizformsDisabled, 
    state.setWizformsDisabled,
  ]));

  return <>
    <ButtonGroup flex={1} style={{position: 'sticky', bottom: '95%', left: '1%'}}>
      <Button disabled={wizformsDisabled} onClick={() => {
          setWizformsDisabled(true);
          open()
        }}
        size='lg' radius='xs' color='teal'>
        Фильтры
      </Button>
      <Button color='grey' disabled={wizformsDisabled} onClick={() => navigate({to: "/"})} size='lg' radius='xs'>На главную</Button>
    </ButtonGroup>
    <Dialog
      opened={opened}
      withBorder
      withCloseButton
      size='lg'
      radius='xs'
      onClose={() => {
        setWizformsDisabled(false);
        close();
      }}
    >
      <Stack>
        <ElementsSelector 
          label='Сортировать фей по стихии'
          disabled={false}
          current={elementFilter}
          selectedCallback={(value) => {
            setLastElementFilterCookie({data: value});
            setElementFilter(value)
          }}
        />
        <TextInput
          value={nameFilter} 
          onChange={(event) => {
            setLastNameFilterCookie({data:event.currentTarget.value});
            setNameFilter(event.currentTarget.value);
          }}
          placeholder='Сортировать фей по имени'/>
        <Button onClick={() => {
          setWizformsDisabled(false);
          close();
          params.filtersUpdatedCallback(elementFilter, nameFilter);
        }}>Применить</Button>
      </Stack>
    </Dialog>
  </>
}
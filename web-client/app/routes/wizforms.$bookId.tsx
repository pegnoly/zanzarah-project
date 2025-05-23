import { createFileRoute, Link, Outlet, useNavigate, useRouteContext } from '@tanstack/react-router'
import { WizformElementType } from '../graphql/graphql'
import { fetchWizformsOptions, fetchWizformsOptionsClient, WizformSimpleModel, WizformsModel} from '../utils/queries/wizforms'
import { Button, ButtonGroup, Card, Dialog, Image, SegmentedControl, SimpleGrid, Stack, Text, TextInput } from '@mantine/core';
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

    loader: async ({context, params}) : Promise<{
      nameFilter: string | undefined, 
      elementFilter: WizformElementType,
      wizforms: WizformsModel | undefined,
      elements: ElementsModel | undefined
    }> => {
      const nameFilterCookie = await getLastNameFilterCookie();
      const elementFilterCookie = await getLastElementFilterCookie();
      const wizformsData =  await context.queryClient.ensureQueryData(fetchWizformsOptions({
        bookId: params.bookId,
        enabled: true,
        elementFilter: elementFilterCookie == undefined ? WizformElementType.Nature : elementFilterCookie as WizformElementType,
        nameFilter: nameFilterCookie,
        collection: "48702911-4bfa-47a5-a3ae-e73db300be15"
      }));
      const elementsData = await context.queryClient.ensureQueryData(fetchElementsOptions({bookId: params.bookId}));
      return {
        nameFilter: nameFilterCookie,
        elementFilter: elementFilterCookie == undefined ? WizformElementType.Nature : elementFilterCookie as WizformElementType,
        wizforms: wizformsData,
        elements: elementsData
      }
    }
});

function RouteComponent() {
    const loaderData = Route.useLoaderData();
    const params = Route.useParams();
    const setElements = useCommonStore(state => state.setElements);

    setElements(loaderData.elements?.elements);

    return <div>
      <WizformsList 
        wizforms={loaderData.wizforms?.wizforms}
        nameFilter={loaderData.nameFilter}
        elementFilter={loaderData.elementFilter}
        bookId={params.bookId}
      />
      <Outlet/>
    </div>
}

function WizformsList(params: {
  wizforms: WizformSimpleModel[] | undefined,
  bookId: string,
  nameFilter: string | undefined,
  elementFilter: WizformElementType
}) {
  const [wizforms, setWizforms, wizformsDisabled] = useCommonStore(useShallow((state) => [state.wizforms, state.setWizforms, state.wizformsDisabled]));
  const context = Route.useRouteContext();
  
  useEffect(() => {
    if (wizforms?.length == 0) {
      setWizforms(params.wizforms);
    }
  }, [wizforms])

  async function onFiltersChanged(element: WizformElementType, name: string) {
    context.queryClient.fetchQuery(fetchWizformsOptionsClient({
      bookId: params.bookId,
      enabled: true,
      elementFilter: element,
      nameFilter: name,
      collection: "48702911-4bfa-47a5-a3ae-e73db300be15"
    }))
    .then((data) => {
        setWizforms(data?.wizforms);
    });
  }

  return <>
    <SimpleGrid
          style={{padding: '3%'}}
          cols={{ base: 1, sm: 2, md: 3, lg: 4 }} 
      >{wizforms!.map((w, _i) => (
        <Link key={w.id} disabled={wizformsDisabled} to={`/wizforms/$bookId/focused/$id`} params={{id: w.id, bookId: params.bookId}} style={{textDecoration: 'none'}}>
            <Card shadow='sm' padding='lg' withBorder style={{height: '100%', backgroundColor: w.inCollectionId ? "gold" : "white"}}>
                <Card.Section w={40} h={40} style={{position: 'absolute', top: '50%', right: '8%'}}>
                    <Image width={40} height={40} src={`data:image/bmp;base64,${w.icon64}`}></Image>
                </Card.Section>
                <div style={{width: '80%'}}>
                    <Text size='md' lineClamp={1}>{w.name}</Text>
                </div>
            </Card>
        </Link>
      ))}</SimpleGrid>
      <WizformsFilter currentNameFilter={params.nameFilter} currentElementFilter={params.elementFilter} filtersUpdatedCallback={onFiltersChanged}/>
  </>

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
          placeholder='Сортировать фей по имени'
        /> 
          {/* <SegmentedControl
            size='sm'
            value={collectionState}
            fullWidth
            orientation='vertical'
            color='gold'
            // style={{display: 'contents'}}
            onChange={(value) => setCollectionState(value as CollectionState)}
            data={[
              {value: CollectionState.None, label: '1'},
              {value: CollectionState.OnlyCollectionItems, label: "2"},
              {value: CollectionState.OnlyNonCollectionItems, label: "3"}
            ]}
          /> */}
        <Button onClick={() => {
          setWizformsDisabled(false);
          close();
          params.filtersUpdatedCallback(elementFilter, nameFilter);
        }}>Применить</Button>
      </Stack>
    </Dialog>
  </>
}
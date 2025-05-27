import { createFileRoute, Link, Outlet, useNavigate, useRouteContext } from '@tanstack/react-router'
import { WizformElementType } from '../graphql/graphql'
import { fetchWizforms, fetchWizformsOptions, fetchWizformsOptionsClient, WizformSimpleModel, WizformsModel} from '../utils/queries/wizforms'
import { Badge, Button, ButtonGroup, Card, Dialog, Group, Image, Modal, SegmentedControl, SimpleGrid, Stack, Text, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { useCommonStore } from '../stores/common';
import { useShallow } from 'zustand/shallow'
import ElementsSelector from '../components/utils/elementsSelector';
import { createServerFn } from '@tanstack/react-start';
import { getCookie, setCookie } from '@tanstack/react-start/server';
import { ElementsModel, fetchElementsOptions } from '../utils/queries/elements';
import { AuthProps, processAuth, UserPermissionType } from '../utils/auth/utils';
import { addCollectionItemMutation, AddCollectionItemMutationResult, AddCollectionItemMutationVariables, fetchCollectionsOptions, getActiveCollection } from '../utils/queries/collections';
import { fetchWizformOptions, WizformFull } from '../utils/queries/wizform';
import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import request from 'graphql-request';
import { notifications } from '@mantine/notifications';
import { Carousel } from '@mantine/carousel';
import { ActiveMagicSlot } from '../components/magic/activeSlot';
import { PassiveMagicSlot } from '../components/magic/passiveSlot';

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

type LoaderData = {
  nameFilter: string | undefined,
  elementFilter: WizformElementType,
  // wizforms: WizformsModel | undefined,
  elements: ElementsModel | undefined,
  auth: AuthProps,
  currentCollection: string | null,
  focusedWizform: WizformFull | null
}

export const Route = createFileRoute('/wizforms/$bookId')({
    component: RouteComponent,
    validateSearch: (search: Record<string, unknown>): {element: WizformElementType | undefined, focused: string | undefined} => {
      return {
        element: search["element"] as WizformElementType,
        focused: search["focused"] as string
      }
    },
    loaderDeps: ({search: {focused}}) => ({focused}),
    loader: async ({context, params, deps: {focused}}) : Promise<LoaderData> => {
      var loaderData: LoaderData = {
        nameFilter: undefined,
        elementFilter: WizformElementType.Nature,
        elements: undefined,
        auth: await processAuth(),
        currentCollection: null,
        focusedWizform: null
      }
      const nameFilterCookie = await getLastNameFilterCookie();
      const elementFilterCookie = await getLastElementFilterCookie();
      loaderData = {...loaderData, nameFilter: nameFilterCookie, elementFilter: elementFilterCookie as WizformElementType};
      if (loaderData.auth.userId) {
        const activeCollection = await getActiveCollection({data: {bookId: params.bookId, userId: loaderData.auth.userId}});
        loaderData = {...loaderData, currentCollection: activeCollection!}
      }
      const elementsData = await context.queryClient.ensureQueryData(fetchElementsOptions({bookId: params.bookId}));
      loaderData = {...loaderData, elements: elementsData};
      if (focused != undefined) {
        const focusedWizform = await context.queryClient.ensureQueryData(fetchWizformOptions(focused));
        loaderData = {...loaderData, focusedWizform: focusedWizform?.wizform!};
      }
      return loaderData;
    }
});

function RouteComponent() {
  const loaderData =  Route.useLoaderData();
  const params = Route.useParams();

  const [elementFilter, nameFilter, setElements] = useCommonStore(useShallow((state) => [
    state.currentElementFilter,
    state.currentNameFilter,
    state.setElements
  ]));

  setElements(loaderData.elements?.elements);

  const { data, status } = useSuspenseQuery(fetchWizformsOptions({
    bookId: params.bookId, 
    collection: loaderData.currentCollection, 
    elementFilter: elementFilter == undefined ? loaderData.elementFilter : elementFilter,
    enabled: true,
    nameFilter: nameFilter == undefined ? loaderData.nameFilter : elementFilter
  }));


  const [wizforms, setWizforms] = useState<WizformSimpleModel [] | undefined>(data?.wizforms);
  async function addWizformToCollection(wizformId: string, inCollectionId: string) {
    const updatedWizforms = wizforms?.map((w) => {
      if (w.id == wizformId) {
        w.inCollectionId = inCollectionId;
        return w;
      }
      return w;
    });
    setWizforms(updatedWizforms);
  }

  async function updatedWizformFilters(value: WizformSimpleModel[]) {
    setWizforms(value);
  }

  return <div>
    <WizformsList 
      currentCollection={loaderData.currentCollection}
      wizforms={wizforms}
      nameFilter={loaderData.nameFilter}
      elementFilter={loaderData.elementFilter}
      bookId={params.bookId}
      wizformsUpdateCallback={updatedWizformFilters}
    />
    {
      loaderData.focusedWizform != null ?
      <FocusedWizform 
        wizform={loaderData.focusedWizform} 
        bookId={params.bookId}
        currentCollection={loaderData.currentCollection}
        permission={loaderData.auth.userPermission!}
        wizformAddedToCollectionCallback={addWizformToCollection}
        elements={loaderData.elements!}
      /> :
      null
    }
  </div>
}

function WizformsList(params: {
  wizforms: WizformSimpleModel[] | undefined,
  bookId: string,
  nameFilter: string | undefined,
  elementFilter: WizformElementType,
  currentCollection: string | null,
  wizformsUpdateCallback: (value: WizformSimpleModel []) => void
}) {
  const wizformsDisabled = useCommonStore(state => state.wizformsDisabled);
  const context = Route.useRouteContext();  
  async function onFiltersChanged(element: WizformElementType, name: string) {
    context.queryClient.fetchQuery(fetchWizformsOptions({
      bookId: params.bookId,
      enabled: true,
      elementFilter: element,
      nameFilter: name,
      collection: params.currentCollection
    }))
    .then((data) => {
      params.wizformsUpdateCallback(data?.wizforms!);
    });
  }

  return <>
    <SimpleGrid
          style={{padding: '3%'}}
          cols={{ base: 1, sm: 2, md: 3, lg: 4 }} 
      >{params.wizforms!.map((w, _i) => (
        <Link 
          key={w.id} disabled={wizformsDisabled} 
          to="." 
          search={{focused: w.id}} 
          // params={{id: w.id, bookId: params.bookId}} 
          style={{textDecoration: 'none'}}
        >
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
      <WizformsFilter filtersUpdatedCallback={onFiltersChanged}/>
  </>

}

function WizformsFilter(params: {
  filtersUpdatedCallback: (element: WizformElementType, name: string | undefined) => void
}) {
  const navigate = useNavigate();
  const [opened, {open, close}] = useDisclosure(false);

  const [wizformsDisabled, setWizformsDisabled, nameFilter, elementFilter, setNameFilter, setElementFilter] = useCommonStore(useShallow((state) => [
    state.wizformsDisabled, 
    state.setWizformsDisabled,
    state.currentNameFilter,
    state.currentElementFilter,
    state.setNameFilter,
    state.setElementFilter
  ]));

  async function updateElementFilter(value: WizformElementType) {
    console.log("New element filter: ", value);
    await setLastElementFilterCookie({data: value});
    setElementFilter(value);
  }

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
          current={elementFilter!}
          selectedCallback={updateElementFilter}
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
          params.filtersUpdatedCallback(elementFilter!, nameFilter);
        }}>Применить</Button>
      </Stack>
    </Dialog>
  </>
}

function FocusedWizform(params: {
  bookId: string,
  wizform: WizformFull,
  currentCollection: string | null,
  permission: UserPermissionType,
  elements: ElementsModel,
  wizformAddedToCollectionCallback: (wizformId: string,  inCollectionId: string) => void
}) {
  const navigate = useNavigate();

  const addToCollectionMutation = useMutation({
    mutationFn: async(data: AddCollectionItemMutationVariables) => {
      const collectionItemId = await request<AddCollectionItemMutationResult | null, AddCollectionItemMutationVariables>(
          'https://zanzarah-project-api-lyaq.shuttle.app/',
          addCollectionItemMutation,
          {collectionId: data.collectionId, wizformId: data.wizformId}
      );
      if (collectionItemId != null) {
        params.wizformAddedToCollectionCallback(params.wizform.id, collectionItemId.addCollectionItem.createdId);
        notifications.show({
          message: "Фея добавлена в коллекцию",
          color: 'green',
          autoClose: 5000
        })
      }
    },
  })

  return (
    <Modal.Root opened={true} onClose={() => {navigate({to: '.', search: {}})}}>
      <Modal.Overlay/>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1%'}}>
              <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '2rem'}}>{params.wizform.name}</Text>
              <Text 
                style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.5rem'}}
              >{`${params.elements.elements?.find(e => e.element == params.wizform.element)?.name}, №${params.wizform.number}`}</Text>
            </div>
          </Modal.Title>
          <Modal.CloseButton/>
        </Modal.Header>
        <Modal.Body>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{ display: 'flex', flexDirection: 'column', alignSelf: 'start'}}>
              <Badge radius={0}>
                Базовые характеристики
              </Badge>
              <Group gap="xs">
                <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>{`Максимальное здоровье:`}</Text>
                <Text size="md" style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}>{params.wizform.hitpoints}</Text>
              </Group>
              <Group gap="xs">
                <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>{`Ловкость:`}</Text>
                <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}>{params.wizform.agility}</Text>
              </Group>
              <Group gap="xs">
                <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>{`Прыгучесть:`}</Text>
                <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}>{params.wizform.jumpAbility}</Text>
              </Group>
              <Group gap="xs">
                <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>{`Меткость:`}</Text>
                <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}>{params.wizform.precision}</Text>
              </Group>
              <Group gap="xs">
                <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>{`Скорость повышения уровня:`}</Text>
                <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}>{params.wizform.expModifier}</Text>
              </Group>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'end', paddingTop: '5%'}}>
              <Badge radius={0}>
                Превращения
              </Badge>
              <Group gap="sm">
                <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>{`Эволюция:`}</Text>
                <Text 
                  size='md' 
                  lineClamp={1}
                  style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}
                >{params.wizform.evolutionForm == -1 ? 'Отстуствует' : params.wizform.evolutionName}</Text>
              </Group>
              <Group gap="xs">
                <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>{`Уровень эволюции:`}</Text>
                <Text 
                  size='md' 
                  style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}
                >{params.wizform.evolutionLevel == -1 ? 'Отсутствует' : params.wizform.evolutionLevel!}</Text>
              </Group>
              <Group gap="sm">
                <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>{`Предыдущая форма:`}</Text>
                <Text 
                  size='md' 
                  lineClamp={1}
                  style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}
                >{params.wizform.previousForm == undefined ? 'Отсутствует' : params.wizform.previousFormName!}</Text>
              </Group>
            </div>
            <div style={{paddingTop: '5%'}}>
              <Badge radius={0}>
                Уровни магии
              </Badge>
              <Carousel withControls>{params.wizform.magics.types.map((magic, index) => (
                <Carousel.Slide key={index}>
                  <div>
                    <Text style={{fontFamily: 'Yanone Kaffeesatz', fontWeight: 'bolder', fontSize: '1.5rem'}}>{`Уровень ${magic.level}`}</Text>
                    <div style={{paddingLeft: '25%'}}>
                      <Stack gap={1}>
                        <Group>
                          <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>Первое активное</Text>
                          <ActiveMagicSlot slot={magic.firstActiveSlot}/>
                        </Group>
                        <Group>
                          <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>Первое пассивное</Text>
                          <PassiveMagicSlot slot={magic.firstPassiveSlot}/>
                        </Group>
                        <Group>
                          <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>Второе активное</Text>
                          <ActiveMagicSlot slot={magic.secondActiveSlot}/>
                        </Group>
                        <Group>
                          <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>Второе пассивное</Text>
                          <PassiveMagicSlot slot={magic.secondPassiveSlot}/>
                        </Group>
                      </Stack>
                    </div>
                  </div>
                </Carousel.Slide>
              ))}
              </Carousel>
            </div>
            {
              params.permission != UserPermissionType.UnregisteredUser ?
              <Group justify="flex-end" mt="md">
                <Button onClick={() => {
                  addToCollectionMutation.mutate({collectionId: params.currentCollection!, wizformId: params.wizform.id!})
                }}
                >Добавить в текущую коллекцию</Button>
              </Group> :
              null
            }
          </div>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  )
}
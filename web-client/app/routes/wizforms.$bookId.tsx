import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { WizformElementType } from '../graphql/graphql'
import { fetchWizformsOptions, WizformsModel} from '../utils/queries/wizforms'
import { Badge, Button, ButtonGroup, Card, Dialog, Group, Image, Modal, SimpleGrid, Stack, Text, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Ref, useState } from 'react';
import { useCommonStore } from '../stores/common';
import { useShallow } from 'zustand/shallow'
import ElementsSelector from '../components/utils/elementsSelector';
import { createServerFn } from '@tanstack/react-start';
import { getCookie, setCookie } from '@tanstack/react-start/server';
import { ElementsModel, fetchElementsOptions } from '../utils/queries/elements';
import { AuthProps, processAuth, UserPermissionType } from '../utils/auth/utils';
import { addCollectionItemMutation, AddCollectionItemMutationResult, AddCollectionItemMutationVariables, getActiveCollection, removeCollectionItem } from '../utils/queries/collections';
import { fetchWizformOptions, WizformFull } from '../utils/queries/wizform';
import { useMutation } from '@tanstack/react-query';
import request from 'graphql-request';
import { notifications } from '@mantine/notifications';
import { ActiveMagicSlot } from '../components/magic/activeSlot';
import { PassiveMagicSlot } from '../components/magic/passiveSlot';
import useWizformsStore from '../stores/wizforms';
import React from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

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
  wizforms: WizformsModel | undefined,
  elements: ElementsModel | undefined,
  auth: AuthProps,
  currentCollection: string | null,
  focusedWizform: WizformFull | null
}

export const Route = createFileRoute('/wizforms/$bookId')({
    component: RouteComponent,
    validateSearch: (search: Record<string, unknown>): {focused: string | undefined} => {
      return {
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
        wizforms: undefined,
        focusedWizform: null
      }
      const nameFilterCookie = await getLastNameFilterCookie();
      const elementFilterCookie = await getLastElementFilterCookie();
      loaderData = {...loaderData, 
        nameFilter: nameFilterCookie != undefined ? nameFilterCookie : loaderData.nameFilter, 
        elementFilter: elementFilterCookie != undefined ? elementFilterCookie as WizformElementType : loaderData.elementFilter
      };
      if (loaderData.auth.userId) {
        const activeCollection = await getActiveCollection({data: {bookId: params.bookId, userId: loaderData.auth.userId}});
        loaderData = {...loaderData, currentCollection: activeCollection!}
      }
      const elementsData = await context.queryClient.ensureQueryData(fetchElementsOptions({bookId: params.bookId}));
      const wizformsData = await context.queryClient.ensureQueryData(fetchWizformsOptions({
        bookId: params.bookId,
        collection: loaderData.currentCollection,
        elementFilter: loaderData.elementFilter,
        nameFilter: loaderData.nameFilter,
        enabled: true
      }));
      loaderData = {...loaderData, elements: elementsData, wizforms: wizformsData};
      if (focused != undefined) {
        const focusedWizform = await context.queryClient.ensureQueryData(fetchWizformOptions({id: focused, collectionId: loaderData.currentCollection}));
        loaderData = {...loaderData, focusedWizform: focusedWizform?.wizform!};
      }
      return loaderData;
    }
});

function RouteComponent() {
  const loaderData =  Route.useLoaderData();
  const params = Route.useParams();
  const context = Route.useRouteContext();

  const setElements = useCommonStore(state => state.setElements);
  const [wizforms, elementFilter, nameFilter, setWizforms, focusedWizform, setFocusedWizform] = useWizformsStore(useShallow((state) => [
    state.wizforms,
    state.elementFilter,
    state.nameFilter,
    state.setWizforms,
    state.focusedWizform,
    state.setFocusedWizform
  ]));

  setElements(loaderData.elements?.elements);
  if (wizforms == undefined) {
    setWizforms(loaderData.wizforms?.wizforms!)
  }
  if (focusedWizform == undefined || (loaderData.focusedWizform != undefined && (focusedWizform.id != loaderData.focusedWizform.id))) {
    setFocusedWizform(loaderData.focusedWizform!);
  }

  const [localElementFilter, setLocalElementFilter] = useState<WizformElementType>(elementFilter != undefined ? elementFilter : loaderData.elementFilter);
  const [localNameFilter, setLocalNameFilter] = useState<string | undefined>(nameFilter != undefined ? nameFilter : loaderData.nameFilter);

  async function addWizformToCollection(wizformId: string, inCollectionId: string) {
    const updatedWizforms = wizforms?.map((w) => {
      if (w.id == wizformId) {
        w.inCollectionId = "optimistically_updated";
        return w;
      }
      return w;
    });
    setWizforms(updatedWizforms!);
  }

  async function removeWizformFromCollection(wizformId: string) {
    const updatedWizforms = wizforms?.map((w) => {
      if (w.id == wizformId) {
        w.inCollectionId = null;
        return w;
      }
      return w;
    });
    setWizforms(updatedWizforms!);
  }

  async function onFiltersChanged() {
    context.queryClient.fetchQuery(fetchWizformsOptions({
      bookId: params.bookId,
      enabled: true,
      elementFilter: localElementFilter,
      nameFilter: localNameFilter,
      collection: loaderData.currentCollection
    }))
    .then((data) => {
      setWizforms(data?.wizforms!);
    });
  }

  return <div>
    <WizformsList/>
    <WizformsFilter 
      filtersUpdatedCallback={onFiltersChanged} 
      currentElementFilter={localElementFilter} 
      currentNameFilter={localNameFilter}
      elementFilterUpdateCallback={setLocalElementFilter}
      nameFilterUpdateCallback={setLocalNameFilter}
    />
    {
      loaderData.focusedWizform != null ?
      <FocusedWizform 
        wizform={loaderData.focusedWizform} 
        bookId={params.bookId}
        currentCollection={loaderData.currentCollection}
        permission={loaderData.auth.userPermission!}
        wizformAddedToCollectionCallback={addWizformToCollection}
        wizformRemovedFromCollectionCallback={removeWizformFromCollection}
        elements={loaderData.elements!}
      /> :
      null
    }
  </div>
}

function WizformsList() {
  const wizformsDisabled = useCommonStore(useShallow((state) => state.wizformsDisabled));
  const wizforms = useWizformsStore(useShallow((state) => state.wizforms));

  return <>
    {
      wizforms == undefined ?
      null :
      <SimpleGrid
          style={{padding: '3%'}}
          cols={{ base: 1, sm: 2, md: 3, lg: 4 }} 
        >{wizforms!.map((w, _i) => (
        <Link 
          key={w.id} disabled={wizformsDisabled} 
          to="." 
          search={{focused: w.id}} 
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
    }
  </>

}

function WizformsFilter(params: {
  currentElementFilter: WizformElementType,
  currentNameFilter: string | undefined,
  elementFilterUpdateCallback: (value: WizformElementType) => void,
  nameFilterUpdateCallback: (value: string | undefined) => void,
  filtersUpdatedCallback: () => void
}) {
  const navigate = useNavigate();
  const [opened, {open, close}] = useDisclosure(false);

  const [wizformsDisabled, setWizformsDisabled] = useCommonStore(useShallow((state) => [state.wizformsDisabled, state.setWizformsDisabled]));
  const [setElementFilter, setNameFilter] = useWizformsStore(useShallow((state) => [state.setElementFilter, state.setNameFilter]));

  async function updateElementFilter(value: WizformElementType) {
    await setLastElementFilterCookie({data: value});
    setElementFilter(value);
    params.elementFilterUpdateCallback(value);
  }

  async function updateNameFilter(value: string) {
    await setLastNameFilterCookie({data: value});
    setNameFilter(value);
    params.nameFilterUpdateCallback(value);
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
          current={params.currentElementFilter!}
          selectedCallback={updateElementFilter}
        />
        <TextInput
          value={params.currentNameFilter} 
          onChange={(event) => updateNameFilter(event.currentTarget.value)}
          label='Сортировать фей по имени'
          placeholder='Укажите фильтр(зависит от регистра)'
        /> 
        <Button onClick={() => {
          setWizformsDisabled(false);
          close();
          params.filtersUpdatedCallback();
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
  wizformAddedToCollectionCallback: (wizformId: string,  inCollectionId: string) => void,
  wizformRemovedFromCollectionCallback: (wizformId: string) => void
}) {
  const navigate = useNavigate();
  const [wizform, setWizform] = useWizformsStore(useShallow((state) => [state.focusedWizform, state.setFocusedWizform]));

  const addToCollectionMutation = useMutation({
    mutationFn: async(data: AddCollectionItemMutationVariables) => {
      const collectionItemId = await request<AddCollectionItemMutationResult | null, AddCollectionItemMutationVariables>(
          'https://zanzarah-project-api-lyaq.shuttle.app/',
          addCollectionItemMutation,
          {collectionId: data.collectionId, wizformId: data.wizformId}
      );
      if (collectionItemId != null) {
        setWizform({...wizform!, inCollectionId: collectionItemId.addCollectionItem.createdId})
        params.wizformAddedToCollectionCallback(wizform!.id, collectionItemId.addCollectionItem.createdId);
        notifications.show({
          message: "Фея добавлена в коллекцию",
          color: 'green',
          autoClose: 5000
        })
      }
    },
  });

  const removeFromCollectionMutation = useMutation({
    mutationFn: removeCollectionItem,
    onSuccess: (data) => {
      if (data) {
        setWizform({...wizform!, inCollectionId: null});
        params.wizformRemovedFromCollectionCallback(wizform!.id);
        notifications.show({
          message: "Фея удалена из коллекции",
          color: 'red',
          autoClose: 5000
        })
      }
    }
  })

  return (
    <Modal.Root opened={true} onClose={() => {navigate({to: '.', search: {}})}}>
      <Modal.Overlay/>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1%'}}>
              <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '2rem'}}>{wizform!.name}</Text>
              <Text 
                style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.5rem'}}
              >{`${params.elements.elements?.find(e => e.element == wizform!.element)?.name}, №${wizform!.number}`}</Text>
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
                <Text size="md" style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}>{wizform!.hitpoints}</Text>
              </Group>
              <Group gap="xs">
                <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>{`Ловкость:`}</Text>
                <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}>{wizform!.agility}</Text>
              </Group>
              <Group gap="xs">
                <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>{`Прыгучесть:`}</Text>
                <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}>{wizform!.jumpAbility}</Text>
              </Group>
              <Group gap="xs">
                <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>{`Меткость:`}</Text>
                <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}>{wizform!.precision}</Text>
              </Group>
              <Group gap="xs">
                <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>{`Скорость повышения уровня:`}</Text>
                <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}>{wizform!.expModifier}</Text>
              </Group>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'end', paddingTop: '5%'}}>
              <Badge radius={0}>
                Превращения
              </Badge>
              <div style={{display: 'flex', flexDirection: 'column', gap: '2%', alignItems: 'end'}}>
                <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>{`Эволюция:`}</Text>
                <Text 
                  size='md' 
                  lineClamp={1}
                  style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}
                >{wizform!.evolutionForm == -1 ? 'Отстуствует' : wizform!.evolutionName}</Text>
              </div>
              <Group gap="xs">
                <Text span size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>{`Уровень эволюции:`}</Text>
                <Text 
                  span
                  size='md' 
                  style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}
                >{wizform!.evolutionLevel == -1 ? 'Отсутствует' : wizform!.evolutionLevel!}</Text>
              </Group>
              <div style={{display: 'flex', flexDirection: 'column', gap: '2%', alignItems: 'end'}}>
                <Text span size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>{`Предыдущая форма:`}</Text>
                <Text 
                  span
                  size='md' 
                  lineClamp={1}
                  style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}
                >{wizform!.previousForm == undefined ? 'Отсутствует' : wizform!.previousFormName!}</Text>
              </div>
            </div>
            <div style={{paddingTop: '5%', width: '100%'}}>
              <Badge radius={0}>
                Уровни магии
              </Badge>
              <div style={{width: '90%'}}>
                <Carousel orientation='horizontal' className="w-full max-w-xs" style={{width: '90%'}} opts={{loop: true, slidesToScroll: 1}}>
                  <CarouselContent>{wizform!.magics.types.map((magic, index) => (
                  <CarouselItem key={index}>
                    <div>
                      <Text style={{fontFamily: 'Yanone Kaffeesatz', fontWeight: 'bolder', fontSize: '1.5rem'}}>{`Уровень ${magic.level}`}</Text>
                      <div style={{paddingLeft: '5%', justifyItems: 'center'}}>
                        <Stack gap={1}>
                          <Stack gap={1}>
                            <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>Первое активное</Text>
                            <ActiveMagicSlot slot={magic.firstActiveSlot}/>
                          </Stack>
                          <Stack gap={1}>
                            <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>Первое пассивное</Text>
                            <PassiveMagicSlot slot={magic.firstPassiveSlot}/>
                          </Stack>
                          <Stack gap={1}>
                            <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>Второе активное</Text>
                            <ActiveMagicSlot slot={magic.secondActiveSlot}/>
                          </Stack>
                          <Stack gap={1}>
                            <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>Второе пассивное</Text>
                            <PassiveMagicSlot slot={magic.secondPassiveSlot}/>
                          </Stack>
                        </Stack>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
                </CarouselContent>
                <CarouselPrevious/>
                <CarouselNext/>
                </Carousel>
              </div>
            </div>
            {
              params.permission != UserPermissionType.UnregisteredUser ? (
                !wizform!.inCollectionId ?
                <Group justify="flex-end" mt="md" pt="md">
                  <Button color='lime' loading={addToCollectionMutation.isPending} onClick={() => {
                    addToCollectionMutation.mutate({collectionId: params.currentCollection!, wizformId: wizform!.id!})
                  }}
                  >Добавить в текущую коллекцию</Button>
                </Group> :
                <Group justify="flex-end" mt="md" pt="md">
                  <Button color='pink' loading={removeFromCollectionMutation.isPending} onClick={() => {
                    removeFromCollectionMutation.mutate({data: {id: wizform!.inCollectionId!}})
                  }}
                  >Удалить из текущей коллекции</Button>
                </Group>
              ) : null
            }
          </div>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  )
}
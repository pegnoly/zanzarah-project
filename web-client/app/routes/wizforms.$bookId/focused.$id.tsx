import { Badge, Button, Group, Modal, Stack, Text } from '@mantine/core'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { fetchWizformOptions, WizformFull } from '../../utils/queries/wizform';
import { Carousel } from '@mantine/carousel';
import '@mantine/carousel/styles.css';
import { useCommonStore } from '../../stores/common';
import { PassiveMagicSlot } from '../../components/magic/passiveSlot';
import { ActiveMagicSlot } from '../../components/magic/activeSlot';
import { useShallow } from 'zustand/shallow';
import { useMutation } from '@tanstack/react-query';
import { addCollectionItemMutation, AddCollectionItemMutationResult, AddCollectionItemMutationVariables } from '../../utils/queries/collections';
import request from 'graphql-request';

export const Route = createFileRoute('/wizforms/$bookId/focused/$id')({
  component: RouteComponent,
  loader: async({context, params}) => {
    const data = await context.queryClient.ensureQueryData(fetchWizformOptions(params.id));
    return data;
  }
});

function RouteComponent() {
  const data = Route.useLoaderData();
  const params = Route.useParams();

  return <>
    <FocusedWizform bookId={params.bookId} wizform={data?.wizform!}/>
  </>
}

function FocusedWizform(params: {
  bookId: string,
  wizform: WizformFull
}) {
    const navigate = useNavigate();

    const [wizforms, setWizforms, elements, currentCollection] = useCommonStore(useShallow((state) => [
      state.wizforms, state.setWizforms, state.elements, state.currentCollection
    ]));

    const addToCollectionMutation = useMutation({
    mutationKey: ["add_collection_item"],
    mutationFn: async(data: AddCollectionItemMutationVariables) => {
        const updatedWizforms = wizforms?.map((w) => {
          if (w.id == params.wizform.id) {
            w.inCollectionId = "optimistically_updated";
            return w;
          } else {
            return w;
          }
        });
        const collectionItemId = await request<AddCollectionItemMutationResult | null, AddCollectionItemMutationVariables>(
            'https://zanzarah-project-api-lyaq.shuttle.app/',
            addCollectionItemMutation,
            {collectionId: data.collectionId, wizformId: data.wizformId}
        );
        if (collectionItemId != null) {
          setWizforms(updatedWizforms);
        }
    },
  })

  return <Modal opened={true} onClose={() => {navigate({to: '/wizforms/$bookId', params: {bookId: params.bookId}})}}>
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <div style={{display: 'flex', alignItems: 'start'}}>
        <Button onClick={() => {
          addToCollectionMutation.mutate({collectionId: currentCollection!, wizformId: params.wizform.id!})
        }}
        >Добавить в текущую коллекцию</Button>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: '1%', alignItems: 'end'}}>
        <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '2rem'}}>{params.wizform.name}</Text>
        <Text 
          style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.5rem'}}
        >{`${elements?.find(e => e.element == params.wizform.element)?.name}, №${params.wizform.number}`}</Text>
      </div>
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
        <Group gap="sm" grow>
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
    </div>
  </Modal>
}
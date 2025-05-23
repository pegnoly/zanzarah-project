import { Badge, Box, Button, Group, Modal, SimpleGrid, Space, Stack, Text } from '@mantine/core'
import { createFileRoute, useLoaderData, useNavigate } from '@tanstack/react-router'
import { fetchWizformOptions } from '../../utils/queries/wizform';
import { Carousel } from '@mantine/carousel';
import '@mantine/carousel/styles.css';
import classes from "./styles.module.css";
import { useCommonStore } from '../../stores/common';
import { PassiveMagicSlot } from '../../components/magic/passiveSlot';
import { ActiveMagicSlot } from '../../components/magic/activeSlot';
import { useShallow } from 'zustand/shallow';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { addCollectionItem, addCollectionItemMutation, AddCollectionItemMutationResult, AddCollectionItemMutationVariables } from '../../utils/queries/collections';
import request from 'graphql-request';

export const Route = createFileRoute('/wizforms/$bookId/focused/$id')({
  component: RouteComponent,
  loader: async({context, params}) => {
    const data = await context.queryClient.ensureQueryData(fetchWizformOptions(params.id));
    return data;
  }
});

function RouteComponent() {
  const navigate = useNavigate();
  const data = Route.useLoaderData();
  const params = Route.useParams();

  const [wizforms, setWizforms, elements, currentCollection] = useCommonStore(useShallow((state) => [
    state.wizforms, state.setWizforms, state.elements, state.currentCollection
  ]));

  const addToCollectionMutation = useMutation({
    mutationFn: async(data: AddCollectionItemMutationVariables) => {
        const updatedWizforms = wizforms?.map((w) => {
          if (w.id == params.id) {
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
    // onSuccess: (createdId) => {
    //   console.log("Mutation finished: ", createdId?.createdId);
    // }
    // onSuccess: (createdId) => {
    //   const updatedWizforms = wizforms?.map((w) => {
    //     if (w.id == params.id) {
    //       w.inCollectionId = createdId?.createdId!;
    //       return w;
    //     } else {
    //       return w;
    //     }
    //   });
    //   setWizforms(updatedWizforms);
    // }
  })

  return <Modal opened={true} onClose={() => {navigate({to: '/wizforms/$bookId', params: {bookId: params.bookId}})}}>
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <div style={{display: 'flex', alignItems: 'start'}}>
        <Button onClick={() => {
          // const updatedWizforms = wizforms?.map((w) => {
          //   if (w.id == params.id) {
          //     w.inCollectionId = "optimistically_updated";
          //     return w;
          //   } else {
          //     return w;
          //   }
          // });
          // setWizforms(updatedWizforms);
          addToCollectionMutation.mutate({collectionId: currentCollection!, wizformId: data?.wizform.id!})
        }}
        >Добавить в текущую коллекцию</Button>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: '1%', alignItems: 'end'}}>
        <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '2rem'}}>{data?.wizform.name}</Text>
        <Text 
          style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.5rem'}}
        >{`${elements?.find(e => e.element == data?.wizform.element)?.name}, №${data?.wizform.number}`}</Text>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignSelf: 'start'}}>
        <Badge radius={0}>
          Базовые характеристики
        </Badge>
        <Group gap="xs">
          <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>{`Максимальное здоровье:`}</Text>
          <Text size="md" style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}>{data?.wizform.hitpoints}</Text>
        </Group>
        <Group gap="xs">
          <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>{`Ловкость:`}</Text>
          <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}>{data?.wizform.agility}</Text>
        </Group>
        <Group gap="xs">
          <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>{`Прыгучесть:`}</Text>
          <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}>{data?.wizform.jumpAbility}</Text>
        </Group>
        <Group gap="xs">
          <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>{`Меткость:`}</Text>
          <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}>{data?.wizform.precision}</Text>
        </Group>
        <Group gap="xs">
          <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>{`Скорость повышения уровня:`}</Text>
          <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}>{data?.wizform.expModifier}</Text>
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
          >{data?.wizform.evolutionForm == -1 ? 'Отстуствует' : data?.wizform.evolutionName}</Text>
        </Group>
        <Group gap="xs">
          <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>{`Уровень эволюции:`}</Text>
          <Text 
            size='md' 
            style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}
          >{data?.wizform.evolutionLevel == -1 ? 'Отсутствует' : data?.wizform.evolutionLevel!}</Text>
        </Group>
        <Group gap="sm" grow>
          <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>{`Предыдущая форма:`}</Text>
          <Text 
            size='md' 
            lineClamp={1}
            style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder', color: 'red'}}
          >{data?.wizform.previousForm == undefined ? 'Отсутствует' : data?.wizform.previousFormName!}</Text>
        </Group>
      </div>
      <div style={{paddingTop: '5%'}}>
        <Badge radius={0}>
          Уровни магии
        </Badge>
        <Carousel withControls>{data?.wizform.magics.types.map((magic, index) => (
          <Carousel.Slide key={index}>
            <div>
              <Text style={{fontFamily: 'Yanone Kaffeesatz', fontWeight: 'bolder', fontSize: '1.5rem'}}>{`Уровень ${magic.level}`}</Text>
              <div style={{paddingLeft: '25%'}}>
                <Stack gap={1}>
                  <Group>
                    <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>Первое активное</Text>
                    <ActiveMagicSlot slot={magic.firstActiveSlot}/>
                    {/* <PassiveMagicSlot slot={magic.firstPassiveSlot}/> */}
                  </Group>
                  <Group>
                    <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>Первое пассивное</Text>
                    {/* <ActiveMagicSlot slot={magic.firstActiveSlot}/> */}
                    <PassiveMagicSlot slot={magic.firstPassiveSlot}/>
                  </Group>
                  <Group>
                    <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>Второе активное</Text>
                    <ActiveMagicSlot slot={magic.secondActiveSlot}/>
                    {/* <PassiveMagicSlot slot={magic.firstPassiveSlot}/> */}
                  </Group>
                  <Group>
                    <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>Второе пассивное</Text>
                    {/* <ActiveMagicSlot slot={magic.secondActiveSlot}/> */}
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
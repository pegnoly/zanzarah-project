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
import { notifications } from "@mantine/notifications";
import { UserPermissionType } from '../../utils/auth/utils';

export const Route = createFileRoute('/wizforms/$bookId/focused/$id')({
  component: RouteComponent,
  loader: async({context, params}) => {
    const data = await context.queryClient.ensureQueryData(fetchWizformOptions(params.id));
    return data;
  }
});

function RouteComponent() {
  const data = Route.useLoaderData();
  const deps = Route.useRouteContext();
  const params = Route.useParams();
  console.log("Data in focused route:", data);

  return <>
    {/* <FocusedWizform bookId={params.bookId} wizform={data?.wizform!}/> */}
  </>
}
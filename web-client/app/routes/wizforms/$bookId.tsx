import WizformsFilter from '@/components/wizforms/filter';
import WizformsList from '@/components/wizforms/list';
import { WizformElementType } from '@/graphql/graphql';
import { useCommonStore } from '@/stores/common';
import useWizformsStore from '@/stores/wizforms';
import { AuthProps, processAuth } from '@/utils/auth/utils';
import { fetchActiveCollectionOptions } from '@/utils/queries/collections/activeCollectionQuery';
import { fetchElementsOptions, WizformElement } from '@/utils/queries/elements';
import { WizformSimpleModel } from '@/utils/queries/wizforms/types';
import { fetchWizformsOptions } from '@/utils/queries/wizforms/wizformsQuery';
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start';
import { getCookie, setCookie } from '@tanstack/react-start/server';
import { useState } from 'react';
import { useShallow } from 'zustand/shallow';

const getLastNameFilterCookie = createServerFn({method: 'GET'})
  .handler(async() => {
    const cookie = getCookie('zanzarah-project-name-filter');
    return cookie;
  })

const getLastElementFilterCookie = createServerFn({method: 'GET'})
  .handler(async() => {
    const cookie = getCookie('zanzarah-project-element-filter');
    return cookie;
  })

type LoaderData = {
  nameFilter: string | undefined,
  elementFilter: WizformElementType,
  wizforms: WizformSimpleModel [] | undefined,
  elements: WizformElement [] | undefined,
  auth: AuthProps,
  currentCollection: string | null
}

export const Route = createFileRoute('/wizforms/$bookId')({
    component: RouteComponent,
    beforeLoad: async ({context, params}) => {
      if (context.auth == undefined) {
        const auth = await processAuth();
        return {
          auth: auth,
          currentCollection: auth.userId ? 
            await context.queryClient.ensureQueryData(fetchActiveCollectionOptions({bookId: params.bookId, userId: auth.userId})) :
            null
        }
      }
    },
    loader: async ({context, params}) : Promise<LoaderData> => {
      var loaderData: LoaderData = {
        nameFilter: undefined,
        elementFilter: WizformElementType.Nature,
        elements: undefined,
        auth: await processAuth(),
        currentCollection: null,
        wizforms: undefined,
      }
      const nameFilterCookie = await getLastNameFilterCookie();
      const elementFilterCookie = await getLastElementFilterCookie();
      loaderData = {...loaderData, 
        nameFilter: nameFilterCookie != undefined ? nameFilterCookie : loaderData.nameFilter, 
        elementFilter: elementFilterCookie != undefined ? elementFilterCookie as WizformElementType : loaderData.elementFilter
      };
      if (loaderData.auth.userId) {
        const activeCollection = await context.queryClient.ensureQueryData(fetchActiveCollectionOptions({bookId: params.bookId, userId: loaderData.auth.userId}));
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
      return loaderData;
    }
});

function RouteComponent() {
  const loaderData =  Route.useLoaderData();
  const params = Route.useParams();
  const context = Route.useRouteContext();

  const setElements = useCommonStore(useShallow((state) => state.setElements));
  const [wizforms, elementFilter, nameFilter, setWizforms] = useWizformsStore(useShallow((state) => [
    state.wizforms,
    state.elementFilter,
    state.nameFilter,
    state.setWizforms
  ]));

  setElements(loaderData.elements);
  if (wizforms == undefined) {
    setWizforms(loaderData.wizforms!)
  }

  const [localElementFilter, setLocalElementFilter] = useState<WizformElementType>(elementFilter != undefined ? elementFilter : loaderData.elementFilter);
  const [localNameFilter, setLocalNameFilter] = useState<string | undefined>(nameFilter != undefined ? nameFilter : loaderData.nameFilter);

  async function onFiltersChanged() {
    context.queryClient.fetchQuery(fetchWizformsOptions({
      bookId: params.bookId,
      enabled: true,
      elementFilter: localElementFilter,
      nameFilter: localNameFilter,
      collection: loaderData.currentCollection
    }))
    .then((data) => {
      setWizforms(data!);
    });
  }

  return (
    <>
      <div>
        <WizformsList bookId={params.bookId}/>
        <WizformsFilter 
          filtersUpdatedCallback={onFiltersChanged} 
          currentElementFilter={localElementFilter} 
          currentNameFilter={localNameFilter}
          elementFilterUpdateCallback={setLocalElementFilter}
          nameFilterUpdateCallback={setLocalNameFilter}
        />
      </div>
      <Outlet/>
    </>
  ) 
}
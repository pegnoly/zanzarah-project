// app/routes/index.tsx

import { Box, Card, CardSection, Grid, GridCol, NumberInput, PasswordInput, SimpleGrid } from "@mantine/core"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import WizformsPreview from "../components/home/wizformsPreview"
import classes from "../styles/main.module.css"
import BooksPreview, { getBookCookie } from "../components/home/booksPreview"
import CollectionsPreview from "../components/home/collectionsPreview"
import MapPreview from "../components/home/mapPreview"
import { BookFullModel, BookSimpleModel, fetchBookOptions, fetchBooksOptions } from "../utils/queries/books"
import { CollectionModel, fetchCollectionsOptions } from "../utils/queries/collections"
import { createServerFn } from "@tanstack/react-start"
import { getCookie, setCookie } from "@tanstack/react-start/server"
import axios from 'axios';
import { AuthProps, processAuth, UserPermissionType, RegistrationState } from "../utils/auth/utils"
import { useCommonStore } from "../stores/common"
import { useShallow } from "zustand/shallow"

type LoaderData = {
  auth: AuthProps,
  books: BookSimpleModel [] | undefined,
  currentBook: BookFullModel | null | undefined,
  collections: CollectionModel [] | undefined
}

export const Route = createFileRoute('/')({
  component: Home,
  loader: async({context, cause}): Promise<LoaderData> => {
    var loaderData: LoaderData = {
      auth: {userState: RegistrationState.Unregistered, userPermission: UserPermissionType.UnregisteredUser, userId: null},
      books: undefined,
      currentBook: undefined,
      collections: undefined
    }
    if (cause == "stay") {
      console.log("Page was reloaded")
      loaderData = {...loaderData, auth: {...loaderData.auth, userState: RegistrationState.Unchanged}};
    } else {
      console.log("Page was restarted")
      const authData = await processAuth();
      loaderData = {...loaderData, auth: authData};
    }
    // load books data
    const currentBookCookie = await getBookCookie();
    const booksData = await context.queryClient.ensureQueryData(fetchBooksOptions(true));
    loaderData = {...loaderData, books: booksData?.books}
    if (currentBookCookie != undefined) {
      const book = await context.queryClient.ensureQueryData(fetchBookOptions(currentBookCookie));
      loaderData = {...loaderData, currentBook: book?.currentBook}
    }
    if (loaderData.auth.userState == RegistrationState.Confirmed && loaderData.auth.userId != null && currentBookCookie != undefined) {
      //await context.queryClient.invalidateQueries({ queryKey: ['collections', loaderData.auth.userId, currentBookCookie]});
      const collectionsData = await context.queryClient.ensureQueryData(
        fetchCollectionsOptions({bookId: currentBookCookie, userId: loaderData.auth.userId})
      );
      loaderData = {...loaderData, collections: collectionsData?.collections}
    }

    return loaderData;
  } 
})

function Home() {
  const data = Route.useLoaderData();
  return (
    <Box 
      className={classes.root}
    >
      <SimpleGrid 
        cols={{ base: 1, sm: 2}} 
        spacing="xl" 
        verticalSpacing="xl"
      >
          <Box>
              <Card w="100%" h="100%" withBorder radius={0}>
                <BooksPreview 
                  currentBookId={data.currentBook?.id} 
                  currentBookName={data.currentBook?.name} 
                  currentBookVersion={data.currentBook?.version}
                  books={data.books}
                />
              </Card>
          </Box>
          <Box>
            <WizformsPreview
              currentBookId={data.currentBook?.id}
              wizformsCount={data.currentBook?.wizformsCount}
              activeWizformsCount={data.currentBook?.activeWizformsCount}
            />
          </Box>        
          <Box bg="yellow">
            <CollectionsPreview currentBook={data.currentBook!} currentCollections={data.collections} authData={data.auth}/>
          </Box>
          <Box bg="green">
            <MapPreview bookId={data.currentBook?.id}/>
          </Box>
      </SimpleGrid>
    </Box>
  )
}
// app/routes/index.tsx

import { Box, Card, SimpleGrid } from "@mantine/core"
import { createFileRoute } from "@tanstack/react-router"
import WizformsPreview from "../components/home/wizformsPreview"
import classes from "../styles/main.module.css"
import BooksPreview, { getBookCookie, setBookCookie } from "../components/home/booksPreview"
import CollectionsPreview from "../components/home/collectionsPreview"
import MapPreview from "../components/home/mapPreview"
import { BookFullModel, BookSimpleModel, fetchBookOptions, fetchBooksOptions } from "../utils/queries/books"
import { AuthProps, processAuth, UserPermissionType, RegistrationState } from "../utils/auth/utils"
import { fetchCollectionsOptions } from "@/utils/queries/collections/collectionsQuery"
import { CollectionModel } from "@/utils/queries/collections/types"

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
      // console.log("Page was reloaded")
      loaderData = {...loaderData, auth: {...loaderData.auth, userState: RegistrationState.Unchanged}};
    } else {
      // console.log("Page was restarted")
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
    } else {
      await setBookCookie({data: booksData?.books[0].id!});
      const book = await context.queryClient.ensureQueryData(fetchBookOptions(booksData?.books[0].id!));
      loaderData = {...loaderData, currentBook: book?.currentBook}
    }
    if (loaderData.auth.userState == RegistrationState.Confirmed && loaderData.auth.userId != null && currentBookCookie != undefined) {
      const collectionsData = await context.queryClient.ensureQueryData(
        fetchCollectionsOptions({bookId: currentBookCookie, userId: loaderData.auth.userId})
      );
      loaderData = {...loaderData, collections: collectionsData}
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
          <Box>
            <CollectionsPreview currentBook={data.currentBook!} currentCollections={data.collections} authData={data.auth}/>
          </Box>
          <Box>
            <MapPreview bookId={data.currentBook?.id}/>
          </Box>
      </SimpleGrid>
    </Box>
  )
}
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
import { AuthProps, processAuth, UserPermissionType, RegistrationState } from "../utils/auth/helpers"
import { useCommonStore } from "../stores/common"
import { useShallow } from "zustand/shallow"

type UserClaims = {
  email: string,
  password: string
}

const getUserDataCookies = createServerFn({method: 'GET'})
  .handler(async(): Promise<{email: string | undefined, password: string | undefined}> => {
    return {
      email: getCookie('zanzarah-project-user-email'),
      password: getCookie('zanzarah-project-user-password')
    }
  });

const getTokenCookie = createServerFn({method: 'GET'})
  .handler(async(): Promise<string | undefined> => {
    return getCookie('zanzarah-project-auth-token');
  });

const setTokenCookie = createServerFn({method: 'POST'})
  .validator((value: string) => value)
  .handler(async({data}) => {
    setCookie('zanzarah-project-auth-token', data, {maxAge: 86400});
  })

function checkForExistingUserClaims(input: {email: string | undefined, password: string | undefined}): UserClaims | null {
  if (input.email != undefined && input.password != undefined) {
    return {
      email: input.email!,
      password: input.password!
    }
  } else {
    return null;
  }
}

const authorizeUser = createServerFn({method: 'POST'})
  .validator((data: UserClaims) => data)
  .handler(async({data}): Promise<string> => {
    const newToken = await axios.post<string, string, UserClaims>('https://zanzarah-project-api-lyaq.shuttle.app/authorize', data);
    return newToken;
  })

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
      auth: {userState: RegistrationState.Unregistered, userPermission: UserPermissionType.UnregisteredUser},
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

    return loaderData;
  } 
})

function Home() {
  const data = Route.useLoaderData();
  const [setRegistrationState, setPermission] = useCommonStore(useShallow((state) => [state.setRegistrationState, state.setPermission]));

  setRegistrationState(data.auth.userState);
  setPermission(data.auth.userPermission!);

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
            <CollectionsPreview authProps={data.auth} currentCollections={data.collections}/>
          </Box>
          <Box bg="green">
            <MapPreview/>
          </Box>
      </SimpleGrid>
    </Box>
  )
}
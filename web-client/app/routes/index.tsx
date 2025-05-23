// app/routes/index.tsx

import { Box, Card, CardSection, Grid, GridCol, NumberInput, PasswordInput, SimpleGrid } from "@mantine/core"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import WizformsPreview from "../components/home/wizformsPreview"
import classes from "../styles/main.module.css"
import BooksPreview, { getBookCookie } from "../components/home/booksPreview"
import CollectionsPreview from "../components/home/collectionsPreview"
import MapPreview from "../components/home/mapPreview"
import { useCommonStore } from "../stores/common"
import { useShallow } from "zustand/shallow"
import { useEffect, useState } from "react"
import { fetchElementsOptions } from "../utils/queries/elements"
import { getCookie, setCookie } from "@tanstack/react-start/server"
import { BookFullModel, BookQueryResult, BooksQueryResult, fetchBookOptions, fetchBooksOptions } from "../utils/queries/books"
import { fetchCollectionsOptions } from "../utils/queries/collections"

export const Route = createFileRoute('/')({
  component: Home,
  loader: async({context}) => {
    const currentBookCookie = await getBookCookie();
    const booksData = await context.queryClient.ensureQueryData(fetchBooksOptions(true));
    const collectionsData = await context.queryClient.ensureQueryData(fetchCollectionsOptions({userId: 1, bookId: currentBookCookie!}));
    console.log("Collections data on servere")
    if (currentBookCookie != undefined) {
      try {
        const book = await context.queryClient.ensureQueryData(fetchBookOptions(currentBookCookie));
        //const elements = await context.queryClient.ensureQueryData(fetchElementsOptions({bookId: currentBookCookie}));
        return {
          books: booksData?.books,
          currentBook: book?.currentBook,
          collections: collectionsData?.collections
        }
      } catch {
        return {
          books: booksData?.books,
          currentBook: null,
          collections: collectionsData?.collections
        }
      }
    } else {
      return {
        books: booksData?.books,
        currentBook: null,
        collections: collectionsData?.collections
      }
    }
  }
})

function Home() {
  const data = Route.useLoaderData();
  
  console.log("Collections: ", data.collections);

  return (
    <Box 
      className={classes.root}
    >
      <SimpleGrid 
        cols={{ base: 1, sm: 2}} 
        spacing="xl" 
        verticalSpacing="xl"
      >
          <Box bg="blue">
              <BooksPreview 
                currentBookId={data.currentBook?.id} 
                currentBookName={data.currentBook?.name} 
                currentBookVersion={data.currentBook?.version}
                books={data.books}
              />
          </Box>
          <Box>
            <WizformsPreview
              currentBookId={data.currentBook?.id}
              wizformsCount={data.currentBook?.wizformsCount}
              activeWizformsCount={data.currentBook?.activeWizformsCount}
            />
          </Box>        
          <Box bg="yellow">
            <CollectionsPreview currentCollections={data.collections}/>
          </Box>
          <Box bg="green">
            <MapPreview/>
          </Box>
      </SimpleGrid>
    </Box>
  )
}
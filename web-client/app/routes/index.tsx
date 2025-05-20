// app/routes/index.tsx

import { Box, Card, CardSection, Grid, GridCol, NumberInput, PasswordInput, SimpleGrid } from "@mantine/core"
import { createFileRoute } from "@tanstack/react-router"
import WizformsPreview from "../components/home/wizformsPreview"
import classes from "../styles/main.module.css"
import BooksPreview, { getBook } from "../components/home/booksPreview"
import CollectionsPreview from "../components/home/collectionsPreview"
import MapPreview from "../components/home/mapPreview"
import { useCommonStore } from "../stores/common"
import { useShallow } from "zustand/shallow"
import { useEffect, useState } from "react"
import { fetchElementsOptions } from "../utils/queries/elements"
import { getCookie, setCookie } from "@tanstack/react-start/server"

export const Route = createFileRoute('/')({
  component: Home,
  beforeLoad: async({cause}) => {
    console.log("before load.... ", cause);
  },
  loader: async({}) => {
    return getBook();
  }
})

function Home() {
  const setCurrentBook = useCommonStore(state => state.setCurrentBook);
  const data = Route.useLoaderData();

  if (data != null) {
    setCurrentBook(data);
  }

  return (
    <Box 
      className={classes.root}
    // style={{height: '100vh', paddingTop: '20%', paddingLeft: '5%', paddingRight: '5%'}}
    >
      <SimpleGrid 
        // style={{padding: '3%'}}
        cols={{ base: 1, sm: 2}} 
        spacing="xl" 
        verticalSpacing="xl"
      >
          <Box bg="blue">
              <BooksPreview/>
          </Box>
          <Box>
              <WizformsPreview/>
          </Box>        
          <Box bg="yellow">
            <CollectionsPreview/>
          </Box>
          <Box bg="green">
            <MapPreview/>
          </Box>
      </SimpleGrid>
      {/* <Grid
        style={{height: '100%'}}
        type="container"
        breakpoints={{xs: '100px', sm: '200px', md: '300px', lg: '400px', xl: '500px'}}
      >
          <GridCol span={{ base: 12, md: 12, lg: 6 }} style={{height: '100%'}}>
            <Box bg="blue" style={{height: '100%'}}>
              <BooksPreview/>
            </Box>
          </GridCol>
          <GridCol span={{ base: 12, md: 12, lg: 6 }} style={{height: '100%'}}>
            <Box bg="red" style={{height: '100%'}}>
              <WizformsPreview/>
            </Box>
          </GridCol>
          <GridCol span={{ base: 12, md: 12, lg: 6 }} style={{height: '100%'}}>           
            <Box bg="yellow" style={{height: '100%'}}>
              <CollectionsPreview/>
            </Box>
          </GridCol>
          <GridCol span={{ base: 12, md: 12, lg: 6 }} style={{height: '100%'}}> 
            <Box bg="green" style={{height: '100%'}}>
              <MapPreview/>
            </Box>
          </GridCol>
      </Grid> */}
    </Box>
  )
}
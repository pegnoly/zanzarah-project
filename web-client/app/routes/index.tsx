// app/routes/index.tsx

import { Box, Grid, GridCol, NumberInput, PasswordInput } from "@mantine/core"
import { createFileRoute } from "@tanstack/react-router"
import WizformsPreview from "../components/home/wizformsPreview"
import classes from "../styles/main.module.css"
import BooksPreview from "../components/home/booksPreview"
import CollectionsPreview from "../components/home/collectionsPreview"
import MapPreview from "../components/home/mapPreview"

export const Route = createFileRoute('/')({
  component: Home
})

function Home() {
  const state = Route.useLoaderData()

  return (
    <Box style={{height: '100vh', paddingTop: '20%', paddingLeft: '5%', paddingRight: '5%'}}>
      <Grid
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
      </Grid>
    </Box>
  )
}
// app/routes/index.tsx

import { Grid, GridCol, NumberInput, PasswordInput } from "@mantine/core"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute('/')({
  component: Home
})

function Home() {
  const state = Route.useLoaderData()

  return (
    <div style={{padding: '4%'}}>
      <Grid
        type="container"
        breakpoints={{xs: '100px', sm: '200px', md: '300px', lg: '400px', xl: '500px'}}
      >
          <GridCol span={{ base: 12, md: 12, lg: 6 }}>
            <div style={{width: '100%', height: '100%', backgroundColor: 'crimson'}}>
              <h1>Book selection</h1>
              <form>
                <NumberInput label="Code" placeholder="Enter code"/>
                <PasswordInput label="Password" placeholder="Enter password"/>
              </form>
            </div>
          </GridCol>
          <GridCol span={{ base: 12, md: 12, lg: 6 }}>
            <div style={{width: '100%', height: '100%', backgroundColor: 'green'}}>
              <h1>Wizforms</h1>
            </div>
          </GridCol>
          <GridCol span={{ base: 12, md: 12, lg: 6 }}>            
            <div style={{width: '100%', height: '100%', backgroundColor: 'blue'}}>
              <h1>Collections</h1>
            </div></GridCol>
          <GridCol span={{ base: 12, md: 12, lg: 6 }}>
            <div style={{width: '100%', height: '100%', backgroundColor: 'yellow'}}>
              <h1>Map</h1>
            </div>
          </GridCol>
      </Grid>
    </div>
  )
}
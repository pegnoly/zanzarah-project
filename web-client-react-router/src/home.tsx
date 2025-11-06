import { SimpleGrid, Box, Card } from '@mantine/core';
import BooksPreview from './components/home/booksPreview';
import WizformsPreview from './components/home/wizformsPreview';
import MapPreview from './components/home/mapPreview';
import CollectionsPreview from './components/home/collectionsPreview';
import classes from "./styles/main.module.css";

const Home = () => {
  return (
    <Box className={classes.root}>
       <SimpleGrid 
        cols={{ base: 1, sm: 2}} 
        spacing="xl" 
        verticalSpacing="xl"
      >
          <Box>
              <Card w="100%" h="100%" withBorder radius={0}>
                <BooksPreview/>
              </Card>
          </Box>
          <Box>
            <WizformsPreview/>
          </Box>        
          <Box>
            <CollectionsPreview/>
          </Box>
          <Box>
            <MapPreview/>
          </Box>
      </SimpleGrid>
    </Box>
  );
};

export default Home;
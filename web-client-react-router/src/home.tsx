import { Container, SimpleGrid, Box, Card } from '@mantine/core';
import BooksPreview from './components/home/booksPreview';
import WizformsPreview from './components/home/wizformsPreview';
import MapPreview from './components/home/mapPreview';
import CollectionsPreview from './components/home/collectionsPreview';

const Home = () => {
  return (
    <Container>
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
    </Container>
  );
};

export default Home;
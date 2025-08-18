import { Button, Title, Container } from '@mantine/core';
import { Link } from 'react-router';

const Home = () => {
  return (
    <Container>
      <Title order={1} mb="xl">Welcome to WizForms</Title>
      <Button component={Link} to="/wizforms/123" variant="outline">
        Go to Wizform ID: 123
      </Button>
      <Button component={Link} to="/map/5a5247c2-273b-41e9-8224-491e02f77d8d" variant="outline">
        Go to Wizforms map: 123
      </Button>
    </Container>
  );
};

export default Home;
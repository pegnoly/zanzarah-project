import { Button, Title, Container } from '@mantine/core';
import { Link } from 'react-router';

const Home = () => {
  return (
    <Container>
      <Title order={1} mb="xl">Welcome to WizForms</Title>
      <Button component={Link} to="/wizforms/123" variant="outline">
        Go to Wizform ID: 123
      </Button>
    </Container>
  );
};

export default Home;
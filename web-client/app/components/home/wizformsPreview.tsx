import { Card, Text } from "@mantine/core";
import { Link } from "@tanstack/react-router";

function WizformsPreview() {
    return <Link to="/wizforms" preload={false} style={{textDecoration: 'none'}}>
        <Card w='100%' h='100%' withBorder>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Text>Список фей активной книги</Text>
            </div>
        </Card>
    </Link>
}

export default WizformsPreview;
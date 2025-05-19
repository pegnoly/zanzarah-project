import { Card, List, Image, Text } from "@mantine/core";
import { WizformSimple } from "./core";
import { Link } from "react-router-dom";

function WizformsList(params: {
    models: WizformSimple[]
}) {
    return <div style={{width: '35%', height: '100%', overflow: 'auto'}}>
        <List>{params.models.map((wizform, index) => (
            <Link key={index} style={{textDecoration: 'none'}} to={`focused/${wizform.id}`}>
                <Card shadow='sm' padding='lg' withBorder>
                    <Card.Section w={40} h={40} style={{position: 'absolute', top: '50%', right: '8%'}}>
                        <Image width={40} height={40} src={`data:image/bmp;base64,${wizform.icon64}`}></Image>
                    </Card.Section>
                    <div style={{width: '80%'}}>
                        <Text size='md' lineClamp={1}>{wizform.name}</Text>
                    </div>
                </Card>
            </Link>
        ))}</List>
    </div>
}

export default WizformsList;
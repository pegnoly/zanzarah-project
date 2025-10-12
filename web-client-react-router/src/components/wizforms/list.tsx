import { Card, Image, Overlay, SimpleGrid, Text } from "@mantine/core";
import { Link } from "react-router";
import { useWizformsList } from "@/contexts/wizformsList";

function WizformsList() {
    const wizformsList = useWizformsList();

    return (
    <>
        {
            wizformsList?.items == undefined ? <Overlay/> :
            <SimpleGrid
                style={{padding: '3%'}}
                cols={{ base: 1, sm: 2, md: 3, lg: 4 }} 
            >{wizformsList?.items!.map((w, _i) => (
                <Link 
                    to={`focused/${w.id}`}
                    key={w.id}
                    style={{textDecoration: 'none'}}
                >
                    <Card shadow='sm' padding='lg' withBorder style={{height: '100%', backgroundColor: w.inCollectionId ? "gold" : "white"}}>
                        <Card.Section w={40} h={40} style={{position: 'absolute', top: '50%', right: '8%'}}>
                            <Image width={40} height={40} src={`data:image/bmp;base64,${w.icon64}`}></Image>
                        </Card.Section>
                        <div style={{width: '80%'}}>
                            <Text size='md' lineClamp={1}>{w.name}</Text>
                        </div>
                    </Card>
                </Link>
            ))}</SimpleGrid>
        }
    </>
    )
}

export default WizformsList;
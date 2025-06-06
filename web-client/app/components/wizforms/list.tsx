import { useCommonStore } from "@/stores/common";
import useWizformsStore from "@/stores/wizforms";
import { Card, Image, SimpleGrid, Text } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { useShallow } from "zustand/shallow";

function WizformsList(params: {
    bookId: string
}) {
    const wizformsDisabled = useCommonStore(useShallow((state) => state.wizformsDisabled));
    const wizforms = useWizformsStore(useShallow((state) => state.wizforms));

    return (
    <>
        {
            wizforms == undefined ?
            null :
            <SimpleGrid
                style={{padding: '3%'}}
                cols={{ base: 1, sm: 2, md: 3, lg: 4 }} 
            >{wizforms!.map((w, _i) => (
                <Link 
                    to="/wizforms/$bookId/$focusedId/modal"
                    params={{bookId: params.bookId, focusedId: w.id}}
                    key={w.id}
                    disabled={wizformsDisabled}
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
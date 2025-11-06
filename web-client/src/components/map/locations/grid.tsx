import { Badge, Card, LoadingOverlay, SimpleGrid, Text } from "@mantine/core";
import classes from "./styles.module.css";
import { Link } from "react-router";
import { locationBackgroundsData } from "./imports";
import type { Location } from "@/queries/map/types";

function LocationsGrid({locations}: {
    locations: Location[] | undefined,
    // sectionId: string,
    // bookId: string
}) {

    return (
    <>
        { 
            locations == undefined ? <LoadingOverlay/> :
            <SimpleGrid cols={{sm: 1, lg: 2}} className={classes.map_grid}>{locations?.map((l, i) => (
                <Link 
                    key={i} 
                    to={`focused/${l.id}`} 
                    style={{textDecoration: 'none'}}
                >
                    <Card 
                        withBorder 
                        radius={0} 
                        style={{
                        backgroundImage: `url(${locationBackgroundsData.get(l.id)})`, 
                        backgroundSize: 'cover'
                        }} className={classes.map_card_back}>
                        <Badge color='white' radius={0}>
                            <Text c="black" lineClamp={1} style={{fontWeight: 'bold', fontSize: "1rem"}}>{l.name}</Text>
                        </Badge>
                        {/* <Card.Section m={-1}> */}
                            <Badge color='white' radius={0} style={{position: 'absolute', bottom: '3%', right: '3%'}}>
                                <Text c='black' lineClamp={1} style={{fontWeight: 'bold', fontSize: "1rem"}}>{`Фей отмечено: ${l.entriesCount}`}</Text>
                            </Badge>
                        {/* </Card.Section> */}
                    </Card>
                </Link>
            ))}</SimpleGrid>     
        }
    </>
    )
}

export default LocationsGrid;
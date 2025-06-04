import { Badge, Card, SimpleGrid, Text } from "@mantine/core"
import { Location } from "../../../utils/queries/map"
import classes from "./styles.module.css";
import { locationBackgroundsData } from "./imports";
import { Link } from "@tanstack/react-router";

function LocationsGrid(params: {
    locations: Location[],
    sectionId: string,
    bookId: string
}) {

    return (
        <SimpleGrid cols={{sm: 1, lg: 2}} className={classes.map_grid}>{params.locations?.map((l, i) => (
        <Link 
            key={i} 
            to="/map/$bookId/section/$id/$focusedId/modal" 
            params={{focusedId: l.id, id: params.sectionId, bookId: params.bookId}} 
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
                    <Text c="black" style={{fontWeight: 'bold', fontSize: 18}}>{l.name}</Text>
                </Badge>
            </Card>
        </Link>
        ))}</SimpleGrid>
    )
}

export default LocationsGrid;
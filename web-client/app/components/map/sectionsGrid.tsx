import { Badge, Card, SimpleGrid, Text } from "@mantine/core";
import classes from "./styles.module.css";
import faeriesGarden from "../../assets/sections/fairyGardenMain.png";
import forestMain from "../../assets/sections/forestMain.png";
import swampsMain from "../../assets/sections/swampsMain.png";
import mountainsMain from "../../assets/sections/mountainsMain.png";
import snowPeaksMain from "../../assets/sections/mountainPeakMain.png";
import darkCavesMain from "../../assets/sections/darkCavesMain.png";
import cloudRealmsMain from "../../assets/sections/realmOfCloudsMain.png";
import tiralinMain from "../../assets/sections/tiralinMain.png";
import lavaCavesMain from "../../assets/sections/lavaCavesMain.png";
import darkRealmsMain from "../../assets/sections/darkRealmMain.png";
import { Link } from "@tanstack/react-router";
import { LocationSection } from "@/utils/queries/map/types";

const backgroundsData = new Map<string, string>([
  ["bd4fad88-37fd-4cd3-a6da-01424b823e40", faeriesGarden],
  ["0b2926b3-9606-4298-8b74-4f7685c11446", forestMain],
  ["43db90ee-5a3d-479e-8266-d7152da2e3ae", swampsMain],
  ["8e08da86-c39c-4b2a-ba47-4f26de77cd77", mountainsMain],
  ["70699b62-8c70-44e1-85c8-abcc14c3d888", snowPeaksMain],
  ["c2c231e3-4b75-488f-9cb8-37180136304f", darkCavesMain],
  ["e93ad43c-60cc-469f-bdca-5eb8d24c892a", cloudRealmsMain],
  ["63823939-702d-4baa-9060-452e7badbdd2", tiralinMain],
  ["976f22d1-f96f-4a73-b43e-9f60d3a02447", lavaCavesMain],
  ["120a5c00-e98b-447b-b1b5-158eb53361c9", darkRealmsMain]
]);

function SectionsGrid(params: {
    sections: LocationSection[],
    bookId: string
}) {

    return (
        <SimpleGrid cols={{sm: 1, lg: 2}} className={classes.map_grid}>{params.sections?.map((s, i) => (
        <Link key={i} to="/map/$bookId/section/$id" search={{focused: undefined}} params={{bookId: params.bookId, id: s.id}} style={{textDecoration: 'none'}}>
            <Card 
                withBorder 
                radius={0} 
                style={{
                backgroundImage: `url(${backgroundsData.get(s.id)})`, 
                backgroundSize: 'cover'
                }} className={classes.map_card_back}>
                <Badge color='white' radius={0}>
                    <Text c="black" style={{fontWeight: 'bold', fontSize: 18}}>{s.name}</Text>
                </Badge>
            </Card>
        </Link>
        ))}</SimpleGrid>
    )
}

export default SectionsGrid;
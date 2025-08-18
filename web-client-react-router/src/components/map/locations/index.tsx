import { Badge, Card, SimpleGrid, Text } from "@mantine/core"
import classes from "./styles.module.css";
import { locationBackgroundsData } from "./imports";
import { Link, Outlet, useParams } from "react-router";
import type { Location } from "@/queries/map/types";
import { useEffect, useState } from "react";
import { useLocations } from "@/queries/map/locationsQuery";
import LocationsGrid from "./grid";

function MapLocationsMain() {
    const { bookId, sectionId } = useParams();

    const [locations, setLocations] = useState<Location[] |undefined>(undefined);

    return (
    <>
        <LocationsGrid locations={locations} bookId={bookId!} sectionId={sectionId!}/>
        <LocationsLoader sectionId={sectionId!} onLoad={setLocations}/>
        <Outlet/>
    </>
    )
}

function LocationsLoader({sectionId, onLoad}: {sectionId: string, onLoad: (value: Location[]) => void}) {
    const { data } = useLocations(sectionId);

    useEffect(() => {
        if (data != undefined) {
            onLoad(data.locations)
        }
    }, [data]);

    return null;
}

export default MapLocationsMain;

import { Outlet, useParams } from "react-router";
import type { Location } from "@/queries/map/types";
import { useEffect, useState } from "react";
import { useLocations } from "@/queries/map/locationsQuery";
import LocationsGrid from "./grid";

function MapLocationsMain() {
    const { sectionId } = useParams();

    const [locations, setLocations] = useState<Location[] |undefined>(undefined);

    return (
    <>
        <LocationsGrid locations={locations}/>
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

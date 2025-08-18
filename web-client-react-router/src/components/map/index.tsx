import type { LocationSection } from "@/queries/map/types";
import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router";
import SectionsGrid from "./sectionsGrid";
import { useSections } from "@/queries/map/sectionsQuery";

function WizformsMapMain() {
    const { bookId } = useParams();

    const [sections, setSections] = useState<LocationSection[] | undefined>(undefined);

    return (
        <>
            <SectionsGrid bookId={bookId!} sections={sections}/>
            <SectionsLoader bookId={bookId!} onLoad={setSections}/>
        </>
    )
}

function SectionsLoader({ bookId, onLoad }: { bookId: string, onLoad: (sections: LocationSection[]) => void }) {
    const { data } = useSections(bookId);
    useEffect(() => {
        if (data != undefined) {
            onLoad(data.sections);
        }
    }, [data]);

    return null;
}

export default WizformsMapMain;
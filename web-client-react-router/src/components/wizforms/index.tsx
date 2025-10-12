import { useEffect, useState } from "react";
import { WizformElementType } from "../../graphql/graphql";
import type { WizformSimpleModel } from "../../queries/wizforms/types";
import { useWizforms } from "../../queries/wizforms/wizformsQuery";
import WizformsList from "./list";
import { Box, Loader, Overlay } from "@mantine/core";
import { Outlet } from "react-router";
import { useActiveBook } from "@/contexts/activeBook";
import WizformsListProvider from "@/contexts/wizformsList";

function WizformsMain() {
    const [nameFilter, setNameFilter] = useState<string>("");
    const [elementFilter, setElementFilter] = useState<WizformElementType>(WizformElementType.Air);
    const [wizforms, setWizforms] = useState<WizformSimpleModel[] | undefined>(undefined);

    return (
        <Box>
            {
                wizforms == undefined ? <Loader/> :
                <>
                    <WizformsListProvider initialItems={wizforms}>
                        <WizformsList/>
                        <Box mt="xl">
                            <Outlet/>
                        </Box>
                    </WizformsListProvider>
                </>
            }
            <WizformsLoader 
                nameFilter={nameFilter} 
                elementFilter={elementFilter} 
                onLoad={setWizforms}
            />
        </Box>
    )
}

function WizformsLoader({nameFilter, elementFilter, onLoad}: {
    nameFilter: string,
    elementFilter: WizformElementType,
    onLoad: (values: WizformSimpleModel []) => void
}) {
    const activeBook = useActiveBook();

    const { data } = useWizforms({
        bookId: activeBook?.id!, 
        enabled: true, 
        nameFilter: nameFilter, 
        elementFilter: elementFilter,
        collection: activeBook?.currentCollection!
    });

    useEffect(() => {
        if (data != undefined) {
            onLoad(data.wizforms)
        }
    }, [data])

    return null;
}

export default WizformsMain;
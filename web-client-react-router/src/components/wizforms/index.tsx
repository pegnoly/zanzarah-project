import { useEffect } from "react";
import { useWizforms } from "../../queries/wizforms/wizformsQuery";
import WizformsList from "./list";
import { Box } from "@mantine/core";
import { Outlet } from "react-router";
import { useActiveBook } from "@/contexts/activeBook";
import WizformsListProvider, { useWizformsList } from "@/contexts/wizformsList";
import WizformsFilter from "./filter";

function WizformsMain() {
    return (
        <Box>
            <WizformsListProvider>
                <WizformsList/>
                <WizformsFilter/>
                <Box mt="xl">
                    <Outlet/>
                </Box>
                <WizformsLoader/>
            </WizformsListProvider>
        </Box>
    )
}

function WizformsLoader() {
    const activeBook = useActiveBook();
    const wizformsList = useWizformsList();

    console.log("Must be realoaded? ", activeBook);

    const { data } = useWizforms({
        bookId: activeBook?.id!, 
        enabled: true, 
        nameFilter: activeBook?.currentNameFilter, 
        elementFilter: activeBook?.currentElementFilter,
        collection: activeBook?.currentCollection!
    });

    useEffect(() => {
        if (data != undefined) {
            wizformsList?.updateItems(data.wizforms);
        }
    }, [data])

    return null;
}

export default WizformsMain;
import { Badge, Card, Select } from "@mantine/core";
import { useCommonStore } from "../../stores/common";
import { useShallow } from "zustand/shallow";

function CollectionsPreview(params: {
    currentCollections: {
        id: string;
        bookId: string;
        name: string;
        description: string;
        createdOnVersion: string;
        active: boolean;
    }[] | undefined
}) {

    const [currentCollection, setCurrentCollection] = useCommonStore(useShallow((state) => [state.currentCollection, state.setCurrentCollection]));

    if (params.currentCollections != undefined) {
        setCurrentCollection(params.currentCollections.find(c => c.active)?.id!);
    }

    return <Card w="100%" h="100%">
        <Badge size="lg" radius={0}>
            Коллекции
        </Badge>
        <Select
            value={currentCollection}
            data={params.currentCollections?.map((c) => ({
                label: c.name, value: c.id 
            }))}
        />
    </Card>
}

export default CollectionsPreview;
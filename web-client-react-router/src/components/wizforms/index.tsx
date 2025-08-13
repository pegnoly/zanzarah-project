import { useEffect, useState } from "react";
import { WizformElementType } from "../../graphql/graphql";
import type { WizformSimpleModel } from "../../queries/wizforms/types";
import { useWizforms } from "../../queries/wizforms/wizformsQuery";
import WizformsList from "./list";

function WizformsMain() {
    const [nameFilter, setNameFilter] = useState<string>("");
    const [elementFilter, setElementFilter] = useState<WizformElementType>(WizformElementType.None);
    const [wizforms, setWizforms] = useState<WizformSimpleModel[] | undefined>(undefined);

    return (
        <>
            <WizformsList models={wizforms}/>
            <WizformsLoader 
                nameFilter={nameFilter} 
                elementFilter={elementFilter} 
                onLoad={setWizforms}/>
        </>
    )
}

function WizformsLoader({nameFilter, elementFilter, onLoad}: {
    nameFilter: string,
    elementFilter: WizformElementType,
    onLoad: (values: WizformSimpleModel []) => void
}) {
    const { data } = useWizforms({
        bookId: '5a5247c2-273b-41e9-8224-491e02f77d8d', 
        enabled: true, 
        nameFilter: nameFilter, 
        elementFilter: elementFilter,
        collection: null
    });

    useEffect(() => {
        if (data != undefined) {
            onLoad(data.wizforms)
        }
    }, [data])

    return null;
}

export default WizformsMain;
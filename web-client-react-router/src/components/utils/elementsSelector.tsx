import { Select } from "@mantine/core";
import { useActiveBook } from "@/contexts/activeBook";
import type { WizformElementType } from "@/graphql/graphql";

function ElementsSelector({label, current, selectedCallback} : {
    label: string, 
    current: WizformElementType, 
    selectedCallback: (value: WizformElementType) => void
}) {

    const activeBook = useActiveBook();

    return <>
        <Select
            // disabled={params.disabled} 
            label={label}
            value={current}
            onChange={(value) => selectedCallback(value as WizformElementType)}
            data={activeBook?.elements?.filter(element => element.enabled).map((element, _index) => ({
                label: element.name, value: element.element
            }))}
        />
    </>
}

export default ElementsSelector;
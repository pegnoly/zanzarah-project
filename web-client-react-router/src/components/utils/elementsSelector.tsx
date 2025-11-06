import { Select } from "@mantine/core";
import { useActiveBook } from "@/contexts/activeBook";
import { WizformElementType } from "@/graphql/graphql";

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
            data={[{label: "Все стихии", value: WizformElementType.None}].concat(activeBook?.elements?.filter(element => element.enabled && element.element != WizformElementType.None).map((element, _index) => ({
                label: element.name, value: element.element
            }))!)}
        />
    </>
}

export default ElementsSelector;
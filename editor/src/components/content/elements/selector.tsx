import { Select } from "@mantine/core";
import useElementsStore from "./store";
import { WizformElementType } from "../wizforms/types";

function ElementsSelector(params: {
    current: WizformElementType,
    disabled: boolean,
    label: string,
    selectedCallback: (value: WizformElementType) => void
}) {
    const elements = useElementsStore(state => state.elements);

    return <>
        <Select
            disabled={params.disabled} 
            label={params.label}
            value={params.current}
            onChange={(value) => params.selectedCallback(value as WizformElementType)}
            data={elements.filter(element => element.enabled).map((element, _index) => ({
                label: element.name, value: element.element
            }))}
        />
    </>
}

export default ElementsSelector;
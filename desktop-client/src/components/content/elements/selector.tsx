import { Select } from "@mantine/core";
import { WizformElementType } from "../../types";
import useElementsStore from "./store";

function ElementsSelector(params: {
    current: WizformElementType,
    disabled: boolean,
    selectedCallback: (value: WizformElementType) => void
}) {
    const elements = useElementsStore(state => state.elements);

    return <>
        <Select
            disabled={params.disabled} 
            label="Magic element of wizform"
            value={params.current}
            onChange={(value) => params.selectedCallback(value as WizformElementType)}
            data={elements.filter(element => element.enabled).map((element, _index) => ({
                label: element.name, value: element.element
            }))}
        />
    </>
}

export default ElementsSelector;
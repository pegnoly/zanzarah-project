import { useShallow } from "zustand/shallow";
import useWizformsStore from "./store";
import { Group, TextInput } from "@mantine/core";
import ElementsSelector from "../elements/selector";

function WizformsFilters() {
    const [elementFilter, nameFilter, setElementFilter, setNameFilter] = useWizformsStore(useShallow((state) => [
        state.elementFilter,
        state.nameFilter,
        state.setElementFilter,
        state.setNameFilter
    ]));

    return <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center'}}>
        <Group>
            <ElementsSelector 
                current={elementFilter} 
                selectedCallback={setElementFilter} 
                disabled={false}
                label="Filter wizforms element"
            />
            <TextInput
                value={nameFilter}
                onChange={(event) => setNameFilter(event.currentTarget.value)}
                label="Filter wizforms name"
            />
        </Group>
    </div>
}

export default WizformsFilters;
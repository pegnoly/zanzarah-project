import { SegmentedControl, Select } from "@mantine/core";
import useContentStore, { ContentType } from "./store";
import { useShallow } from "zustand/shallow";

function ContentTypeSwitcher() {
    const [currentType, setCurrentType] = useContentStore(useShallow((state) => [state.currentType, state.changeCurrentType]));

    return <>
        <SegmentedControl
            value={currentType}
            onChange={(value) => setCurrentType(value as ContentType)}
            data={[
                { label: 'Wizforms', value: ContentType.Wizforms },
                { label: 'Elements', value: ContentType.Elements}
            ]}
        />
    </>
}

export default ContentTypeSwitcher;
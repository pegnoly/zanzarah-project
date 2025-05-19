import { create } from "zustand"

export enum ContentType {
    Wizforms = "CONTENT_TYPE_WIZFORMS",
    Elements = "CONTENT_TYPE_ELEMENTS"
}

type Data = {
    currentType: ContentType
}

type Action = {
    changeCurrentType: (value: ContentType) => void
}

const useContentStore = create<Data & Action>((set) => ({
    currentType: ContentType.Wizforms,
    changeCurrentType(value) {
        set({currentType: value});
    },
}));

export default useContentStore;
import { create } from "zustand"
import { WizformElementType } from "../components/types"
import { invoke } from "@tauri-apps/api/core"

type WizformTransferModel = {
    id: string,
    icon: string,
    number: number,
    name: string,
    element: WizformElementType,
    enabled: boolean
}

type State = {
    names: Map<string, string>,
    icons: Map<string, string>,
    elements: Map<string, WizformElementType>,
    numbers: Map<string, number>,
    enabled: Map<string, boolean>,
    ids_to_render: string[],
    element_filter: number,
    name_filter: string
}

type Action = {
    load: (book_id: string) => void,
    get_name: (id: string) => string | undefined,
    get_icon: (id: string) => string | undefined,
    update_element_filter: (element: number) => void,
    update_name_filter: (name: string) => void,
    get_evolution_name: (form: number) => string,
    is_enabled: (id: string) => boolean
    //update: (wizform: Wizform) => void
}

export const useWizformStore = create<State & Action>((set, get) => ({
    names: new Map<string, string>(),
    icons: new Map<string, string>(),
    elements: new Map<string, number>(),
    numbers: new Map<string, number>(),
    enabled: new Map<string, boolean>(),

    ids_to_render: [],

    element_filter: WizformElementType.Nature,
    name_filter: "",

    async load(book_id) {
        await invoke("load_wizforms", {bookId: book_id})
            .then((value) => {
                let names_transfered = new Map<string, string>();
                let icons_transfered = new Map<string, string>();
                let elements_transfered = new Map<string, number>();
                let numbers_transfered = new Map<string, number>();
                let enabled_transfered = new Map<string, boolean>();
                let ids_transfered: string[] = [];
                (value as WizformTransferModel[]).map((model, _) => {
                    names_transfered.set(model.id, model.name);
                    icons_transfered.set(model.id, model.icon);
                    elements_transfered.set(model.id, model.element);
                    numbers_transfered.set(model.id, model.number);
                    enabled_transfered.set(model.id, model.enabled);
                    ids_transfered.push(model.id)
                });
                const ids_sorted = ids_transfered.sort((v1, v2) => numbers_transfered.get(v1)! < numbers_transfered.get(v2)! ? -1 : 1).filter((v) => elements_transfered.get(v) == get().element_filter);
                set({names: names_transfered, icons: icons_transfered, elements: elements_transfered, numbers: numbers_transfered, enabled: enabled_transfered, ids_to_render: ids_sorted});
            });
    },

    get_name(id) {
        return get().names.get(id)
    },

    get_icon(id) {
        return get().icons.get(id)
    },

    update_element_filter(element) {
        set({element_filter: element});

        let updated_ids_to_render: string[] = [] 
        get().names.forEach((name, id) => {
            if ((get().elements.get(id) == element || get().element_filter == -1) && (name.includes(get().name_filter) || get().name_filter == "")) {
                updated_ids_to_render.push(id);
            } 
        });

        const ids_sorted = updated_ids_to_render.sort((v1, v2) => get().numbers.get(v1)! < get().numbers.get(v2)! ? -1 : 1);
        set({ids_to_render: ids_sorted})
    },

    update_name_filter(filter) {
        set({name_filter: filter});

        //console.log(`Element filter is ${get().element_filter}, name is ${filter}`);

        let updated_ids_to_render: string[] = [] 
        get().names.forEach((name, id) => {
            //console.log("Name: ", name);
            if ((get().elements.get(id) == get().element_filter || get().element_filter == -1) && (name.includes(filter) || filter == "")) {
                //console.log("True for ", name);
                updated_ids_to_render.push(id);
            } 
        });

        const ids_sorted = updated_ids_to_render.sort((v1, v2) => get().numbers.get(v1)! < get().numbers.get(v2)! ? -1 : 1);
        set({ids_to_render: ids_sorted})
    },
    // async update(wizform) {
    //     await invoke("update_wizform", {wizform: wizform})
    //         .then((updated_wizform) => {
    //             const updatedWizforms = get().wizforms
    //         })
    // },
    get_evolution_name(form) {
        let evolution_id = "";
        for(let entry of get().numbers) {
            if (entry[1] == form) {
                evolution_id = entry[0];
                break
            }
        }
        return get().names.get(evolution_id)!;
    },

    is_enabled(id) {
        return get().enabled.get(id)!
    },
}));
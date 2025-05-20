import { Checkbox, Skeleton, Stack, Text } from "@mantine/core"
import { UUID } from "crypto"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { invoke } from "@tauri-apps/api/core"
import ElementsSelector from "../elements/selector"
import useWizformsStore from "./store"
import { WizformElementType } from "./types"

export type WizformEditableModel = {
    id: UUID,
    enabled: boolean,
    name: string,
    description: string,
    element: WizformElementType
}

function WizformFocused(params: {
    updateCallback: (value: WizformEditableModel) => void
}) {
    const {id} = useParams()
    const [wizform, setWizform] = useState<WizformEditableModel | null>(null);
    const setSelectedWizform = useWizformsStore(state => state.setCurrentId)

    useEffect(() => {
        if (id != undefined) {
            loadWizform();
            setSelectedWizform(id);
        }
    }, [id]);

    const loadWizform = async() => {
        await invoke<WizformEditableModel>("load_wizform_for_edit", {id: id})
            .then((value) => setWizform(value));
    }

    async function updateEnabled(value: boolean) {
        setWizform({...wizform!, enabled: value});
        params.updateCallback({...wizform!, enabled: value});
        await invoke("update_wizform_display_status", {id: wizform?.id, enabled: value});
    }

    async function updateElement(value: WizformElementType) {
        setWizform({...wizform!, element: value});
        params.updateCallback({...wizform!, element: value});
        await invoke("update_wizform_element", {id: wizform?.id, element: value});
    }

    return <div style={{width: '65%', height: '100%', display: 'flex', flexDirection: 'column', paddingLeft: '3%', alignItems: 'center'}}>{
        wizform == null ?
        <Skeleton/> :
        <>
            <Text style={{fontFamily: 'fantasy', letterSpacing: 2, fontSize: 25}}>{wizform.name}</Text>
            <Checkbox 
                style={{alignSelf: 'flex-start', paddingLeft: '5%', fontFamily: 'cursive', fontSize: 15}}
                checked={wizform?.enabled}
                onChange={(e) => updateEnabled(e.target.checked)}
                label="Display for users"
            />
            <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'row', paddingTop: '5%'}}>
                <div style={{width: '50%', justifyItems: 'center'}}>
                    <Stack>
                        <Text style={{fontFamily: 'cursive', fontWeight: 'bold', fontSize: 18}}>Description</Text>
                        <Text style={{fontFamily: 'cursive', fontSize: 15}}>{wizform.description}</Text>
                    </Stack>
                </div>
                <div style={{width: '50%', justifyItems: 'center'}}>
                    <Stack>
                        <Text style={{fontFamily: 'cursive', fontWeight: 'bold', fontSize: 18}}>Element</Text>
                        <ElementsSelector
                            current={wizform.element}
                            disabled={false}
                            label="Magic element of wizform"
                            selectedCallback={updateElement}
                        />
                    </Stack>
                </div>
            </div>
        </>
    }</div>
}

export default WizformFocused;
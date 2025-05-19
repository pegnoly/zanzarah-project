import { Checkbox, Skeleton, Stack, Text } from "@mantine/core"
import { UUID } from "crypto"
import { useParams } from "react-router-dom"
import { WizformElementType } from "../../types"
import { useEffect, useState } from "react"
import { invoke } from "@tauri-apps/api/core"
import ElementsSelector from "../elements/selector"

export type WizformEditableModel = {
    id: UUID,
    enabled: boolean,
    name: string,
    description: string,
    element: WizformElementType
}

function WizformFocused() {
    const {id} = useParams()
    const [wizform, setWizform] = useState<WizformEditableModel | null>(null);

    useEffect(() => {
        if (id != undefined) {
            loadWizform();
        }
    }, [id]);

    const loadWizform = async() => {
        await invoke<WizformEditableModel>("load_wizform_for_edit", {id: id})
            .then((value) => setWizform(value));
    }

    async function updateEnabled(value: boolean) {
        setWizform({...wizform!, enabled: value});
    }

    async function updateElement(value: WizformElementType) {
        setWizform({...wizform!, element: value});
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
                            selectedCallback={updateElement}
                        />
                    </Stack>
                </div>
            </div>
{/*                 
                <Typography.Text 
                    style={{fontFamily: 'monospace', fontSize: 17, textAlign: 'center', paddingBottom: 5}}
                >Основные параметры</Typography.Text>

                <Row>
                    <Col style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}  span={12}>
                        <Typography.Text style={{fontFamily: 'cursive', fontSize: 14, paddingRight: 15}}>Имя:</Typography.Text>
                        <Typography.Text style={{fontSize: 14, width: '70%', textAlign: 'center'}} editable={{
                            onChange: (newText) => {handleNameUpdate(newText)}
                        }}>{name}</Typography.Text>
                    </Col>
                    <Col style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}  span={12}>
                            <Typography.Text style={{fontFamily: 'cursive'}}>Стихия:</Typography.Text>
                            <Select
                                style={{width: '50%', paddingLeft: 15}}
                                disabled={!elementSelectionEnabled} 
                                defaultValue={currentElement}
                                value={currentElement}
                                onChange={(e) => handleElementUpdate(e)}
                            >
                            {schema.elements.filter((e) => e.enabled).map((e, index) => (
                                <Select.Option key={index} value={e.element}>{e.name}</Select.Option>
                            ))}</Select>
                            <Button
                                type="link"
                                style={{
                                    color: elementSelectionEnabled ? "red" : "blue"
                                }}
                                shape="default"
                                icon={<EditOutlined/>}
                                onClick={() => setElementSelectionEnabled(!elementSelectionEnabled)}
                            />
                    </Col>
                </Row>

                <Typography.Text 
                    style={{fontFamily: 'monospace', fontSize: 17, textAlign: 'center', paddingBottom: 5}}
                >Описание</Typography.Text>

                <Typography.Text editable={{
                        onChange: (newText) => {handleDescUpdate(newText)}
                    }}>{desc}</Typography.Text> */}
        </>
    }</div>
}

export default WizformFocused;
import { Input, Modal, Select, Space, Typography } from "antd"
import { MagicElement, Wizform } from "../types"
import { useEffect, useState } from "react"

interface WizformEditorSchema {
    wizform: Wizform | null,
    callbackOk: () => void,
    callbackCancel: () => void,
    elements: MagicElement[]
}

export function WizformEditor(schema: WizformEditorSchema) {

    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        setOpen(schema.wizform == null ? false : true);
    }, [schema.wizform])

    return (
        <>
            <Modal 
                open={open}
                onOk={schema.callbackOk}
                onCancel={schema.callbackCancel}
                onClose={schema.callbackCancel}>
                <Typography.Text>Изменить имя феи</Typography.Text>
                <Input value={schema.wizform?.name}></Input>
                <Space direction="vertical">
                    <Typography.Text>Изменить стихию феи</Typography.Text>
                    <Select value={schema.wizform?.element}>{
                        schema.elements.filter((e) => e.enabled).map((e, index) => (
                            <Select.Option key={index} value={e.element}>{e.name}</Select.Option>
                        ))
                    }</Select>
                </Space>
            </Modal>
        </>
    )
}
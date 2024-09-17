import { Typography } from "antd"

interface WizformListItemSchema {
    name: string,
    icon64: string
}

export function WizformListItem(schema: WizformListItemSchema) {
    return (
        <>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 5}}>
                <img width={40} height={40} src={`data:image/bmp;base64,${schema.icon64}`}/>
                <Typography.Text style={{paddingLeft: 15}}>{schema.name}</Typography.Text>
            </div>
        </>
    )
}
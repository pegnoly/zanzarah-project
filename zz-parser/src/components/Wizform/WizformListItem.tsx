import { Typography } from "antd"
import { useWizformStore } from "../../stores/Wisform"
import { useShallow } from "zustand/shallow"

interface WizformListItemSchema {
    id: string
}

export function WizformListItem(schema: WizformListItemSchema) {

    const [getName, getIcon] = useWizformStore(useShallow((state) => [state.get_name, state.get_icon]));

    return (
        <>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 5}}>
                <img width={40} height={40} src={`data:image/bmp;base64,${getIcon(schema.id)}`}/>
                <Typography.Text style={{paddingLeft: 15}}>{getName(schema.id)}</Typography.Text>
            </div>
        </>
    )
}
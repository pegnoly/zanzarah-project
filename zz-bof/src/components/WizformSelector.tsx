import { Typography } from "antd";
import { Link } from "react-router-dom";
import { WizformFilterMenu } from "./WizformFilterMenu";

import { List } from "antd";
import { useWizformStore } from "../stores/Wizform";
import { useShallow } from "zustand/shallow";

export function WizformSelector() {

    const [idsToRender, getName, getIcon, isEnabled] = useWizformStore(useShallow((state) => [state.ids_to_render, state.get_name, state.get_icon, state.is_enabled]));

    return (
        <>
            <div>
                <WizformFilterMenu/>
                <List>
                    {idsToRender.filter((id) => isEnabled(id) == true).map((id, index) => (
                    <List.Item key={index}>
                        <Link style={{width: '100%'}} key={index} to={`focus/${id}`}>
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                <img width={40} height={40} src={`data:image/bmp;base64,${getIcon(id)}`} style={{paddingLeft: '2%'}}></img>
                                <Typography.Text style={{paddingLeft: '3%'}}>{getName(id)}</Typography.Text>
                            </div>
                        </Link>      
                        </List.Item>
                    ))}            
                </List>
            </div>
        </>
    )
}
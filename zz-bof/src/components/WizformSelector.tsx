import { List, Space, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";

export function WizformSelector({wizforms} : {wizforms: Wizform[]}) {

    const nav = useNavigate();

    return (
        <>
            <Space direction="vertical">
                <List>
                    {wizforms?.filter((w) => w.hitpoints == 500).map((w, index) => (
                        <div key={index}>
                            <Link style={{width: "100%"}} to={`focus/${w.id}`}>
                                <Typography.Text>{w.name}</Typography.Text>
                            </Link>
                        </div>
                    ))}
                </List> 
            </Space>
        </>
    )
}
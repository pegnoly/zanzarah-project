import { Space, Typography } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export function WizformFocused(
    {wizforms}: {wizforms: Wizform[]}
) {

    const [wizform, setWizform] = useState<Wizform | undefined>(undefined);

    const {id} = useParams();

    useEffect(() => {
        setWizform(wizforms.find((w) => w.id == id))
    }, [id])

    return (
        <>
            <Space direction="vertical">
                <Typography.Text>{wizform?.name}</Typography.Text>
                <Typography.Text>Уровень жизни</Typography.Text>
                <Typography.Text>{wizform?.hitpoints}</Typography.Text>
                <Typography.Text>Ловкость</Typography.Text>
                <Typography.Text>{wizform?.agility}</Typography.Text>
                <Typography.Text>Прыгучесть</Typography.Text>
                <Typography.Text>{wizform?.jump_ability}</Typography.Text>
                <Typography.Text>Меткость</Typography.Text>
                <Typography.Text>{wizform?.precision}</Typography.Text>
            </Space>
        </>
    )
}
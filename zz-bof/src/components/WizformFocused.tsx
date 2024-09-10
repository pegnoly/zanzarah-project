import { Typography } from "antd";
import { useParams } from "react-router-dom";

export function WizformFocused(
    {wizforms}: {wizforms: Wizform[]}
) {

    const {id} = useParams();

    console.log("here id is: ", id);

    return (
        <>
            <Typography.Text>{wizforms.find((w) => w.id == id)?.name}</Typography.Text>
        </>
    )
}
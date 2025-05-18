import { Text } from "@mantine/core";
import { Link } from "@tanstack/react-router";

function WizformsPreview() {

    return <Link to="/wizforms" search>
        <div style={{display: 'flex', backgroundColor: 'green'}}>
            <h1>Wizforms</h1>
        </div>
    </Link>
}

export default WizformsPreview;
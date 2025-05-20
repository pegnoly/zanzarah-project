import { Card, List, Image, Text } from "@mantine/core";
import { WizformSimple } from "./core";
import { Link } from "react-router-dom";
import useWizformsStore from "./store";
import WizformsFilters from "./filters";
import { UUID } from "crypto";

function WizformsList(params: {
    models: WizformSimple[]
}) {
    const selected = useWizformsStore(state => state.currentSelectedId);

    return <div style={{width: '35%', height: '100%'}}>
        <div style={{width: '100%', height: '100%'}}>
            <div style={{height: '10%'}}>
                <WizformsFilters/>
            </div>
            <div style={{height: '90%', overflow: 'auto'}}>
                <List>{params.models.map((wizform, index) => (
                    <Link key={index} style={{textDecoration: 'none'}} to={`focused/${wizform.id}`}>
                        <Card shadow='sm' padding='lg' withBorder bg={GetCardBackgroundColor(wizform, selected)}>
                            <Card.Section w={40} h={40} style={{position: 'absolute', top: '50%', right: '8%'}}>
                                <Image width={40} height={40} src={`data:image/bmp;base64,${wizform.icon64}`}></Image>
                            </Card.Section>
                            <div style={{width: '80%'}}>
                                <Text size='md' lineClamp={1}>{wizform.name}</Text>
                            </div>
                        </Card>
                    </Link>
                ))}</List>
            </div>
        </div>
    </div>
}

function GetCardBackgroundColor(wizform: WizformSimple, selected: UUID | null) {
    if (selected) {
        if (wizform.id == selected) {
            return "lime"
        } else {
            if (wizform.enabled) {
                return "white"
            } else {
                return "grey"
            }
        }
    } else {
        if (wizform.enabled) {
            return "white"
        } else {
            return "grey"
        }
    }
}

export default WizformsList;
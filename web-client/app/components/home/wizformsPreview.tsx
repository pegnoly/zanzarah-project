import { Badge, Card, Text } from "@mantine/core";
import { Link } from "@tanstack/react-router";

function WizformsPreview(params: {
    currentBookId: string | undefined,
    wizformsCount: number | undefined,
    activeWizformsCount: number | undefined
}) {
    return (
        <Link disabled={params.currentBookId == undefined} to="/wizforms/$bookId" params={{bookId: params.currentBookId!}} style={{textDecoration: 'none'}}>
            <Card w='100%' h='100%' withBorder>
                <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                    <Badge
                        size="lg"
                        h="50%"
                        radius={0}
                        bg="grape"
                    >
                        Список фей активной книги
                    </Badge>
                    <div style={{display: 'flex', justifyContent: 'end', gap: '4%', paddingTop: '5%'}}>
                        <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.5rem'}}>Доступных фей: </Text>
                        <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.5rem', color: "green"}}>{params.activeWizformsCount}</Text>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'end', gap: '4%'}}>
                        <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.5rem'}}>Технических фей: </Text>
                        <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.5rem', color: "red"}}>{(params.wizformsCount! - params.activeWizformsCount!)}</Text>
                    </div>
                </div>
            </Card>
        </Link>
    )
}

export default WizformsPreview;
import { useActiveBook } from "@/contexts/activeBook";
import { Badge, Card, Text } from "@mantine/core";
import { Link } from "react-router";
import { CurrentBookStore } from "@/stores/currentBook";

function WizformsPreview() {
    const activeBook = useActiveBook();

    const wizformsCount = CurrentBookStore.useWizformsCount();
    const activeWizformsCount = CurrentBookStore.useActiveWizformsCount();

    return (
        <>
            <Link  to={`wizforms/${activeBook?.id}`} style={{textDecoration: 'none', pointerEvents: activeBook?.id == undefined ? "none" : "auto"}}>
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
                            {
                                activeWizformsCount == undefined ?
                                <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.5rem', color: "red"}}>Не определено</Text> :
                                <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.5rem', color: "green"}}>{activeWizformsCount}</Text>
                            }
                        </div>
                        <div style={{display: 'flex', justifyContent: 'end', gap: '4%'}}>
                            <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.5rem'}}>Технических фей: </Text>
                            {
                                wizformsCount == undefined ?
                                <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.5rem', color: "red"}}>Не определено</Text> :
                                <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.5rem', color: "red"}}>{(wizformsCount - activeWizformsCount!)}</Text>
                            }
                        </div>
                    </div>
                </Card>
            </Link>
        </>
    )
}

export default WizformsPreview;
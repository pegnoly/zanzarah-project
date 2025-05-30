import { Badge, Card, Divider, Text } from "@mantine/core";
import { Link } from "@tanstack/react-router";

function MapPreview(params: {
    bookId: string | undefined
}) {
    return (
        <Link 
            disabled={params.bookId == undefined} 
            to="/map/$bookId" 
            params={{bookId: params.bookId!}} 
            style={{display: 'flex', width: '100%', height: '100%', textDecoration: 'none', overflow: 'hidden'}}
        >
            <Card w="100%" h="100%" withBorder radius={0}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <Badge
                        size="lg"
                        h="100%"
                        radius={0}
                        bg="indigo"
                    >
                        Карта мест обитания фей
                    </Badge>
                    <div style={{paddingTop: '3%'}}>
                        <MapInfo/>
                    </div>
                </div>
            </Card>
        </Link>
    )
}

function MapInfo() {
    return (
    <>
        <Text 
            style={{fontFamily: 'Comfortaa', fontSize: '1rem', fontWeight: 'bold', paddingBottom: '1%'}}
        >Карта содержит список всех зон и локаций Занзары и позволяет узнать, какие феи могут быть на них найдены.</Text>
        <Divider/>
        <Text 
            style={{fontFamily: 'Comfortaa', fontSize: '1rem', fontWeight: 'bold', paddingTop: '1%'}}
        >В отличие от остальных компонентов, карта не генерируется автоматически, а заполняется вручную. 
        Принять участие в данном проекте может любой желающий. Связаться с автором по этому вопросу можно по контактам ниже</Text>
    </>
    )
}

export default MapPreview;
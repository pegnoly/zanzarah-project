import { Badge, Button, Popover, Select, Text } from "@mantine/core";
import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";

export const setBookCookie = createServerFn({method: 'POST'})
    .validator((book: string) => book)
    .handler(async({data}) => {
        setCookie('zanzarah-project-current-book', data, {maxAge: 10000000})
    });

export const getBookCookie = createServerFn({method: 'GET'})
    .handler(async() => {
        const bookCookie = getCookie('zanzarah-project-current-book');
        return bookCookie;
    })

function BooksPreview(params: {
    currentBookId: string | undefined,
    currentBookName: string | undefined,
    currentBookVersion: string | undefined,
    
    books: {
        id: string;
        name: string;
    }[] | undefined;
}) {
    return <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <Badge
                size="lg"
                radius={0}
                bg="orange"
            >
                Доступные книги
            </Badge>
            <BookSelector books={params.books} current={params.currentBookId}/>
        </div>
        <div style={{display: 'flex', justifyContent: 'end', gap: '4%', paddingTop: '5%'}}>
            <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.5rem'}}>Активная книга: </Text>
            {
                params.currentBookId == undefined ?
                <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.5rem', color: 'red'}}>Не выбрана</Text> :
                <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.5rem', color: 'green'}}>{params.currentBookName}</Text>
            }
        </div>
        <div style={{display: 'flex', justifyContent: 'end', gap: '4%'}}>
            <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.5rem'}}>Текущая версия: </Text>
            {
                params.currentBookId == undefined ?
                <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.5rem', color: 'red'}}>Не определено</Text> :
                <Text 
                    style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.5rem', color: 'green'}}
                >
                    {`${params.currentBookVersion}`}
                </Text>
            }
        </div>
    </div>
}

function BookSelector(params: {
    books: {
        id: string,
        name: string,
    }[] | undefined,

    current: string | undefined
}) {
    return <Popover>
        <Popover.Target>
            <Button>Выбрать книгу</Button>
        </Popover.Target>
        <Popover.Dropdown>
            <Select
                label="Список книг"
                placeholder="Выберите активную книгу"
                value={params.current}
                data={params.books?.map((book) => ({label: book.name, value: book.id}))}
            />
        </Popover.Dropdown>
    </Popover>
}

export default BooksPreview;
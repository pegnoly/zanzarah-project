import { useActiveBook } from "@/contexts/activeBook";
import { fetchBook, fetchBooks, type BookSimpleModel } from "@/queries/books";
import { CurrentBookStore } from "@/stores/currentBook";
import { Badge, Button, Popover, Select, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

function BooksPreview() {
    const [books, setBooks] = useState<BookSimpleModel [] | undefined>(undefined);
    return (
    <>
        <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <Badge
                    size="lg"
                    radius={0}
                    bg="orange"
                >
                    Доступные книги
                </Badge>
                {
                    books == undefined ? null : <BookSelector books={books}/>
                }
            </div>
            <CurrentBook/>
        </div>
        <BooksLoader onLoad={setBooks}/>
    </>
    )
}

function BookSelector({books}: {books: BookSimpleModel[]}) {
    const activeBook = useActiveBook();

    async function bookSelected(value: string | null) {
        if (value) {
            activeBook?.updateId(value);
        }
    }

    return <Popover>
        <Popover.Target>
            <Button radius={0}>Выбрать книгу</Button>
        </Popover.Target>
        <Popover.Dropdown>
            <Select
                radius={0}
                label="Список книг"
                placeholder="Выберите активную книгу"
                value={activeBook?.id}
                onChange={bookSelected}
                data={books?.map((book) => ({label: book.name, value: book.id}))}
            />
        </Popover.Dropdown>
    </Popover>
}

function CurrentBook() {
    const activeBook = useActiveBook(); 
    const name = CurrentBookStore.useName();
    const version = CurrentBookStore.useVersion();

    return (
        <>
            <div style={{display: 'flex', justifyContent: 'end', gap: '4%', paddingTop: '5%'}}>
                <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.5rem'}}>Активная книга: </Text>
                {
                    name == undefined ?
                    <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.5rem', color: 'red'}}>Не выбрана</Text> :
                    <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.5rem', color: 'green'}}>{name}</Text>
                }
            </div>
            <div style={{display: 'flex', justifyContent: 'end', gap: '4%'}}>
                <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.5rem'}}>Текущая версия: </Text>
                {
                    version == undefined ?
                    <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.5rem', color: 'red'}}>Не определено</Text> :
                    <Text 
                        style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.5rem', color: 'green'}}
                    >
                        {version}
                    </Text>
                }
            </div>
            {
                (activeBook == undefined || activeBook.id == undefined) ? null : <BookLoader id={activeBook.id}/> 
            }
        </>
    )
}

function useBooks() {
    return useQuery({
        queryKey: ['books'],
        queryFn: async() => {
            return fetchBooks({available: true});
        }
    })
}

function BooksLoader({onLoad}: {onLoad: (data: BookSimpleModel[]) => void}) {
    const { data } = useBooks();
    useEffect(() => {
        if (data != undefined) {
            onLoad(data.books);
        }
    }, [data]);

    return null;
}

function useCurrentBook(id: string) {
    return useQuery({
        queryKey: ['current_book', id],
        queryFn: async() => {
            return fetchBook({id: id});
        }
    })
}

export function BookLoader({id}: {id: string}) {
    const actions = CurrentBookStore.useActions();
    const { data } = useCurrentBook(id);
    useEffect(() => {
        if (data != undefined) {
            actions.loadBook(data.currentBook!);
        }
    }, [data]);

    return null;
}

export default BooksPreview;
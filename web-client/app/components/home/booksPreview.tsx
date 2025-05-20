import { Select } from "@mantine/core";
import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { useCommonStore } from "../../stores/common";

const setBook = createServerFn({method: 'POST'})
    .validator((book: string) => book)
    .handler(async({data}) => {
        setCookie('zanzarah-project-current-book', data, {maxAge: 10000000})
    });

export const getBook = createServerFn({method: 'GET'})
    .handler(async() => {
        const bookCookie = getCookie('zanzarah-project-current-book');
        return bookCookie;
    })

function BooksPreview() {
    const current = useCommonStore(state => state.currentBook);

    return <div style={{position: 'absolute'}}>
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <Select
                value={current}
                onChange={(value) => setBook({data: value!})}
                data={[{value: 'sjfksdjfksd', label: 'test book 1'}, {value: 'bcvbtre54t643', label: 'test book 2'}]}
            />
        </div>
    </div>
}

export default BooksPreview;
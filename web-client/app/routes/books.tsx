import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/books')({
    component: BooksComponent
})

function BooksComponent() {
    return <>
        <h1>Books</h1>
    </>
}
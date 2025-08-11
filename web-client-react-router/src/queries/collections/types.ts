export type CollectionModel = {
    id: string,
    bookId: string,
    name: string,
    description: string | null,
    createdOnVersion: string,
    active: boolean,
    entriesCount: number
}
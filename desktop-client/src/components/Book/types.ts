import { UUID } from "crypto"

/**
 * Represents a book instance modder can edit.
 * @param id - id of a book in the database
 * @param name - displayable book name
 * @param directory - directory of game this book build upon
 * @param initialized - book becomes initialized only after correct parsing of game files
 * @param downloadadble - indicates that book can or can't be downloaded with mobile app                                                                                                                        
 */
export type Book = {
    id: UUID,
    name: string,
    directory: string,
    initialized: boolean,
    available: boolean
}
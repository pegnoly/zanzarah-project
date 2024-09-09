export enum WizformElementType {
    None,
    NeutralOne,
    Nature,
    Air,
    Water,
    Light,
    Energy,
    Psi,
    Stone,
    Ice,
    Fire,
    Dark,
    Chaos,
    Metal,
    NeutralTwo,
    Custom1,
    Custom2,
    Custom3,
    Custom4,
    Custom5
}

export type Wizform = {
    id: string,
    name: string,
    element: number,
    enabled: boolean
}

export type MagicElement = {
    id: string,
    name: string,
    element: number,
    enabled: boolean
}

/**
 * Represents a book instance modder can edit.
 * @param id - id of a book in the database
 * @param name - displayable book name
 * @param directory - directory of game this book build upon
 * @param initialized - book becomes initialized only after correct parsing of game files
 * @param downloadadble - indicates that book can or can't be downloaded with mobile app                                                                                                                        
 */
export type Book = {
    id: string,
    name: string,
    directory: string,
    initialized: boolean,
    downloadadble: boolean
}    
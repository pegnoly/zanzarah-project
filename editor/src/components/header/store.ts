import { UUID } from "crypto"
import { create } from "zustand"

type Data = {
    currentBookId: UUID | null
}

type Action = {
    setCurrentBookId: (newId: UUID) => void
}

const booksStore = create<Data & Action>((set) => ({
  currentBookId: null,
  setCurrentBookId(newId) {
      set({currentBookId: newId})
  },  
}))

export default booksStore;
import { createFileRoute } from '@tanstack/react-router'
import BooksPreview from '../components/home/booksPreview'
import { Box } from '@mantine/core'

export const Route = createFileRoute('/books')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Box bg="blue">
    <h1>Books</h1>
          {/* <BooksPreview 
            // currentBookId={data.currentBook?.id} 
            // currentBookName={data.currentBook?.id} 
            // currentBookMajorVersion={data.currentBook?.majorVersion}
            // currentBookMinorVersion={data.currentBook?.minorVersion}
            // currentBookPatchVersion={data.currentBook?.patchVersion} 
            // books={data.books}
          /> */}
      </Box>
}

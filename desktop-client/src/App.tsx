import { invoke } from "@tauri-apps/api/core";
import { Button, MantineProvider } from "@mantine/core";
import BooksMain from "./components/Book/main";
import AuthMain from "./components/auth/main";

function App() {

    async function test() {
        await invoke("test");
    }

    return (
        <MantineProvider>
            {/* <AppStateProvider>
                <BooksFacade/>
            </AppStateProvider> */}
            <Button onClick={() => test()}>123</Button>
            <AuthMain/>
            <BooksMain/>
        </MantineProvider>
    );
}

export default App;

import { Button } from "antd";
import { BooksFacade } from "./components/Book/BooksFacade";
import AppStateProvider from "./contexts/AppState";
import { invoke } from "@tauri-apps/api/core";

function App() {

    async function test() {
        await invoke("start_parsing");
    }

    return (
        <>
            {/* <AppStateProvider>
                <BooksFacade/>
            </AppStateProvider> */}
            <Button onClick={() => test()}>123</Button>
        </>
    );
}

export default App;

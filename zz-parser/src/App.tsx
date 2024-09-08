import { BooksFacade } from "./components/Book/BooksFacade";
import AppStateProvider from "./contexts/AppState";

function App() {

    return (
        <>
            <AppStateProvider>
                <BooksFacade/>
            </AppStateProvider>
        </>
    );
}

export default App;

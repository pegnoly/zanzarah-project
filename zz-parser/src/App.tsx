import { useState } from "react";
import { BooksFacade } from "./components/BooksFacade";

export enum AppState {
    NotReady,
    Ready
}

function App() {

    const [state, setState] = useState<AppState>(AppState.NotReady);

    if (state == AppState.NotReady) {
        setState(AppState.Ready);
    }

    return (
        <>
            <BooksFacade/>
        </>
    );
}

export default App;

import { Route, Routes } from "react-router-dom";
import { BooksSelector } from "./components/BooksSelector";
import AppStateProvider from "./contexts/AppState";
import { WizformSelector } from "./components/WizformSelector";

import "./App.css";

function App() {

    return (
        <AppStateProvider>
            <Routes>
                <Route path="/" element={<BooksSelector/>}/>
                <Route path="wizforms/:id/*" element={<WizformSelector/>}/>
            </Routes>
        </AppStateProvider>
    );
}

export default App;
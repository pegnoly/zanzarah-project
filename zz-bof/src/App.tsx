import "./App.css";
import { Route, Routes } from "react-router-dom";
import { BooksSelector } from "./components/BooksSelector";
import AppStateProvider from "./contexts/AppState";
import { WizformMain } from "./components/WizformMain";

function App() {

    return (
        <AppStateProvider>
            <Routes>
                <Route path="/" element={<BooksSelector/>}/>
                <Route path="wizforms/:id/*" element={<WizformMain/>}/>
            </Routes>
        </AppStateProvider>
    );
}

export default App;
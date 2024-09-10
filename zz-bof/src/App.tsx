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
        // <div style={{position: "absolute", left: "25%", overflow: "hidden"}}>
        // <label>{name}</label>
        // <button onClick={() => {
        //     invoke("test_file_save", {bookId: name}).then((v) => test(v as Wizform[]))
        // }}>{name}</button>
        // <label>{wizform == null ? "nothing" : wizform.name}</label>
        // </div>
    );
}

export default App;
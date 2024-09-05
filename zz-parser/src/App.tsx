import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Input, Button } from "antd";
import "./App.css";
import { WizformRenderer } from "./components/WizformRenderer";

function App() {

  const [name, setName] = useState<string>("");
  const [wizforms, setWizforms] = useState<string[]>([]);

  return (
    <div className="container">
      <Input onChange={(e) => setName(e.target.value)}></Input>
      <Button onClick={() => {
        invoke("try_create_book", {name: name});
      }}>Попробовать создать книгу</Button>
      <Button 
        onClick={() => invoke("try_parse_texts").then(() => invoke("try_parse_wizforms").then((v) => setWizforms(v as string[])))}
      >Сканировать файлы игры</Button>
      <WizformRenderer wizforms={wizforms}/>
    </div>
  );
}

export default App;

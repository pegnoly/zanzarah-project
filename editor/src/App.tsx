import { MantineProvider } from "@mantine/core";
import Header from "./components/layout/header";
import Body from "./components/layout/body";

function App() {
    return (
        <MantineProvider>
            <Header/>
            <Body/>
        </MantineProvider>
    );
}

export default App;

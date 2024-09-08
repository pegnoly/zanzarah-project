import { Button, Input, Modal, Space, Typography } from "antd";
import { useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";

export function BookCreator(
    {callback}:
    {callback: (id: string, name: string, directory: string) => void}
) {

    const [open, setOpen] = useState<boolean>(false);
    const [directory, setDirectory] = useState<string>("");
    const [name, setName] = useState<string>("");

    function handleOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    function handleNameInput(s: string) {
        setName(s);
    }

    function handleDirectoryPick() {
        invoke("try_pick_directory");
    }

    function handleSuccess() {
        invoke("try_create_book", {name: name, directory: directory})
            .then((v) => callback(v as string, name, directory));
        setOpen(false);
    }

    listen<string>("directory_picked", (event) => {
        setDirectory(event.payload);
    });

    return (
        <>
            <Button onClick={handleOpen}>Создать книгу</Button>
            <Modal
                width={400}
                open={open}
                title="Создать новую книгу"
                onCancel={handleClose}
                onOk={handleSuccess}
            >
                <Space 
                    direction="vertical"
                    content="center"
                    style={{
                        width: 200,
                        position: "relative"
                    }}
                >
                    <Typography.Text style={{position: "relative", left: "50%"}}>Укажите имя книги</Typography.Text>
                    <Input style={{position: "relative", left: "33%"}} onChange={(e) => handleNameInput(e.target.value)}/>
                    <Button style={{position: "relative", left: "29%"}} onClick={handleDirectoryPick}>Укажите путь к файлам игры</Button>
                    <Typography.Text style={{position: "relative", left: "58%"}}>{directory == "" ? "Путь не указан" : directory}</Typography.Text>
                </Space>
            </Modal>
        </>
    )
}
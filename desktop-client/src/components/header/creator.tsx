import { Button, Group, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, ModalRoot, ModalTitle, Stack, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks"
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

function BookCreator() {
    const [opened, {open, close}] = useDisclosure(false);
    const [name, setName] = useState<string | undefined>(undefined);
    const [directory, setDirectory] = useState<string | undefined>(undefined);
    const [version, setVersion] = useState<string | undefined>(undefined);

    async function create() {
        await invoke("create_book", {name: name, directory: directory, version: version});
        close();
    }

    return (
    <>
        <Button onClick={open}>Create book</Button>
        <ModalRoot centered opened={opened} onClose={close}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>Book creation</ModalTitle>
                    <ModalCloseButton/>
                </ModalHeader>
                <ModalBody>
                    <Stack>
                        <TextInput
                            label="Enter book name"
                            value={name}
                            onChange={(e) => setName(e.currentTarget.value)}
                        />
                        <TextInput
                            label="Enter book directory"
                            value={directory}
                            onChange={(e) => setDirectory(e.currentTarget.value)}
                        />
                        <TextInput
                            label="Enter book version"
                            value={version}
                            onChange={(e) => setVersion(e.currentTarget.value)}
                        />
                        <Group justify="end">
                            <Button onClick={create}>Create</Button>
                        </Group>
                    </Stack>
                </ModalBody>
            </ModalContent>
        </ModalRoot>
    </>
    )
}

export default BookCreator;
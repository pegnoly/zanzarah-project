import { Button, Group, NumberInput, PasswordInput, TextInput } from "@mantine/core";
import { Form, useForm } from "@mantine/form";
import { invoke } from "@tauri-apps/api/core";
import { useRef, useState } from "react";

function AuthMain() {

    const [email, setEmail] = useState<string>("");

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            password: ''
        }
    })

    const codeInputRef = useRef<HTMLInputElement | null>(null);

    async function tryRegisterUser(params: {email: string, password: string}) {
        setEmail(params.email);
        await invoke<string>("try_register_user", {email: params.email, password: params.password})
            .then((message) => console.log(message));
    }

    return <>
        <form onSubmit={form.onSubmit((values) => tryRegisterUser(values))}>
            <TextInput
                withAsterisk
                label="Email"
                placeholder="enter your email adress"
                key={form.key('email')}
                {...form.getInputProps('email')}
            />
            <PasswordInput
                withAsterisk
                label="Password"
                placeholder="enter your password"    
            />
            <Group justify="flex-end" mt="md">
                <Button type="submit">Register</Button>
            </Group>
        </form>
        <NumberInput ref={codeInputRef} withAsterisk label="Confirmation code" placeholder="enter confirmation code"/>
        <Button onClick={() => invoke<string>("try_confirm_email", {email: email, code: codeInputRef.current?.value})}>Confirm email</Button>
    </>
}

export default AuthMain;
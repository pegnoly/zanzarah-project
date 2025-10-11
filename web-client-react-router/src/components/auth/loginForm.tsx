import { z } from "zod";
import { useForm } from "@mantine/form"
import { Button, Group, Modal, PasswordInput, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { zodResolver } from 'mantine-form-zod-resolver';
import { registrationValidationSchema } from "./registrationForm";
import { useNavigate } from "react-router";
import { signIn } from "@/queries/auth/signIn";

export enum AuthError {
    IncorrectEmail = "IncorrectEmail",
    IncorrectPassword = "IncorrectPassword",
    EmailAlreadyExists = "EmailAlreadyExists",
    IncorrectCode = "IncorrectCode",
    CodeAlreadyUsed = "CodeAlreadyUsed",
    UserAlreadyConfirmed = "UserAlreadyConfirmed"
}

type FormValues = z.infer<typeof registrationValidationSchema>;

function LoginForm() {
    const [opened, {open, close}] = useDisclosure(false);
    const navigate = useNavigate();

    const form = useForm<FormValues>({
        mode: 'controlled',
        initialValues: {
            email: '',
            password: ''
        },
        validate: zodResolver(registrationValidationSchema)
    });

    async function processSignIn(email: string, password: string) {
        await signIn({email: email, password: password})
            .then(async(result) => {
                if (result) {
                    // await saveRegisterInfoCookies({data: {
                    //     emailHash: result.signIn.emailHash,
                    //     passwordHash: result.signIn.passwordHash,
                    //     token: result.signIn.newToken,
                    //     userId: result.signIn.userId
                    // }});
                    // setPermission(result.signIn.permission);
                    // setRegistrationState(result.signIn.registrationState);
                    // navigate({to: ".", reloadDocument: true});
                }
            })
            .catch((error) => {
                // well...
                const errorString = error?.message as string ;
                const splitIndex = errorString.indexOf("{");
                const actualError = errorString.substring(0, splitIndex).replace("Message", "").replace(":", "").trim();
                //console.log("Actual error: ", actualError);
                switch (actualError as AuthError) {
                    case AuthError.IncorrectEmail:
                        form.setFieldError("email", "Неверный e-mail");
                        break;
                    case AuthError.IncorrectPassword:
                        form.setFieldError("password", "Неверный пароль");
                        break;
                    default:
                        break;
                }
            })
    }

    return (
    <>
        <Button onClick={open}>Войти</Button>
        <Modal.Root opened={opened} onClose={close} centered={true}>
            <Modal.Overlay/>
            <Modal.Content>
                <Modal.Header>
                    <Modal.Title style={{fontSize: 25}}>Вход в приложение</Modal.Title>
                    <Modal.CloseButton/>
                </Modal.Header>
                <Modal.Body>
                    <form 
                        onSubmit={form.onSubmit((values) => processSignIn(values["email"], values["password"]))}
                        >
                        <TextInput
                            withAsterisk
                            label="Email"
                            placeholder="Введите e-mail"
                            key={form.key('email')}
                            {...form.getInputProps('email')}
                        />
                        <PasswordInput
                            withAsterisk
                            label="Пароль"
                            placeholder="Введите пароль"
                            key={form.key('password')}
                            {...form.getInputProps('password')}
                        />
                        <Group justify="flex-end" mt="md">
                            <Button type="submit">Войти</Button>
                        </Group>
                    </form>
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>
    </>
    )
}

export default LoginForm;
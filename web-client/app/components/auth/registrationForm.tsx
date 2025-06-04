import { z } from "zod";
import { useForm } from "@mantine/form"
import { Button, Group, Modal, PasswordInput, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { setCookie } from "@tanstack/react-start/server";
import { createServerFn } from "@tanstack/react-start";
import { RegistrationResult } from "../../graphql/graphql";
import { registerUser } from "../../utils/auth/registerUser";
import { useCommonStore } from "../../stores/common";
import { useShallow } from "zustand/shallow";
import { RegistrationState, UserPermissionType } from "../../utils/auth/utils";
import { AuthError } from "./loginForm";
import { zodResolver } from 'mantine-form-zod-resolver';

export const registrationValidationSchema = z.object({
    email: z.string().email({message: 'Некорректный формат'}),
    password: z.string()
});

type FormValues = z.infer<typeof registrationValidationSchema>;

export const saveRegisterInfoCookies = createServerFn({method: 'POST'})
    .validator((data: RegistrationResult) => data)
    .handler(async({data}) => {
        //console.log("Saving auth cookies, ", data);
        setCookie('zanzarah-project-user-email', data.emailHash, {maxAge: 10000000});
        setCookie('zanzarah-project-user-password', data.passwordHash, {maxAge: 10000000});
        setCookie('zanzarah-project-auth-token', data.token, {maxAge: 86400});
    });

function RegistrationForm() {
    const [opened, {open, close}] = useDisclosure(false);
    const [setRegistrationState, setPermission] = useCommonStore(useShallow((state) => [
        state.setRegistrationState,
        state.setPermission
    ]));

    const form = useForm<FormValues>({
        mode: 'controlled',
        initialValues: {
            email: '',
            password: ''
        },
        validate: zodResolver(registrationValidationSchema)
    });

    const registerUserMutation = useMutation({
        mutationFn: registerUser,
        mutationKey: ['register_user'],
        onError: (error) => {
            const errorString = error?.message as string ;
            const splitIndex = errorString.indexOf("{");
            const actualError = errorString.substring(0, splitIndex).replace("Message", "").replace(":", "").trim();
            //console.log("Actual error: ", actualError);
            switch (actualError as AuthError) {
                case AuthError.EmailAlreadyExists:
                    form.setFieldError("email", "Email уже зарегистрирован");
                    break;
                default:
                    break;
            }
        },
        onSuccess: async(data) => {
            if (data) {
                await saveRegisterInfoCookies({data: data});
                setRegistrationState(RegistrationState.Unconfirmed);
                setPermission(UserPermissionType.UnregisteredUser);
            }
        }
    })

    return (
    <>
        <Button onClick={open}>Зарегистрироваться</Button>
        <Modal.Root opened={opened} onClose={close} centered={true}>
            <Modal.Overlay/>
            <Modal.Content>
                <Modal.Header>
                    <Modal.Title style={{fontSize: 25}}>Регистрация</Modal.Title>
                    <Modal.CloseButton/>
                </Modal.Header>
                <Modal.Body>
                    <form 
                        onSubmit={form.onSubmit((values) => registerUserMutation.mutate({
                                data: {email: values['email'], password: values['password']}
                            }))}
                        >
                        <TextInput
                            withAsterisk
                            label="Email"
                            placeholder="Укажите свой e-mail"
                            key={form.key('email')}
                            {...form.getInputProps('email')}
                        />
                        <PasswordInput
                            withAsterisk
                            label="Пароль"
                            placeholder="Укажите пароль"
                            key={form.key('password')}
                            {...form.getInputProps('password')}
                        />
                        <Group justify="flex-end" mt="md">
                            <Button type="submit">Зарегистрироваться</Button>
                        </Group>
                    </form>
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>
    </>
    )
}

export default RegistrationForm;
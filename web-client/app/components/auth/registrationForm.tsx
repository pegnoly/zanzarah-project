import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form"
import { Button, Group, Modal, PasswordInput, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { registerUser, RegisterUserMutationResponse, RegisterUserMutationVariables } from "../../utils/auth/helpers";
import { setCookie } from "@tanstack/react-start/server";
import { createServerFn } from "@tanstack/react-start";
import { RegistrationResult } from "../../graphql/graphql";

const validationSchema = z.object({
    email: z.string().email({message: 'Некорректный формат'})
});

const saveRegisterInfoCookies = createServerFn({method: 'POST'})
    .validator((data: RegisterUserMutationResponse) => data)
    .handler(async({data}) => {
        //console.log("Saving auth cookies, ", data);
        setCookie('zanzarah-project-user-email', data.tryRegisterUser.emailHash, {maxAge: 10000000});
        setCookie('zanzarah-project-user-password', data.tryRegisterUser.passwordHash, {maxAge: 10000000});
        setCookie('zanzarah-project-auth-token', data.tryRegisterUser.token, {maxAge: 86400});
    });

function RegistrationForm() {
    const [opened, {open, close}] = useDisclosure(false);

    const form = useForm({
        mode: 'controlled',
        initialValues: {
            email: '',
            password: ''
        },
        validate: zodResolver(validationSchema)
    });

    //! Registration must return hashed email, password and token. 
    //! Token will have UserStatus info as NonConfirmedUser and UserPermission of UnregisteredUser 
    const registerUserMutation = useMutation({
        mutationFn: registerUser,
        mutationKey: ['register_user'],
        onError: (error) => {
            console.log("Failed to registed user: ", error);
        },
        onSuccess: async(data) => {
            if (data) {
                await saveRegisterInfoCookies({data: data});
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
                            <Button type="submit">Submit</Button>
                        </Group>
                    </form>
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>
    </>
    )
}

export default RegistrationForm;

// function RegistrationModal() {
//     const [opened, {open, close}] = useDisclosure(false);

//     return <>
//         <Button onClick={open}>Зарегистрироваться</Button>
//         <Modal>

//         </Modal>
//     </>
// }
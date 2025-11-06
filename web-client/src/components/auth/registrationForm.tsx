import { z } from "zod";
import { useForm } from "@mantine/form"
import { Button, Group, Modal, PasswordInput, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { AuthError } from "./loginForm";
import { zodResolver } from 'mantine-form-zod-resolver';
import { useAuth } from "@/contexts/auth";
import { registerUser } from "@/queries/auth/registerUser";
import { useNavigate } from "react-router";

export const registrationValidationSchema = z.object({
    email: z.string().email({message: 'Некорректный формат'}),
    password: z.string()
});

type FormValues = z.infer<typeof registrationValidationSchema>;

function RegistrationForm() {

    const auth = useAuth();
    const navigate = useNavigate();

    const [opened, {open, close}] = useDisclosure(false);
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
                auth?.register(data);
                close();
                navigate(0);
            }
        }
    })

    return (
    <>
        <Button radius={0} onClick={open}>Зарегистрироваться</Button>
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
                                email: values['email'], password: values['password']
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
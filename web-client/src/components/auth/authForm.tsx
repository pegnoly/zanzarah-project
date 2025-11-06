import { RegistrationState, useAuth } from "@/contexts/auth";
import { Group } from "@mantine/core";
import RegistrationForm from "./registrationForm";
import LoginForm from "./loginForm";
import ConfirmationForm from "./confirmationForm";

function AuthForm() {

    const auth = useAuth();

    switch (auth?.registrationState) {
        case RegistrationState.Unregistered:
            return <Group justify="center">
                <RegistrationForm/>
                <LoginForm/>
            </Group>
        case RegistrationState.Unconfirmed:
            return <ConfirmationForm/>
        default:
            break;
    }
}

export default AuthForm;
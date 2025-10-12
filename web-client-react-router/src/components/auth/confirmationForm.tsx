import { useMutation } from "@tanstack/react-query";
import { Button, NumberInput, Text } from "@mantine/core";
import { useState } from "react";
import { confirmCode } from "@/queries/auth/confirmCode";
import { AuthError } from "./loginForm";
import { useAuth } from "@/contexts/auth";
import { useNavigate } from "react-router";

function ConfirmationForm() {
    const [code, setCode] = useState<string>("");
    const [codeError, setCodeError] = useState<string | null>(null);

    const auth = useAuth();
    const navigate = useNavigate();

    const confirmEmailMutation = useMutation({
        mutationFn: confirmCode,
        onSuccess: async(data) => {
            if (data) {
                auth?.confirm(data);
                navigate(0);
            }
        },
        onError: (error) => {
            const errorString = error?.message as string ;
            const splitIndex = errorString.indexOf("{");
            const actualError = errorString.substring(0, splitIndex).replace("Message", "").replace(":", "").trim();
            //console.log("Actual error: ", actualError);
            switch (actualError as AuthError) {
                case AuthError.IncorrectCode:
                    setCodeError("Неверный код");
                    break;
                case AuthError.CodeAlreadyUsed:
                    setCodeError("Этот код уже использовался");
                    break;
                case AuthError.UserAlreadyConfirmed:
                    setCodeError("Пользователь уже подтвержден");
                    break;
                default:
                    break;
            }
        }
    });
    
    return <div style={{display: 'flex', flexDirection: 'column'}}>
        <Text>Введите код подтверждения, отправленный на указанный email:</Text>
        <NumberInput error={codeError} trimLeadingZeroesOnBlur={false} value={code} onChange={(value) => {
            if (codeError) {
                setCodeError(null);
            }
            setCode(value.toString());
        }}/>
        <Button onClick={() => confirmEmailMutation.mutate({code: code, email: ''})}>Подтвердить</Button>
    </div>
}

export default ConfirmationForm;
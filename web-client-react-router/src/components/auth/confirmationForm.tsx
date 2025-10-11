import { useMutation } from "@tanstack/react-query";
import { Button, NumberInput, Text } from "@mantine/core";
import { useState } from "react";
import { confirmCode } from "@/queries/auth/confirmCode";
import { AuthError } from "./loginForm";

function ConfirmationForm() {
    const [code, setCode] = useState<string>("");
    const [codeError, setCodeError] = useState<string | null>(null);

    const confirmEmailMutation = useMutation({
        mutationFn: confirmCode,
        onSuccess: async(data) => {
            if (data) {
                // setRegistrationState(data.confirmEmail.registrationState);
                // setPermission(data.confirmEmail.permission);
                // await setTokenCookie({data: data.confirmEmail.newToken});
                // navigate({to: ".", reloadDocument: true});
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
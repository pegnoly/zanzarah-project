import { useMutation } from "@tanstack/react-query";
import { confirmCode } from "../../utils/auth/confirmCode";
import { Button, NumberInput, Text } from "@mantine/core";
import { useState } from "react";
import { useCommonStore } from "../../stores/common";
import { useShallow } from "zustand/shallow";
import { setTokenCookie } from "../../utils/auth/utils";

function ConfirmationForm() {
    const [code, setCode] = useState<string>("");
    const [setRegistrationState, setPermission] = useCommonStore(useShallow((state) => [
        state.setRegistrationState,
        state.setPermission
    ]));

    const confirmEmailMutation = useMutation({
        mutationFn: confirmCode,
        onSuccess: (data) => {
            if (data) {
                setRegistrationState(data.confirmEmail.registrationState);
                setPermission(data.confirmEmail.permission);
                setTokenCookie({data: data.confirmEmail.newToken});
            }
        }
    });
    
    return <div style={{display: 'flex', flexDirection: 'column'}}>
        <Text>Подтвердите свой e-mail</Text>
        <NumberInput trimLeadingZeroesOnBlur={false} value={code} onChange={(value) => setCode(value.toString())}/>
        <Button onClick={() => confirmEmailMutation.mutate({data: code})}>Подтвердить</Button>
    </div>
}

export default ConfirmationForm;
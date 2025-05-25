import { Badge, Button, Card, NumberInput, Select, Text } from "@mantine/core";
import { useCommonStore } from "../../stores/common";
import { useShallow } from "zustand/shallow";
import { CollectionModel } from "../../utils/queries/collections";
import { AuthProps, confirmCode, RegistrationState } from "../../utils/auth/helpers";
import RegistrationForm from "../auth/registrationForm";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

function CollectionsPreview(params: {
    authProps: AuthProps,
    currentCollections: CollectionModel [] | undefined
}) {
    const [currentCollection, setCurrentCollection] = useCommonStore(useShallow((state) => [state.currentCollection, state.setCurrentCollection]));

    if (params.currentCollections != undefined) {
        setCurrentCollection(params.currentCollections!.find(c => c.active)?.id!);
    }

    return <Card w="100%" h="100%">
        <Badge size="lg" radius={0}>
            Коллекции
        </Badge>
        <Text>Коллекции позволяют отслеживать ваш прогресс при сборе фей</Text>
        <RegisterPreview registrationState={params.authProps.userState}/>
    </Card>
}

export default CollectionsPreview;

function RegisterPreview(params: {
    registrationState: RegistrationState
}) {

    const [code, setCode] = useState<string>("");

    // const [registrationState, setRegistrationState, setPermission] = useCommonStore((state) => [
    //     state.registrationState,
    //     state.setRegistrationState,
    //     state.setPermission
    // ])

    const confirmEmailMutation = useMutation({
        mutationFn: confirmCode,
        onSuccess: (data) => {
            if (data) {
                // setRegistrationState(data.confirmEmail.registrationState);
                // setPermission(data.confirmEmail.permission);
            }
        }
    })

    switch (params.registrationState) {
        case RegistrationState.Unregistered:
            return <>
                <Text>Необходимо зарегистрироваться, чтобы пользоваться функционалом коллекций</Text>
                <RegistrationForm/>
            </>
        case RegistrationState.Unconfirmed:
            return <div style={{display: 'flex', flexDirection: 'column'}}>
                <Text>Подтвердите свой e-mail</Text>
                <NumberInput trimLeadingZeroesOnBlur={false} value={code} onChange={(value) => setCode(value.toString())}/>
                <Button onClick={() => confirmEmailMutation.mutate({data: code})}>Подтвердить</Button>
            </div>
        default:
            <>Коллекции</>
            // <Select
            //     value={currentCollection}
            //     data={params.currentCollections!.map((c) => ({
            //         label: c.name, value: c.id 
            //     }))}
            // /> 
            break;
    }
}
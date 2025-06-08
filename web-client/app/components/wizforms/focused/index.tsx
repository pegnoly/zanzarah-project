import { AuthProps, UserPermissionType } from "@/utils/auth/utils";
import { WizformFull, WizformHabitatModel } from "@/utils/queries/wizforms/types";
import { Accordion, AccordionPanel, Button, Group, Loader, Modal, Skeleton, Text } from "@mantine/core";
import { Await, Link, useNavigate } from "@tanstack/react-router";
import WizformBaseProps from "./baseProps";
import CollectionsField from "./collectionsField";
import { useState } from "react";
import useWizformsStore from "@/stores/wizforms";
import { useShallow } from "zustand/shallow";
import { useCommonStore } from "@/stores/common";
import WizformMagics from "./magicLevels";
import WizformHabitatsList from "./habitatsList";
import { WizformCompleteQueryResult } from "@/utils/queries/wizforms/wizformCompleteQuery";

enum FocusedWizformMode {
    BaseProps = "BaseProps",
    Magics = "Magics",
    Habitats = "Habitats"
}

function WizformFocused(params: {
    bookId: string,
    collectionId: string | null,
    model: Promise<WizformCompleteQueryResult | null | undefined>,
    auth: AuthProps
}) {
    const navigate = useNavigate();
    const elements = useCommonStore(useShallow((state) => state.elements));

    return (
        <Modal.Root opened={true} onClose={() => navigate({to: '/wizforms/$bookId', params: {bookId: params.bookId}})}>
            <Modal.Overlay/>
            <Modal.Content>
                <Modal.Header>
                    <Modal.Title>
                        <Await promise={params.model} fallback={<Loader/>}>{(data) => {
                            return (
                                <div style={{display: 'flex', flexDirection: 'column', gap: '1%'}}>
                                    <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '2rem'}}>{data!.wizform.name}</Text>
                                    <Text 
                                        style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.5rem'}}
                                    >{`${elements?.find(e => e.element == data?.wizform!.element)?.name}, №${data?.wizform.number}`}</Text>
                                </div>
                            )
                        }}</Await>
                    </Modal.Title>
                    <Modal.CloseButton/>
                </Modal.Header>
                <Modal.Body>
                    <Accordion defaultValue={FocusedWizformMode.BaseProps}>
                        <Accordion.Item value={FocusedWizformMode.BaseProps}>
                            <Accordion.Control>Основные параметры</Accordion.Control>
                            <Accordion.Panel>
                                <Await promise={params.model} fallback={<Skeleton/>}>{(data) => {
                                    return (
                                        <WizformBaseProps model={data?.wizform!}/>
                                    )
                                }}
                                </Await>
                            </Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item value={FocusedWizformMode.Magics}>
                            <Accordion.Control>Уровни магии</Accordion.Control>
                            <Accordion.Panel>
                                <Await promise={params.model} fallback={<Skeleton/>}>{(data) => {
                                    return (
                                        <WizformMagics magics={data?.wizform!.magics!}/>
                                    )
                                }}</Await>
                            </Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item value={FocusedWizformMode.Habitats}>
                            <Accordion.Control>Места обитания</Accordion.Control>
                            <Accordion.Panel>
                                <Await promise={params.model} fallback={<Skeleton/>}>{(data) => {
                                    return (
                                        <WizformHabitatsList habitats={data?.wizformHabitats!}/>
                                    )
                                }}</Await>
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
                    {
                        (params.auth.userPermission != UserPermissionType.UnregisteredUser && params.collectionId) ? 
                        <Await promise={params.model} fallback={<Loader style={{display: "flex", justifySelf: 'end'}}/>}>{(data) => {
                            return (
                                <CollectionsField
                                    wizformId={data?.wizform!.id!}
                                    inCollectionId={data?.wizform.inCollectionId!}
                                    currentCollection={params.collectionId!}
                                />
                            ) 
                        }}</Await> :
                        null
                    }
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>
    )
}

export default WizformFocused;
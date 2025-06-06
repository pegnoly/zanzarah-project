import { AuthProps, UserPermissionType } from "@/utils/auth/utils";
import { WizformFull, WizformHabitatModel } from "@/utils/queries/wizforms/types";
import { Accordion, AccordionPanel, Button, Group, Modal, Text } from "@mantine/core";
import { Link, useNavigate } from "@tanstack/react-router";
import WizformBaseProps from "./baseProps";
import CollectionsField from "./collectionsField";
import { useState } from "react";
import useWizformsStore from "@/stores/wizforms";
import { useShallow } from "zustand/shallow";
import { useCommonStore } from "@/stores/common";
import WizformMagics from "./magicLevels";
import WizformHabitatsList from "./habitatsList";

enum FocusedWizformMode {
    BaseProps = "BaseProps",
    Magics = "Magics",
    Habitats = "Habitats"
}

function WizformFocused(params: {
    bookId: string,
    collectionId: string | null,
    // model: WizformFull,
    habitats: WizformHabitatModel [],
    auth: AuthProps
}) {
    const navigate = useNavigate();

    // const [wizform, setWizform] = useState<WizformFull>(params.model);
    const [wizform, setWizform, wizforms, setWizforms] = useWizformsStore(useShallow((state) => [
        state.focusedWizform,
        state.setFocusedWizform,
        state.wizforms, 
        state.setWizforms
    ]));
    const elements = useCommonStore(useShallow((state) => state.elements));

    async function addedToCollection(inCollectionId: string) {
        setWizform({...wizform!, inCollectionId: inCollectionId});
        setWizforms(
            wizforms?.map(w => {
                if (w.id == wizform!.id) { 
                    w.inCollectionId = "optimistically_updated";
                    return w;
                } else {
                    return w;
                }
            })!
        );
    }

    async function removeFromCollection() {
        setWizform({...wizform!, inCollectionId: null});
        setWizforms(
            wizforms?.map(w => {
                if (w.id == wizform!.id) { 
                    w.inCollectionId = null;
                    return w;
                } else {
                    return w;
                }
            })!
        );
    }

    return (
        <Modal.Root opened={true} onClose={() => navigate({to: '/wizforms/$bookId', params: {bookId: params.bookId}})}>
            <Modal.Overlay/>
            <Modal.Content>
                <Modal.Header>
                    <Modal.Title>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '1%'}}>
                            <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '2rem'}}>{wizform!.name}</Text>
                            <Text 
                                style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.5rem'}}
                            >{`${elements?.find(e => e.element == wizform!.element)?.name}, №${wizform!.number}`}</Text>
                        </div>
                    </Modal.Title>
                    <Modal.CloseButton/>
                </Modal.Header>
                <Modal.Body>
                    <Accordion defaultValue={FocusedWizformMode.BaseProps}>
                        <Accordion.Item value={FocusedWizformMode.BaseProps}>
                            <Accordion.Control>Основные параметры</Accordion.Control>
                            <Accordion.Panel>
                                <WizformBaseProps model={wizform!}/>
                            </Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item value={FocusedWizformMode.Magics}>
                            <Accordion.Control>Уровни магии</Accordion.Control>
                            <Accordion.Panel>
                                <WizformMagics magics={wizform!.magics}/>
                            </Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item value={FocusedWizformMode.Habitats}>
                            <Accordion.Control>Места обитания</Accordion.Control>
                            <Accordion.Panel>
                                <WizformHabitatsList habitats={params.habitats}/>
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
                    {
                        (params.auth.userPermission != UserPermissionType.UnregisteredUser && params.collectionId) ? 
                        <CollectionsField
                            wizformId={wizform!.id}
                            inCollectionId={wizform!.inCollectionId}
                            currentCollection={params.collectionId!}
                            addToCollectionCallback={addedToCollection}
                            removeFromCollectionCallback={removeFromCollection}
                        /> :
                        null
                    }
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>
    )
}

export default WizformFocused;
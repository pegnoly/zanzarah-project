import { Accordion, AccordionPanel, Button, Group, Loader, Modal, Skeleton, Text } from "@mantine/core";
import WizformBaseProps from "./baseProps";
import { useEffect, useState } from "react";
import WizformMagics from "./magicLevels";
import WizformHabitatsList from "./habitatsList";
import { useNavigate, useParams } from "react-router";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { WizformFull, WizformHabitatModel } from "@/queries/wizforms/types";
import { useWizform, type WizformCompleteQueryResult } from "@/queries/wizforms/wizformCompleteQuery";

enum FocusedWizformMode {
    BaseProps = "BaseProps",
    Magics = "Magics",
    Habitats = "Habitats"
}

function WizformFocused() {
  const navigate = useNavigate();
  const { id, focusedId } = useParams();

  const [wizform, setWizform] = useState<WizformFull | undefined>(undefined);
  const [habitats, setHabitats] = useState<WizformHabitatModel [] | undefined>(undefined);

  async function wizformLoaded(value: WizformCompleteQueryResult) {
    setWizform(value.wizform);
    setHabitats(value.wizformHabitats);
  }

  return (
    <>
        <Dialog open onOpenChange={() => navigate(-1)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{wizform == undefined ? <Loader/> : wizform.name}</DialogTitle>
                    <DialogDescription>{wizform == undefined ? "" : wizform.number}</DialogDescription>
                </DialogHeader>
                <Accordion defaultValue={FocusedWizformMode.BaseProps}>
                    <Accordion.Item value={FocusedWizformMode.BaseProps}>
                        <Accordion.Control>Основные параметры</Accordion.Control>
                        <Accordion.Panel>
                            {
                                wizform == undefined ? <Skeleton/> : <WizformBaseProps model={wizform}/>
                            }
                        </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item value={FocusedWizformMode.Magics}>
                        <Accordion.Control>Уровни магии</Accordion.Control>
                        <Accordion.Panel>
                            {
                                wizform == undefined ? <Skeleton/> : <WizformMagics magics={wizform.magics}/>
                            }
                        </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item value={FocusedWizformMode.Habitats}>
                        <Accordion.Control>Места обитания</Accordion.Control>
                        <Accordion.Panel>
                            {
                                habitats == undefined ? <Skeleton/> : <WizformHabitatsList habitats={habitats}/>
                            }
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
                {/* {
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
                } */}
            </DialogContent>
        </Dialog>
        <WizformLoader id={focusedId!} onLoad={wizformLoaded}/>
    </>
  )
}

function WizformLoader({id, onLoad}: {id: string, onLoad: (value: WizformCompleteQueryResult) => void}) {
  const { data } = useWizform({wizformId: id, collectionId: null});
  useEffect(() => {
    if (data != undefined) {
      onLoad(data);
    }
  }, [data]);

  return null;
}

export default WizformFocused;
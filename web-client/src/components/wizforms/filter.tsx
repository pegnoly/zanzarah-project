import { Button, ButtonGroup, Dialog, Stack, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import ElementsSelector from "../utils/elementsSelector";
import { useNavigate } from "react-router";
import { useActiveBook } from "@/contexts/activeBook";
import { useState } from "react";
import { WizformElementType } from "@/graphql/graphql";

function WizformsFilter() {
  const navigate = useNavigate();
  const [opened, {open, close}] = useDisclosure(false);
  const activeBook = useActiveBook();

  const [localElementFilter, setLocalElementFilter] = useState<WizformElementType>(activeBook?.currentElementFilter!);
  const [localNameFilter, setLocalNameFilter] = useState<string>(activeBook?.currentNameFilter!);

  return <>
    <ButtonGroup flex={1} style={{position: 'sticky', bottom: '95%', left: '1%'}}>
      <Button 
        // disabled={wizformsDisabled} 
        onClick={() => {
          // setWizformsDisabled(true);
          open()
        }}
        size='lg' radius='xs' color='teal'>
        Фильтры
      </Button>
      <Button 
        color='grey' 
        // disabled={wizformsDisabled} 
        onClick={() => navigate("/")} 
        size='lg' radius='xs'
      >На главную</Button>
    </ButtonGroup>
    <Dialog
      opened={opened}
      withBorder
      withCloseButton
      size='lg'
      radius='xs'
      onClose={() => {
        // setWizformsDisabled(false);
        close();
      }}
    >
      <Stack>
        <ElementsSelector 
          label='Сортировать фей по стихии'
          // disabled={false}
          current={localElementFilter}
          selectedCallback={setLocalElementFilter}
        />
        <TextInput
          value={localNameFilter} 
          onChange={(event) => setLocalNameFilter(event.currentTarget.value)}
          label='Сортировать фей по имени'
          placeholder='Укажите фильтр(зависит от регистра)'
        /> 
        <Button onClick={() => {
          // setWizformsDisabled(false);
          activeBook?.updateElementFilter(localElementFilter);
          activeBook?.updateNameFilter(localNameFilter);
          close();
        }}>Применить</Button>
      </Stack>
    </Dialog>
  </>
}

export default WizformsFilter;
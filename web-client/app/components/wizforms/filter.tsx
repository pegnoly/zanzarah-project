import { WizformElementType } from "@/graphql/graphql";
import { useCommonStore } from "@/stores/common";
import useWizformsStore from "@/stores/wizforms";
import { Button, ButtonGroup, Dialog, Stack, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { setCookie } from "@tanstack/react-start/server";
import { useShallow } from "zustand/shallow";
import ElementsSelector from "../utils/elementsSelector";

const setLastNameFilterCookie = createServerFn({method: 'POST'})
  .validator((filter: string) => filter)
  .handler(async({data}) => {
    setCookie('zanzarah-project-name-filter', data, {maxAge: 86400});
  });

const setLastElementFilterCookie = createServerFn({method: 'POST'})
  .validator((filter: WizformElementType) => filter)
  .handler(async({data}) => {
    setCookie('zanzarah-project-element-filter', data, {maxAge: 86400});
  });

function WizformsFilter(params: {
    currentElementFilter: WizformElementType,
    currentNameFilter: string | undefined,
    elementFilterUpdateCallback: (value: WizformElementType) => void,
    nameFilterUpdateCallback: (value: string | undefined) => void,
    filtersUpdatedCallback: () => void
}) {
  const navigate = useNavigate();
  const [opened, {open, close}] = useDisclosure(false);

  const [wizformsDisabled, setWizformsDisabled] = useCommonStore(useShallow((state) => [state.wizformsDisabled, state.setWizformsDisabled]));
  const [setElementFilter, setNameFilter] = useWizformsStore(useShallow((state) => [state.setElementFilter, state.setNameFilter]));

  async function updateElementFilter(value: WizformElementType) {
    await setLastElementFilterCookie({data: value});
    setElementFilter(value);
    params.elementFilterUpdateCallback(value);
  }

  async function updateNameFilter(value: string) {
    await setLastNameFilterCookie({data: value});
    setNameFilter(value);
    params.nameFilterUpdateCallback(value);
  }

  return <>
    <ButtonGroup flex={1} style={{position: 'sticky', bottom: '95%', left: '1%'}}>
      <Button disabled={wizformsDisabled} onClick={() => {
          setWizformsDisabled(true);
          open()
        }}
        size='lg' radius='xs' color='teal'>
        Фильтры
      </Button>
      <Button color='grey' disabled={wizformsDisabled} onClick={() => navigate({to: "/"})} size='lg' radius='xs'>На главную</Button>
    </ButtonGroup>
    <Dialog
      opened={opened}
      withBorder
      withCloseButton
      size='lg'
      radius='xs'
      onClose={() => {
        setWizformsDisabled(false);
        close();
      }}
    >
      <Stack>
        <ElementsSelector 
          label='Сортировать фей по стихии'
          disabled={false}
          current={params.currentElementFilter!}
          selectedCallback={updateElementFilter}
        />
        <TextInput
          value={params.currentNameFilter} 
          onChange={(event) => updateNameFilter(event.currentTarget.value)}
          label='Сортировать фей по имени'
          placeholder='Укажите фильтр(зависит от регистра)'
        /> 
        <Button onClick={() => {
          setWizformsDisabled(false);
          close();
          params.filtersUpdatedCallback();
        }}>Применить</Button>
      </Stack>
    </Dialog>
  </>
}

export default WizformsFilter;
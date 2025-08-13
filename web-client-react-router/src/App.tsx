import { Loader, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, ModalRoot, ModalTitle } from '@mantine/core'
import { Link, Route, Routes, useNavigate, useParams } from 'react-router'
import { useWizform, type WizformCompleteQueryResult } from './queries/wizforms/wizformCompleteQuery';
import { useEffect, useState } from 'react';
import { type WizformHabitatModel, type WizformFull } from './queries/wizforms/types';
import WizformsMain from './components/wizforms';

function App() {
  return (
    <>
      <Routes>
        <Route path="/">
          <Route path='/wizforms'>
            <Route index element={<WizformsMain/>}/>
            <Route path='focused/:id' element={<Test/>}/>
          </Route>
        </Route>
      </Routes>
    </>
  )
}

function Test() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [wizform, setWizform] = useState<WizformFull | undefined>(undefined);
  const [habitats, setHabitats] = useState<WizformHabitatModel [] | undefined>(undefined);

  async function wizformLoaded(value: WizformCompleteQueryResult) {
    setWizform(value.wizform);
    setHabitats(value.wizformHabitats);
  }

  return (
    <>
      <ModalRoot opened={true} onClose={() => {navigate('/', {replace: true})}}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{wizform == undefined ? <Loader/> : wizform.name}</ModalTitle>
            <ModalCloseButton/>
          </ModalHeader>
          <ModalBody>
            Test2
          </ModalBody>
        </ModalContent>
      </ModalRoot>
      <WizformLoader id={id!} onLoad={wizformLoaded}/>
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

export default App

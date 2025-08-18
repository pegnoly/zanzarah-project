import { RouterProvider } from 'react-router'
import router from './router';
import { CommonStore } from './stores/common';
import { useElements } from './queries/elements';
import { useEffect } from 'react';

function App() {
  const elements = CommonStore.useElements();

  return (
  <>
    <RouterProvider router={router} />
    {
      elements != undefined ? null : 
      <ElementsLoader/>
    }
  </>
  )
}

function ElementsLoader() {
  const actions = CommonStore.useActions();
  const { data } = useElements('5a5247c2-273b-41e9-8224-491e02f77d8d');
  
  useEffect(() => {
    if (data != undefined) {
      actions.loadElements(data.elements);
    }
  }, [data])

  return null;
}

export default App

import { Badge, Button, Card, Divider, Group, Loader, Modal, Popover, Select, SimpleGrid, Text, TextInput } from "@mantine/core";
import { RegistrationState, useAuth } from "@/contexts/auth";
import AuthForm from "../auth/authForm";

// function fetchCollectionsOnClient(bookId: string, userId: string) {
//     return useQuery({
//         queryKey: ['collections'],
//         queryFn: async() => {
//             const data = await fetchCollections({data: {bookId: bookId, userId: userId}});
//             return data;
//         },
//     });
// }

// function useEntriesCount(collectionId: string) {
//     return useQuery({
//         queryKey: ['collection_entries_count'],
//         queryFn: async() => {
//             const data = await getEntriesCount({data: {collectionId: collectionId}});
//             // console.log("Got data: ")
//             return data;
//         }
//     })
// }

function CollectionsPreview() {

    const auth = useAuth();

    return <Card w="100%" h="100%" withBorder radius={0}>
        <Badge size="lg" radius={0}>
            Коллекции
        </Badge>
        <div style={{width: '100%', height: '90%', paddingTop: '3%'}}>
            <SimpleGrid cols={{lg: 2, base: 1}}>
                {
                    auth?.registrationState != RegistrationState.Confirmed ?
                    <AuthForm/> :
                    null
                    // <CollectionsRenderer 
                    //     currentBook={params.currentBook} 
                    //     collections={params?.currentCollections} 
                    //     auth={params.authData} 
                    // />
                }
                <CollectionsInfo/>
            </SimpleGrid>
        </div>
    </Card>
}

function CollectionsInfo() {

    const auth = useAuth();

    return <div style={{paddingTop: '3%'}}>
        <Text style={{fontFamily: 'Comfortaa', fontSize: '1rem', fontWeight: 'bold', paddingBottom: '1%'}}>Коллекции позволяют отслеживать ваш прогресс при сборе фей.</Text>
        <Divider/>
        <Text 
            style={{fontFamily: 'Comfortaa', fontSize: '1rem', fontWeight: 'bold', paddingTop: '1%'}}
        >При наличии активной коллекции вы можете добавлять в нее фей через интерфейс книги.</Text>
        <Divider/>
        <Text 
            style={{fontFamily: 'Comfortaa', fontSize: '1rem', fontWeight: 'bold', paddingTop: '1%'}}
        >Созданные коллекции привязаны к версии мода и сбрасываются, если новые версии вносят несовместимые изменения.</Text>
        {
            auth?.registrationState != RegistrationState.Confirmed ?
            <>
                <Divider/>
                <Text 
                    style={{fontFamily: 'Comfortaa', fontSize: '1rem', fontWeight: 'bold', paddingTop: '1%', color: 'red'}}
                >Необходимо завершить регистрацию, чтобы использовать коллекции.</Text>
            </> :
            null
        }
    </div>
}

// function CollectionsRenderer(params: {
//     collections: CollectionModel [] | undefined,
//     currentBook: BookFullModel | null,
//     auth: AuthProps,
// }) {
//     const [collections, setCollections] = useState<CollectionModel []>(params.collections!);

//     async function onCollectionCreated(value: CollectionModel) {
//         setCollections([...collections, value]);
//     }

//     async function onCollectionSelected() {
//         const { status, data, error, isFetching } = fetchCollectionsOnClient(params.currentBook?.id!, params.auth.userId!);
//         setCollections(data!);
//     }

//     return <>
//         {
//             params.currentBook == null ? 
//             <>
//                 Необходимо выбрать книгу, чтобы создать коллекцию
//             </> :
//             <div style={{display: 'flex', flexDirection: 'column', justifyItems: 'center', gap: '4%'}}>
//                 <CollectionSelector models={collections} selectCallback={onCollectionSelected}/>
//                 <CollectionCreator bookData={params.currentBook} currentUser={params.auth.userId!} collectionCreatedCallback={onCollectionCreated}/>
//                 <CurrentCollection model={collections.find(c => c.active)}/>
//             </div>
//         }
//     </>
// }

// function CurrentCollection(params: {
//     model: CollectionModel | undefined
// }) {

//     if (params.model == undefined) {
//         return <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1rem'}}>Нет активной коллекции</Text>
//     }

//     const { data, status } = useEntriesCount(params.model.id);

//     return <>
//         <div style={{display: 'flex', flexDirection: 'row', gap: '3%'}}>
//             <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.4rem',}}>{`Текущая коллекция: `}</Text>
//             <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.4rem', color: 'green'}}>{params.model.name}</Text>
//         </div>
//         <div style={{display: 'flex', flexDirection: 'row', gap: '3%'}}>
//             <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.4rem'}}>Фей в коллекции: </Text>
//             {
//                 status === 'pending' ?
//                 <Loader size="xs"/> :
//                 <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.4rem', color: 'green'}}>{data}</Text>
//             }
//         </div>
//     </>
// }

// function CollectionSelector(params: {
//     models: CollectionModel [],
//     selectCallback: () => void
// }) { 
//     const navigate = useNavigate();
//     const [currentCollection, setCurrentCollection] = useState<string | null>(params.models.find(c => c.active)?.id!)

//     const setActiveCollectionMutation = useMutation({
//         mutationFn: setActiveCollection,
//         onSuccess: (data) => {
//             // я ебал мать
//             navigate({to: ".", reloadDocument: true});
//         }
//     })

//     async function updateCurrentCollection(value: string) {
//         setCurrentCollection(value);
//         setActiveCollectionMutation.mutate({data: {collectionId: value!}});
//     }

//     return (
//         <Popover>
//             <Popover.Target>
//                 <Button>Выбрать коллекцию</Button>
//             </Popover.Target>
//             <Popover.Dropdown>
//                 <Select
//                     label="Список коллекций текущей книги"
//                     placeholder="Установите активную коллекцию"
//                     value={currentCollection}
//                     onChange={updateCurrentCollection}
//                     data={params.models.map((c) => ({
//                         label: c.name, value: c.id
//                     }))}
//                 />
//             </Popover.Dropdown>
//         </Popover>
//     )
// }

// function CollectionCreator(params: {
//     bookData: BookFullModel,
//     currentUser: string,
//     collectionCreatedCallback: (value: CollectionModel) => void
// }) {
//     const [opened, {open, close}] = useDisclosure(false);
//     const [name, setName] = useState<string>("");

//     const createCollectionMutation = useMutation({
//         mutationFn: createCollection,
//         onSuccess: (data) => {
//             if (data != undefined) {
//                 params.collectionCreatedCallback(data);
//             }
//         }
//     })

//     return <>
//         <Button onClick={open}>Создать новую коллекцию</Button>
//         <Modal.Root opened={opened} onClose={close} centered={true}>
//             <Modal.Overlay/>
//             <Modal.Content>
//                 <Modal.Header>
//                     <Modal.Title style={{fontSize: 25}}>{`Создание коллекции для книги ${params.bookData.name} версии ${params.bookData.version}`}</Modal.Title>
//                     <Modal.CloseButton/>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <TextInput 
//                         value={name} 
//                         onChange={(e) => setName(e.currentTarget.value)}
//                         placeholder="Введите имя коллекции"
//                         label="Имя новой коллекции"
//                     />
//                     <Group justify="flex-end" mt="md">
//                         <Button 
//                             onClick={
//                                 () => {
//                                     createCollectionMutation.mutate({data: {bookId: params.bookData.id, userId: params.currentUser!, name: name}});
//                                     close();
//                                 }
//                             } 
//                             type="submit">Создать</Button>
//                     </Group>
//                 </Modal.Body>
//             </Modal.Content>
//         </Modal.Root>
//     </>
// }

export default CollectionsPreview;
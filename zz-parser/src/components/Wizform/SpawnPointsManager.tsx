import { DeleteFilled } from "@ant-design/icons";
import { Button, Col, Input, List, Modal, Row, Space, Typography } from "antd";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSpawnPointsContext } from "../../contexts/SpawnPoints";
import { invoke } from "@tauri-apps/api/core";
import { SpawnPoint } from "../types";


interface SpawnPointsManagerSchema {
    pointUpdateCallback: (filter: string | null) => void
}

export function SpawnPointsManager(schema: SpawnPointsManagerSchema) {

    const [open, setOpen] = useState<boolean>(false);
    const [spawn, setSpawn] = useState<string>("");

    const spawnPointsContext = useSpawnPointsContext();

    function handleClose() {
        setOpen(false);
    }

    function handleNewSpawnChange(s: string) {
        setSpawn(s);
    }

    function handleNewSpawnAdd() {

        invoke("create_spawn_point", {bookId: spawnPointsContext?.state.book_id, name: spawn})
            .then((v) => spawnPointsContext?.setState({
                ...spawnPointsContext.state,
                points: [...spawnPointsContext.state.points, v as SpawnPoint]
            }));
        
        setSpawn("");
    }

    function handleSpawnRemove(spawnId: string) {
        spawnPointsContext?.setState({
            ...spawnPointsContext.state,
            points: spawnPointsContext.state.points.filter(p => p.id != spawnId)
        })
        schema.pointUpdateCallback(spawnId);
    }

    return (
        <>
            <Button onClick={() => setOpen(true)}>Настроить места ловли фей</Button>
            <Modal 
                open={open}
                onCancel={handleClose}
                onClose={handleClose}
                onOk={handleClose}
            >
                <div>
                    <Typography.Text>Имеющиеся места</Typography.Text>
                    <Row>
                        <Col span={13} style={{height: 450, overflowY: 'scroll'}}>
                            <InfiniteScroll
                                next={() => {}}
                                hasMore={false}
                                loader={null}
                                dataLength={spawnPointsContext?.state.points.length as number}>
                                    <List>{
                                        spawnPointsContext?.state.points.map((s, index) => (
                                        <List.Item key={index}>
                                            <Space direction="horizontal">
                                                <Typography.Text>{s.name}</Typography.Text>
                                                <Button
                                                    onClick={() => handleSpawnRemove(s.id)} 
                                                    icon={<DeleteFilled/>}></Button>
                                            </Space>
                                        </List.Item>
                                    ))
                                }</List>
                            </InfiniteScroll> 
                        </Col>
                        <Col offset={1} span={8} style={{display: 'flex', flexDirection: 'column', alignContent: 'center'}}>
                            <Input defaultValue={spawn} onChange={(e) => handleNewSpawnChange(e.currentTarget.value)}/>
                            <Button onClick={handleNewSpawnAdd}>Добавить место</Button>
                        </Col>
                    </Row>
                </div>
            </Modal>
        </>
    )
}
import { DeleteFilled } from "@ant-design/icons";
import { Button, Col, Input, List, Modal, Row, Space, Typography } from "antd";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export function SpawnPointsManager() {

    const [open, setOpen] = useState<boolean>(false);
    const [spawns, setSpawns] = useState<string[]>([]);
    const [spawn, setSpawn] = useState<string>("");

    function handleClose() {
        setOpen(false);
    }

    function handleNewSpawnChange(s: string) {
        setSpawn(s);
    }

    function handleNewSpawnAdd() {
        setSpawns([
            ...spawns,
            spawn
        ]);
    }

    function handleSpawnRemove(filterType: number) {
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
                                dataLength={spawns.length}>
                                    <List>{
                                        spawns.map((s, index) => (
                                        <List.Item key={index}>
                                            <Space direction="horizontal">
                                                <Typography.Text>{s}</Typography.Text>
                                                <Button
                                                    // onClick={() => handleFilterRemove(f.filter_type)} 
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
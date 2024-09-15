import { Col, Row, Typography } from "antd";
import { LevelOfMagic } from "../types";
import { ActiveMagicSlot } from "../MagicSlot/Active";
import { PassiveMagicSlot } from "../MagicSlot/Passive";

interface WizformMagicLevelSchema {
    level: LevelOfMagic | undefined
}

export function WizformMagicLevel(schema: WizformMagicLevelSchema) {
    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <Typography.Text>{`Уровень ${schema.level?.level}`}</Typography.Text>
            <Row>
                <Col offset={2} span={5}>
                    <ActiveMagicSlot slot={schema.level?.first_active_slot}/>
                </Col>
                <Col span={5}>
                    <PassiveMagicSlot slot={schema.level?.first_passive_slot}/>
                </Col>
                <Col span={5}>
                    <ActiveMagicSlot slot={schema.level?.second_active_slot}/>
                </Col>
                <Col span={5}>
                    <PassiveMagicSlot slot={schema.level?.second_passive_slot}/>
                </Col>
            </Row>
        </div>
    )
    
}
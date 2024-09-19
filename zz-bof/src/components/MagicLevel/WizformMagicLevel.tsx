import { Col, Row, Typography } from "antd";
import { LevelOfMagic } from "../types";
import { ActiveMagicSlot } from "../MagicSlot/Active";
import { PassiveMagicSlot } from "../MagicSlot/Passive";

interface WizformMagicLevelSchema {
    level: LevelOfMagic | undefined
}

export function WizformMagicLevel(schema: WizformMagicLevelSchema) {
    return (
        <>
            <Typography.Text>{`Уровень ${schema.level?.level}`}</Typography.Text>
            <Row>
                <Col span={12} style={{display: 'flex', justifyContent: 'center'}}>
                    <ActiveMagicSlot slot={schema.level?.first_active_slot}/>
                </Col>
                <Col span={12} style={{display: 'flex', justifyContent: 'center'}}>
                    <PassiveMagicSlot slot={schema.level?.first_passive_slot}/>
                </Col>
                <Col span={12} style={{display: 'flex', justifyContent: 'center'}}>
                    <ActiveMagicSlot slot={schema.level?.second_active_slot}/>
                </Col>
                <Col span={12} style={{display: 'flex', justifyContent: 'center'}}>
                    <PassiveMagicSlot slot={schema.level?.second_passive_slot}/>
                </Col>
            </Row>
        </>
    )
    
}
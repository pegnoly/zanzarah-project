import { Space, Typography } from "antd";
import { LevelOfMagic } from "../../types";
import { ActiveMagicSlot } from "../MagicSlot/Active";
import { PassiveMagicSlot } from "../MagicSlot/Passive";

interface WizformMagicLevelSchema {
    level: LevelOfMagic | undefined
}

export function WizformMagicLevel(schema: WizformMagicLevelSchema) {
    return (
        <>
            <Typography.Text style={{fontFamily: 'Shantell Sans', color: 'white', textAlign: 'center'}}>{`Уровень ${schema.level?.level}`}</Typography.Text>
            <div style={{paddingTop: '2%', display: 'flex', flexDirection: 'column'}}>
                <div style={{paddingTop: '3%'}}>
                    <Space>
                        <Typography.Text style={{fontFamily: 'Shantell Sans', color: 'white', textAlign: 'center'}}>Активное 1</Typography.Text>
                        <ActiveMagicSlot slot={schema.level?.first_active_slot}/>
                    </Space>
                </div>
                <div style={{paddingTop: '3%'}}>
                    <Space>
                        <Typography.Text style={{fontFamily: 'Shantell Sans', color: 'white', textAlign: 'center'}}>Пассивное 1</Typography.Text>
                        <PassiveMagicSlot slot={schema.level?.first_passive_slot}/>
                    </Space>
                </div>
                <div style={{paddingTop: '3%'}}>
                    <Space>
                        <Typography.Text style={{fontFamily: 'Shantell Sans', color: 'white', textAlign: 'center'}}>Активное 2</Typography.Text>
                        <ActiveMagicSlot slot={schema.level?.second_active_slot}/>
                    </Space>
                </div>
                <div style={{paddingTop: '3%'}}>
                    <Space>
                        <Typography.Text style={{fontFamily: 'Shantell Sans', color: 'white', textAlign: 'center'}}>Пассивное 2</Typography.Text>
                        <PassiveMagicSlot slot={schema.level?.second_passive_slot}/>
                    </Space>
                </div>
            </div>
        </>
    )
    
}
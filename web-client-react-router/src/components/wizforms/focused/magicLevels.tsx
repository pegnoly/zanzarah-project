import { ActiveMagicSlot } from "@/components/magic/activeSlot";
import { PassiveMagicSlot } from "@/components/magic/passiveSlot";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import type { Magics } from "@/queries/wizforms/types";
import { Stack, Text } from "@mantine/core";

function WizformMagics(params: {
    magics: Magics
}) {
    return (
        <div style={{width: '90%', paddingLeft: '5%'}}>
            <Carousel orientation='horizontal' className="w-full max-w-xs" style={{width: '90%'}} opts={{loop: true, slidesToScroll: 1}}>
                <CarouselContent>{params.magics.types.map((magic, index) => (
                <CarouselItem key={index}>
                    <div>
                        <Text style={{fontFamily: 'Yanone Kaffeesatz', fontWeight: 'bolder', fontSize: '1.5rem', paddingLeft: '5%'}}>{`Уровень ${magic.level}`}</Text>
                        <div style={{paddingLeft: '5%', justifyItems: 'center'}}>
                            <Stack gap={1}>
                                <Stack gap={1}>
                                    <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>Первое активное</Text>
                                    <ActiveMagicSlot slot={magic.firstActiveSlot}/>
                                </Stack>
                                <Stack gap={1}>
                                    <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>Первое пассивное</Text>
                                    <PassiveMagicSlot slot={magic.firstPassiveSlot}/>
                                </Stack>
                                <Stack gap={1}>
                                    <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>Второе активное</Text>
                                    <ActiveMagicSlot slot={magic.secondActiveSlot}/>
                                </Stack>
                                <Stack gap={1}>
                                    <Text size='md' style={{fontFamily: 'Ysabeau SC', fontWeight: 'bolder'}}>Второе пассивное</Text>
                                    <PassiveMagicSlot slot={magic.secondPassiveSlot}/>
                                </Stack>
                            </Stack>
                        </div>
                    </div>
                    </CarouselItem>
                ))}
                </CarouselContent>
                <div style={{display: 'flex', paddingTop: '5%', justifyContent: 'space-between'}}>
                    <CarouselPrevious className="relative -translate-y-0 left-0" />
                    <CarouselNext className="relative -translate-y-0 right-0" />
                </div>
            </Carousel>
        </div>
    )
}

export default WizformMagics;
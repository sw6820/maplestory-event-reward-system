import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Event extends Document {
    @Prop()
    title: string;

    @Prop()
    condition: string;

    @Prop()
    status: 'ACTIVE' | 'INACTIVE';

    @Prop()
    startAt: Date;

    @Prop()
    endAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);

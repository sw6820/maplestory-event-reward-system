import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Reward extends Document {
    @Prop() eventId: string;
    @Prop() type: 'POINT' | 'ITEM' | 'COUPON';
    @Prop() description: string;
    @Prop() amount: number;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Claim extends Document {
    @Prop() userId: string;
    @Prop() eventId: string;
    @Prop() rewardId: string;
    @Prop({ enum: ['SUCCESS', 'FAILED'] }) status: string;
    @Prop() requestedAt: Date;
    @Prop() reason?: string;
}

export const ClaimSchema = SchemaFactory.createForClass(Claim);

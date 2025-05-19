import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './schemas/event.schema';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>
  ) {}

  @OnEvent('create_event')
  async create(event: Partial<Event>) {
    const created = new this.eventModel(event);
    return created.save();
  }

  @OnEvent('get_events')
  async findAll() {
    return this.eventModel.find().exec();
  }
}

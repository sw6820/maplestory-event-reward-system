import { Controller, Get, Post, Body } from '@nestjs/common';
import { EventService } from './event.service';

class CreateEventDto {
  title: string;
  condition: string;
  status: 'ACTIVE' | 'INACTIVE';
  startAt: Date;
  endAt: Date;
}

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto): Promise<any> {
    return await this.eventService.create(createEventDto);
  }

  @Get()
  async findAll(): Promise<any> {
    return await this.eventService.findAll();
  }
}

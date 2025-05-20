import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@app/common/auth/jwt-auth.guard';
import { EventService } from './event.service';
import { Event } from './schemas/event.schema';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(@Body() createEventDto: {
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    rewards: {
      name: string;
      description: string;
      quantity: number;
    }[];
  }): Promise<Event> {
    return this.eventService.create(createEventDto);
  }

  @Get()
  async findAll(): Promise<Event[]> {
    return this.eventService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Event> {
    return this.eventService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: Partial<Event>,
  ): Promise<Event> {
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.eventService.remove(id);
  }
}

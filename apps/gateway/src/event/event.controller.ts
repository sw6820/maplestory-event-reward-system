import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@app/common/enums/roles.enum';

@Controller('events')
export class EventController {
  constructor(
    @Inject('EVENT_SERVICE') private readonly eventService: ClientProxy,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  async create(@Body() createEventDto: any) {
    return this.eventService.send({ cmd: 'create_event' }, createEventDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.eventService.send({ cmd: 'get_events' }, {});
  }
} 
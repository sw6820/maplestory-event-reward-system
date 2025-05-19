import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from '../../../apps/event/src/event/event.controller';
import { EventService } from '../../../apps/event/src/event/event.service';
import { getModelToken } from '@nestjs/mongoose';
import { Event } from '../../../apps/event/src/event/schemas/event.schema';

describe('EventController', () => {
  let controller: EventController;

  const mockEvent = {
    title: 'Test Event',
    condition: 'Login 3 days',
    status: 'ACTIVE' as 'ACTIVE',
    startAt: new Date(),
    endAt: new Date(),
  };

  const mockEventService = {
    create: jest.fn().mockResolvedValue(mockEvent),
    findAll: jest.fn().mockResolvedValue([mockEvent]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        { provide: EventService, useValue: mockEventService },
        { provide: getModelToken(Event.name), useValue: {} },
      ],
    }).compile();

    controller = module.get<EventController>(EventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an event', async () => {
    const dto = mockEvent;
    await expect(controller.create(dto)).resolves.toEqual(mockEvent);
  });

  it('should return all events', async () => {
    await expect(controller.findAll()).resolves.toEqual([mockEvent]);
  });
}); 
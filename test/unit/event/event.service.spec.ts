import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from '../../../apps/event/src/event/event.service';
import { getModelToken } from '@nestjs/mongoose';
import { Event } from '../../../apps/event/src/event/schemas/event.schema';

describe('EventService', () => {
    let service: EventService;

    const mockEvent = {
        title: 'Test Event',
        condition: 'Login 3 days',
        status: 'ACTIVE' as 'ACTIVE',
        startAt: new Date(),
        endAt: new Date(),
    };

    const mockEventModel = jest.fn().mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(mockEvent),
    })) as any;
    mockEventModel.find = jest.fn().mockReturnThis();
    mockEventModel.exec = jest.fn().mockResolvedValue([mockEvent]);

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventService,
                {
                    provide: getModelToken(Event.name),
                    useValue: mockEventModel,
                },
            ],
        }).compile();

        service = module.get<EventService>(EventService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create an event', async () => {
        const result = await service.create(mockEvent);
        expect(result).toEqual(mockEvent);
    });

    it('should return all events', async () => {
        mockEventModel.find.mockReturnThis();
        mockEventModel.exec.mockResolvedValue([mockEvent]);
        const result = await service.findAll();
        expect(result).toEqual([mockEvent]);
    });
});
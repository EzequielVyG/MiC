import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	UploadedFiles,
	UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MulterFile } from 'multer';
import { ActionEventInMyPlace } from 'src/domain/event/case/actionEventInMyPlace.case';
import { ActionEventOrganization } from 'src/domain/event/case/actionEventOrganization.case';
import { CreateEvent } from 'src/domain/event/case/createEvent.case';
import { DeleteEvent } from 'src/domain/event/case/deleteEvent.case';
import { FindAllEvents } from 'src/domain/event/case/findAllEvents.case';
import { FindEventByCategories } from 'src/domain/event/case/findByCategories';
import { FindEventByCategory } from 'src/domain/event/case/findByCategory';
import { FindEventById } from 'src/domain/event/case/findByID.case';
import { FindByStatus } from 'src/domain/event/case/findByStatus.case';
import { FindEventsByFilters } from 'src/domain/event/case/findByUser.case';
import { FindFirst15VigentEvents } from 'src/domain/event/case/findFirst15VigentEvents';
import { FindEventsWithinOneDay } from 'src/domain/event/case/findEventsWithinOneDay';
import { FindVigentByPlace } from 'src/domain/event/case/findVigenteByPlace';
import { FindVigents } from 'src/domain/event/case/findVigents.case';
import { UpdateEvent } from 'src/domain/event/case/updateEvent.case';
import { EventStatus } from 'src/domain/event/model/event-status.enum';
import { responseJson } from 'src/util/responseMessage';
import { Event } from '../../../../domain/event/model/event.entity';
import { ParticipantRepository } from '../../typeorm/repository/participant.repository';
import { CreateEventInput } from '../input/create-event-input';
import { EventFiltersInput } from '../input/filter-events';
import { RejectEventInput } from '../input/reject-event-input';
import { EventStatusInput } from '../input/status-event-input';
import { UpdateEventInput } from '../input/update-event-input';
import { EventRestMapper, EventStatusMessageMap } from '../mapper/event-rest-mapper';
import { EventPayload } from '../payload/event-payload';
import { CronJob } from 'cron';
import { EventNotificationService } from 'src/cron/eventNotificationService';

@Controller('events')
export class EventController {
	constructor(
		private readonly findAllEvents: FindAllEvents,
		private readonly findEventById: FindEventById,
		private readonly findEventsByFilters: FindEventsByFilters,
		private readonly findVigentByPlace: FindVigentByPlace,
		private readonly createEvent: CreateEvent,
		private readonly deleteEvent: DeleteEvent,
		private readonly updateEvent: UpdateEvent,
		private readonly findEventByStatus: FindByStatus,
		private readonly findByCategory: FindEventByCategory,
		private readonly actionEventInMyPlace: ActionEventInMyPlace,
		private readonly findFirst15VigentEvent: FindFirst15VigentEvents,
		private readonly actionEventOrganization: ActionEventOrganization,
		private readonly participantRepository: ParticipantRepository,
		private readonly findByCategories: FindEventByCategories,
		private readonly findVigents: FindVigents,
		private readonly findEventsWithinOneDays: FindEventsWithinOneDay,
		private readonly eventNotificationService: EventNotificationService,
	) { this.setupCronJob(); }

	@Get()
	async findAll(): Promise<EventPayload[]> {
		try {
			const someEvents: Event[] = await this.findAllEvents.findAll();
			return responseJson(
				200,
				'Eventos recuperados con exito',
				someEvents.map((aEvent) => {
					return EventRestMapper.toPayload(aEvent);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('/byCategories')
	async findEventByCategories(
		@Query('categories') categoryId: string[]
	): Promise<EventPayload[]> {
		try {
			const someEvents = await this.findByCategories.findByCategories(
				categoryId
			);

			return responseJson(
				200,
				'Eventos recuperados con exito',
				someEvents.map((aEvent) => {
					return EventRestMapper.toPayload(aEvent);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('/category/:categoryId')
	async findEventByCategory(
		@Param('categoryId') categoryId: string
	): Promise<EventPayload[]> {
		try {
			const someEvents = await this.findByCategory.findByCategory(categoryId);

			return responseJson(
				200,
				'Eventos recuperados con exito',
				someEvents.map((aEvent) => {
					return EventRestMapper.toPayload(aEvent);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('id/:id')
	async findById(@Param('id') id: string): Promise<EventPayload> {
		try {
			const aEvent: Event = await this.findEventById.findById(id);

			return responseJson(
				200,
				'Evento recuperado con exito',
				EventRestMapper.toPayload(aEvent)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('filters')
	async findByUser(
		@Query() filters: EventFiltersInput
	): Promise<EventPayload> {
		try {
			const someEvents: Event[] =
				await this.findEventsByFilters.findByFilters(
					JSON.parse(filters.statuses),
					JSON.parse(filters.organizations)
				);
			return responseJson(
				200,
				'Eventos recuperados con exito',
				someEvents.map((aEvent) => {
					return EventRestMapper.toPayload(aEvent);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('/eventos_vigentes_place/:id_place')
	async findVigentByplace(
		@Param('id_place') id_place: string
	): Promise<EventPayload> {
		try {
			const someEvents: Event[] =
				await this.findVigentByPlace.findVigentByPlace(id_place);
			return responseJson(
				200,
				'Eventos recuperados con exito',
				someEvents.map((aEvent) => {
					return EventRestMapper.toPayload(aEvent);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('/eventos_vigentes_first_15')
	async findFirst15VigentEvents(@Query('lat') lat: number,
		@Query('lng') lng: number): Promise<EventPayload> {
		try {
			const someEvents: Event[] =
				await this.findFirst15VigentEvent.findFirst15VigentEvents(lat, lng);
			return responseJson(
				200,
				'Los primeros 15 eventos vigentes se han recuperado con éxito',
				someEvents.map((aEvent) => {
					return EventRestMapper.toPayload(aEvent);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Post()
	@UseInterceptors(FilesInterceptor('files'))
	async create(
		@Body() event: CreateEventInput,
		@UploadedFiles() files: MulterFile[]
	): Promise<EventPayload> {
		try {
			files = files ? files : [];
			for (const aFoto of files) {
				let extension = aFoto.originalname.split('.');
				extension = '.' + extension[extension.length - 1];
				aFoto.originalName = event.name + extension;
				aFoto.mimetype = 'image/jpg';
			}
			const aEvent = await this.createEvent.create(
				event.name,
				event.description,
				event.minors,
				event.place !== '' ? JSON.parse(event.place) : null,
				event.principalCategory !== ''
					? JSON.parse(event.principalCategory)
					: null,
				event.categories !== '' ? JSON.parse(event.categories) : [],
				event.creator !== '' ? JSON.parse(event.creator) : null,
				event.startDate,
				event.endDate,
				event.price,
				event.url,
				'WEB',
				files,
				(event.isDraft as unknown as string) !== ''
					? JSON.parse(event.isDraft as unknown as string)
					: false,
				event.participants !== '' ? JSON.parse(event.participants) : [],
				event.urlTicketera,
			);
			return responseJson(
				200,
				`Evento creado: ${EventStatusMessageMap[aEvent.status as EventStatus]}`,
				EventRestMapper.toPayload(aEvent)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Put()
	@UseInterceptors(FilesInterceptor('files'))
	async update(
		@Body() event: UpdateEventInput,
		@UploadedFiles() files: MulterFile[]
	): Promise<EventPayload> {
		try {
			files = files ? files : [];
			for (const aFoto of files) {
				let extension = aFoto.originalname.split('.');
				extension = '.' + extension[extension.length - 1];
				aFoto.originalName = event.name + extension;
				aFoto.mimetype = 'image/jpg';
			}

			const aEvent = await this.updateEvent.update(
				event.id,
				event.name,
				event.description,
				event.minors,
				(event.place as unknown as string) !== ''
					? JSON.parse(event.place as unknown as string)
					: null,
				(event.principalCategory as unknown as string) !== ''
					? JSON.parse(event.principalCategory as unknown as string)
					: null,
				event.categories !== '' ? JSON.parse(event.categories) : [],
				event.startDate,
				event.endDate,
				event.price,
				(event.photos as unknown as string) !== ''
					? JSON.parse(event.photos)
					: [],
				(event.flyers as unknown as string) !== ''
					? JSON.parse(event.flyers)
					: [],
				event.url,
				files,
				(event.isDraft as unknown as string) !== ''
					? JSON.parse(event.isDraft as unknown as string)
					: false,
				(event.participants as unknown as string) !== '[]'
					? JSON.parse(event.participants)
					: [],
				event.urlTicketera,
			);

			return responseJson(
				200,
				`Evento actualizado: ${EventStatusMessageMap[aEvent.status as EventStatus]}`,
				EventRestMapper.toPayload(aEvent)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Delete('/id/:id')
	async delete(@Param('id') id: string): Promise<EventPayload> {
		try {
			const aEvent: Event = await this.deleteEvent.delete(id);
			return responseJson(
				200,
				'Evento eliminado con exito',
				EventRestMapper.toPayload(aEvent)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Post('/byStatus')
	async findByStatus(@Body() event: EventStatusInput): Promise<EventPayload> {
		try {
			const someEvents = await this.findEventByStatus.findByStatuses(
				event.statuses
			);

			return responseJson(200, 'Eventos recuperados con exito', someEvents);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('/vigentes')
	async findVigentes(): Promise<EventPayload> {
		try {
			const someEvents = await this.findVigents.findAll();
			return responseJson(200, 'Eventos recuperados con exito', someEvents);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Put('/acceptEvent/:id')
	async acceptEvent(@Param('id') id: string): Promise<EventPayload> {
		try {
			const aEvent: Event = await this.actionEventInMyPlace.accept(id);

			return responseJson(
				200,
				'Evento aceptado en tu lugar con exito',
				EventRestMapper.toPayload(aEvent)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Put('/rejectEvent/:id')
	async rejectEvent(
		@Param('id') id: string,
		@Body() body: RejectEventInput
	): Promise<EventPayload> {
		try {
			const aEvent: Event = await this.actionEventInMyPlace.reject(
				id,
				body.reason
			);

			return responseJson(
				200,
				'Evento rechazado en tu lugar con exito',
				EventRestMapper.toPayload(aEvent)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Put('/cancelEvent/:id')
	async cancelEvent(@Param('id') id: string): Promise<EventPayload> {
		try {
			const aEvent: Event = await this.updateEvent.cancel(id);

			return responseJson(
				200,
				'Evento cancelado con exito',
				EventRestMapper.toPayload(aEvent)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Put('/acceptOrganization/:idEvent/:idOrganization')
	async acceptOrganization(
		@Param('idEvent') idEvent: string,
		@Param('idOrganization') idOrganization: string
	): Promise<EventPayload> {
		try {
			const aEvent: Event = await this.actionEventOrganization.accept(
				idEvent,
				idOrganization
			);
			return responseJson(
				200,
				'Tu organización participará en este evento',
				EventRestMapper.toPayload(aEvent)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Put('/rejectOrganization/:idEvent/:idOrganization')
	async rejectOrganization(
		@Param('idEvent') idEvent: string,
		@Param('idOrganization') idOrganization: string,
		@Body() body: RejectEventInput
	): Promise<EventPayload> {
		try {
			const aEvent: Event = await this.actionEventOrganization.reject(
				idEvent,
				idOrganization,
				body.reason
			);

			return responseJson(
				200,
				'Tu organización NO participará en este evento',
				EventRestMapper.toPayload(aEvent)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('/status/:idEvent/:idOrganization')
	async findStatus(
		@Param('idEvent') idEvent: string,
		@Param('idOrganization') idOrganization: string
	): Promise<string> {
		try {
			const status = await this.participantRepository.findStatus(
				idEvent,
				idOrganization
			);
			return responseJson(200, 'Estado recuperado con exito', status);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('/eventos_notificables')
	async findEventsWithinOneDay(): Promise<any[]> {
		try {
		  const events = await this.findEventsWithinOneDays.findEventsWithinOneDay();
		  return events;
		} catch (error) {
		  console.error(error);
		  return [];
		}
	  }

	  private setupCronJob() {
		const job = new CronJob('*/15 * * * *', async () => {
		  await this.eventNotificationService.notifyUsersForEventsWithinOneHour();
		});
	
		job.start();
	  }

}

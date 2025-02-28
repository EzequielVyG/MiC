import { Test, TestingModule } from '@nestjs/testing';
import { FindPlaces } from '../case/findPlaces.case';
import { IPlaceRepository } from '../port/iPlaceRepository';
import { MockPlaceRepository } from './mock-place.repository';
import { Place } from '../model/place.entity';

const places: Place[] = [
    {
        id: '1',
        name: 'Place 1',
        description: '',
        note: '',
        schedules: [],
        photos: [],
        principalCategory: null,
        categories: [],
        url: '',
        cmi: '',
        phone: '',
        domicile: '',
        location: null,
        origin: 'TEST',
        minors: '',
        accessibilities: [],
        services: [],
        organization: null,
        facebook_url: '',
        twitter_url: '',
        instagram_url: '',
        events: null,
        createdAt: null,
        deletedAt: null,
        updatedAt: null
    },
    {
        id: '2',
        name: 'Place 2',
        description: '',
        note: '',
        schedules: [],
        photos: [],
        principalCategory: null,
        categories: [],
        url: '',
        cmi: '',
        phone: '',
        domicile: '',
        location: null,
        origin: 'TEST',
        minors: '',
        accessibilities: [],
        services: [],
        organization: null,
        facebook_url: '',
        twitter_url: '',
        instagram_url: '',
        events: null,
        createdAt: null,
        deletedAt: null,
        updatedAt: null
    },
    {
        id: '3',
        name: 'Place 3',
        description: '',
        note: '',
        schedules: [],
        photos: [],
        principalCategory: null,
        categories: [],
        url: '',
        cmi: '',
        phone: '',
        domicile: '',
        location: null,
        origin: 'TEST',
        minors: '',
        accessibilities: [],
        services: [],
        organization: null,
        facebook_url: '',
        twitter_url: '',
        instagram_url: '',
        events: null,
        createdAt: null,
        deletedAt: null,
        updatedAt: null
    },
];


describe('FindPlaces', () => {
    let findPlaces: FindPlaces;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FindPlaces,
                {
                    provide: IPlaceRepository,
                    useValue: new MockPlaceRepository(places),
                },
            ],
        }).compile();

        findPlaces = module.get<FindPlaces>(FindPlaces);
    });

    it('should be defined', () => {
        expect(findPlaces).toBeDefined();
    });

    it('should bring back all the places', async () => {
        const result = await findPlaces.findAll();
        expect(result).toEqual(places);
    });

    it('should find a place by name', async () => {
        const nameToFind = 'Place 1';
        const expectedPlace: Place = {
            id: '1',
            name: 'Place 1',
            description: '',
            note: '',
            schedules: [],
            photos: [],
            principalCategory: null,
            categories: [],
            url: '',
            cmi: '',
            phone: '',
            domicile: '',
            location: null,
            origin: 'TEST',
            minors: '',
            accessibilities: [],
            services: [],
            organization: null,
            facebook_url: '',
            twitter_url: '',
            instagram_url: '',
            events: null,
            createdAt: null,
            deletedAt: null,
            updatedAt: null
        }
        const result = await findPlaces.findByName(nameToFind);
        expect(result).toEqual(expectedPlace);
    });

    it('should find a place by id', async () => {
        const idToFind = '2';
        const expectedPlace: Place = {
            id: '2',
            name: 'Place 2',
            description: '',
            note: '',
            schedules: [],
            photos: [],
            principalCategory: null,
            categories: [],
            url: '',
            cmi: '',
            phone: '',
            domicile: '',
            location: null,
            origin: 'TEST',
            minors: '',
            accessibilities: [],
            services: [],
            organization: null,
            facebook_url: '',
            twitter_url: '',
            instagram_url: '',
            events: null,
            createdAt: null,
            deletedAt: null,
            updatedAt: null
        }
        const result = await findPlaces.findById(idToFind);
        expect(result).toEqual(expectedPlace);
    });

    // Similar tests for other methods...

});

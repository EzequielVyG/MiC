import { AccessControl } from "accesscontrol";

const grantsObject: any = {
    ADMIN: {
        faq: {
            'read:any': ['*'],
        },
        // Solicitudes de alta de organización
        organizationRequest: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']
        },
        // Lista de organizaciones y propias
        organizations: {
            'read:any': ['*'],
            'update:any': ['*'],
            // 'delete:any': ['*']
        },
        //Backoffice
        lveOrganizations: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']
        },
        // Solicitudes de alta de places
        placesRequest: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']
        },
        places: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']
        },
        // Solicitudes de alta de circuitos
        circuitsRequest: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']
        },
        circuits: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']
        },
        events: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']
        },
        eventsRequest: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']
        },
        user: {
            'read:any': ['*'],
            'update:any': ['*'],
            'update:own': ['*'],
            'read:own': ['*'],
        },
        notifications: {
            'read:any': ['*'],
            'update:any': ['*'],
        },
        users: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']
        },
    },
    GESTION_MIC: {
        // Solicitudes de alta de organización
        organizationRequest: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']
        },
        // Lista de organizaciones y propias
        organizations: {
            'read:any': ['*'],
            'update:any': ['*'],
            // 'delete:any': ['*']
        },
        //Backoffice
        lveOrganizations: {
            'create:own': ['*'],
            'read:own': ['*'],
            'update:own': ['*'],
            'delete:own': ['*']
        },
        // Solicitudes de alta de places
        placesRequest: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']
        },
        places: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']
        },
        // Solicitudes de alta de circuitos
        circuitsRequest: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']
        },
        circuits: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']
        },
        events: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']
        },
        eventsRequest: {
            'create:own': ['*'],
            'read:own': ['*'],
            'update:own': ['*'],
            'delete:own': ['*']
        },
        user: {
            'read:own': ['*'],
            'update:own': ['*']
        },
        notifications: {
            'read:any': ['*'],
            'update:any': ['*'],
        },
        users: {
            'create:own': ['*'],
            'read:own': ['*'],
            'update:own': ['*'],
            'delete:own': ['*']
        },
    },
    CONSUMIDOR: {
        faq: {
            'read:any': ['*'],
        },
        // Solicitudes de alta de organización
        organizationRequest: {
            'create:own': ['*'],
            'read:own': ['*'],
            'update:own': ['*'],
            'delete:own': ['*']
        },
        // Lista de organizaciones y propias
        organizations: {
            'read:any': ['*'],
            'update:any': ['*'],
            // 'delete:any': ['*']
        },
        //Backoffice
        lveOrganizations: {
            'create:own': ['*'],
            'read:own': ['*'],
            'update:own': ['*'],
            'delete:own': ['*']
        },
        // Solicitudes de alta de places
        placesRequest: {
            'create:own': ['*'],
            'read:own': ['*'],
            'update:own': ['*'],
            'delete:own': ['*']
        },
        places: {
            'create:own': ['*'],
            'read:any': ['*'],
            'update:own': ['*'],
            // 'delete:any': ['*']
        },
        // Solicitudes de alta de circuitos
        circuitsRequest: {
            'create:own': ['*'],
            'read:own': ['*'],
            'update:own': ['*'],
            'delete:own': ['*']
        },
        circuits: {
            'create:own': ['*'],
            'read:any': ['*'],
            'update:own': ['*'],
            // 'delete:any': ['*']
        },
        events: {
            'create:own': ['*'],
            'read:any': ['*'],
            'update:own': ['*'],
            // 'delete:any': ['*']
        },
        eventsRequest: {
            'create:own': ['*'],
            'read:own': ['*'],
            'update:own': ['*'],
            'delete:own': ['*']
        },
        user: {
            'read:own': ['*'],
            'update:own': ['*']
        },
        notifications: {
            'read:any': ['*'],
            'update:any': ['*'],
        },
        users: {
            'create:own': ['*'],
            'read:own': ['*'],
            'update:own': ['*'],
            'delete:own': ['*']
        },
    }
};

const ac = new AccessControl(grantsObject);

export default ac;

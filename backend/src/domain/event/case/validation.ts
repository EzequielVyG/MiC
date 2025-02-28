import { Organization } from 'src/domain/organization/model/organization.entity';
import { Minors } from 'src/domain/place/model/minors.enum';
import { Event } from '../model/event.entity';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function esURL(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
}

function isValidMinors(value: string): boolean {
    return Object.values(Minors).includes(value as Minors);
}

function isValidRangeDate(startDate: Date, endDate: Date): boolean {
    return startDate < endDate
}

function esFechaValida(fecha) {
    return !isNaN(fecha) && fecha instanceof Date;
}



export function validateEvent(aEvent: Event, placeOrganization: Organization): void {

    if (aEvent.minors && !isValidMinors(aEvent.minors)) {
        throw new Error('Calificacion de menores invalida');
    }

    if (aEvent.startDate && !esFechaValida(aEvent.startDate)) {
        throw new Error('Fecha de inicio no es una fecha valida');
    }

    if (aEvent.endDate && !esFechaValida(aEvent.endDate)) {
        throw new Error('Fecha de finalizacion no es una fecha valida');
    }

    if (aEvent.startDate && aEvent.endDate && !isValidRangeDate(aEvent.startDate, aEvent.endDate)) {
        throw new Error('Ficha de finalizacion debe ser despues que la fecha de inicio');
    }

    if (!aEvent.creator) {
        throw new Error('Creador de Evento requerido');
    }

    if (!aEvent.place) {
        throw new Error('Lugar de evento requerido');
    }

    if (!placeOrganization) {
        throw new Error('No puede crear un evento en un lugar sin organizacion');
    }

    //esto ya no haria falta con las notificaciones
    // if (placeOrganization.owner.id !== aEvent.creator.id && !placeOrganization.operators.some((operador) => operador.id === aEvent.creator.id)) {
    //     throw new Error('No puede crear un evento en un lugar de una organizacion ajena');
    // }

    // if (!esURL(aPlace.url)) {
    //     throw new Error("URL invalida")
    // }


}

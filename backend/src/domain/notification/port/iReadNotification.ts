export interface IReadNotification {
    readOne(id: string)
    readAll(email: string)
}

export const IReadNotification = Symbol('IReadNotification');

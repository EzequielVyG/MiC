export enum EventStatus {
	SCHEDULED = 'SCHEDULED',
	CANCELED = 'CANCELED',
	DRAFT = 'DRAFT',
	// Ya no hacen falta, se engloban todos en scheduled
	/* IN_PROGRESS = 'IN_PROGRESS',
	FINISHED = 'FINISHED',
	POSTPONED = 'POSTPONED', */
	PENDING = 'PENDING',
}

export interface IfindContrasenia {
	findByContrasenia(email: string): Promise<boolean>;
}

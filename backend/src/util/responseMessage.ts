export function responseJson(code: number, text: string): any;
export function responseJson(code: number, text: string, json: any): any;

export function responseJson(code: number, text: string, json?: any): any {
	if (json) {
		return {
			statusCode: code,
			message: text,
			data: json,
		};
	} else {
		return {
			statusCode: code,
			message: text,
		};
	}
}

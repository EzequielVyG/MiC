const HOST = process.env.NEXT_PUBLIC_HOST_SERVER;
const HOST_LOGIN = process.env.NEXT_PRIVATE_HOST_SERVER;
const PORT = process.env.NEXT_PUBLIC_PORT_SERVER;
const PORT_LOGIN = process.env.NEXT_PRIVATE_PORT_SERVER;

export const URL = `${HOST}:${PORT}`;
export const URL_NEXT_AUTH = `${HOST_LOGIN}:${PORT_LOGIN}`;
export const ANALYTICS_ID = process.env.NEXT_PUBLIC_ANALYTICS_MEASUREMENT_ID;

/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: process.env.NEXT_PUBLIC_HOST_SERVER,
	generateRobotsTxt: true,
	// additionalPaths: [
	// 	'https://mic-ar.com.ar',
	// 	'https://mic-ar.ar',
	// 	'https://mapainteractivocultural.com.ar',
	// 	// Puedes agregar más rutas adicionales si es necesario
	// ],
	changefreq: 'daily', // Puedes ajustar según tus necesidades
	priority: 0.7, // Puedes ajustar según tus necesidades
	sitemapBaseFileName: 'sitemap', // Puedes ajustar según tus necesidades
	// Otras configuraciones generales si es necesario
};

/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: process.env.NEXT_PUBLIC_HOST_SERVER,
	generateRobotsTxt: true,
	changefreq: 'daily', // Puedes ajustar según tus necesidades
	priority: 0.7, // Puedes ajustar según tus necesidades
	sitemapBaseFileName: 'sitemap', // Puedes ajustar según tus necesidades
};

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/components/Theme';
import type { AppProps } from 'next/app';
import { LanguageProvider } from '@/components/Language/LanguageProvider';
import Splash from '@/components/Splash/Splash';
import './events/detail/edit.css'; // Importa tu hoja de estilo global aquí

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps) {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false);
		}, 2000);
	}, []);

	return (
		<LanguageProvider>
			<SessionProvider session={session}>
				<ThemeProvider theme={theme}>
					<Head>
						<title>MIC - Mapa Interactivo Cultural</title>
						<meta name="description" content="Descubre todos los atractivos turísticos de Puerto Madryn con el Mapa Interactivo Cultural. ¡Explora la ciudad en la palma de tu mano!" />
						<meta name="keywords" content="mapa interactivo cultural, mapa interactivo, mapa cultural, mic, puerto madryn, madryn, turismo, atractivos turísticos, explorar, ciudad, cultura, viaje, consumos culturales, arte, música, teatro, entretenimiento, deportes, espectáculos, cine, circuitos, lugares, eventos, shows, gastronomia, comidas, agenda, agenda cultural" />

						<link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
						<link rel='icon' href='/icono_pequeno_Mesa_de_trabajo_1.svg' />

						{/* Internal Links */}
						<link rel="alternate" href="https://mic-ar.ar" />

						{/* Add other canonical links for other domains */}
						<link rel="alternate" href="https://mapainteractivocultural.com.ar" />
						<link rel="alternate" href="https://mic-ar.com.ar" />
						<link rel="canonical" href="https://mapainteractivocultural.ar" />

					</Head>
					{isLoading ? <Splash /> : <Component {...pageProps} />}
				</ThemeProvider>
			</SessionProvider>
		</LanguageProvider>
	);
}

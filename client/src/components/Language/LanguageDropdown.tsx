import React from 'react';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useRouter } from 'next/router';
import { useLanguage } from './LanguageProvider';
import Image from 'next/image';
import enFlag from '../../../public/flags/us.svg';
import arFlag from '../../../public/flags/ar.svg';

const LanguageDropdown: React.FC = () => {
	const router = useRouter();
	const { selectedLanguage, changeLanguage } = useLanguage(); // Consumir el contexto de idioma

	const handleLanguageChange = (event: SelectChangeEvent<any>) => {
		const newLanguage = event.target.value as string;
		changeLanguage(newLanguage); // Cambiar el idioma utilizando la función del contexto
		router.replace(
			{
				pathname: router.pathname,
				query: router.query,
			},
			router.asPath,
			{
				locale: newLanguage,
			}
		);
	};

	return (
		<Select
			autoWidth
			value={selectedLanguage}
			size='small'
			sx={{ borderRadius: 10 }}
			onChange={handleLanguageChange}
		>
			<MenuItem value='en'>
				{'English '}&nbsp;
				<Image src={enFlag} alt='English Flag' width={20} height={14} />
			</MenuItem>
			<MenuItem value='es'>
				{'Español '}&nbsp;
				<Image src={arFlag} alt='Arg Flag' width={20} height={14} />
			</MenuItem>
		</Select>
	);
};

export default LanguageDropdown;

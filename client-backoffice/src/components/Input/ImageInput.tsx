import React, { useRef, useState } from 'react';
import { Button, Typography } from '@mui/material';
import { useFormikContext } from 'formik';

type ImageInputProps = {
	name: string;
	label: string;
	accept?: string;
	disabled?: boolean;
	required?: boolean;
	onChange: (file: File | null) => void; // Añadimos el onChange a las props
};

const ImageInput: React.FC<ImageInputProps> = ({
	name,
	label,
	accept = 'image/jpeg, image/png, image/png',
	disabled = false,
	required = false,
	onChange, // Recibimos onChange de las props
}) => {
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const { setFieldValue } = useFormikContext();
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target?.files;
		if (files && files.length > 0) {
			setSelectedFile(files[0]);
			setFieldValue(name, files[0]);
			onChange(files[0]); // Llamamos al onChange de las props con el archivo seleccionado
		} else {
			setSelectedFile(null);
			setFieldValue(name, null);
			onChange(null); // Llamamos al onChange de las props con null cuando no hay archivo seleccionado
		}
	};

	const handleButtonClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	return (
		<>
			<input
				type='file'
				accept={accept}
				ref={fileInputRef}
				style={{ display: 'none' }}
				onChange={handleFileChange}
				disabled={disabled}
				required={required}
			/>
			<Button
				variant='contained'
				onClick={handleButtonClick}
				disabled={disabled}
			>
				{label}
			</Button>
			{required && !selectedFile && (
				<Typography color='error'>This field is required.</Typography>
			)}
		</>
	);
};

export default ImageInput;

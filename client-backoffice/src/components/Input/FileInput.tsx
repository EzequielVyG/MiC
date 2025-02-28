import React, { useRef } from 'react';
import { Button } from '@mui/material';

type FileUploadProps = {
	// name: string;
	label: string;
	accept?: string;
	disabled?: boolean;
	required?: boolean;
	onChange: (file: File[] | null) => void; // Añadimos el onChange a las props
};

const FileUpload: React.FC<FileUploadProps> = ({
	label,
	accept = 'image/*',
	disabled = false,
	required = false,
	onChange,
}) => {
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newFiles = Array.from(event.target.files || []);
		onChange(newFiles); // Llamamos al onChange de las props con el archivo seleccionado
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
				multiple={true}
			/>
			<Button
				variant='contained'
				onClick={handleButtonClick}
				disabled={disabled}
			>
				{label}
			</Button>
		</>
	);
};

export default FileUpload;

import React from 'react';
import { FieldProps, useField, useFormikContext } from 'formik';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

type DateInputProps = {
	name: string;
	label: string;
	defaultValue: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const MyDateInput: React.FC<FieldProps & DateInputProps> = ({
	field,
	...props
}) => {
	const [fielda] = useField(props.name);
	const { setFieldValue } = useFormikContext();
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<DatePicker
				format='DD/MM/YYYY'
				{...field}
				{...props}
				value={fielda.value ?? null}
				onChange={(val) => setFieldValue(props.name, val?.$d)}
				sx={{ width: '100%' }}
			/>
		</LocalizationProvider>
	);
};

export default MyDateInput;

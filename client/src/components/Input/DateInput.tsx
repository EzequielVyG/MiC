import React from 'react';
import { FieldProps, useField, useFormikContext } from 'formik';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

type DateInputProps = {
	name: string;
	label: string;
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
			<DateTimePicker
				format='DD/MM/YYYY'
				{...field}
				{...props}
				value={fielda.value ? dayjs(fielda.value) : null}
				ampm={false}
				onChange={(val) =>
					val
						? setFieldValue(props.name, val.toString())
						: undefined
				}
				sx={{ width: '100%' }}
			/>
		</LocalizationProvider>
	);
};

export default MyDateInput;

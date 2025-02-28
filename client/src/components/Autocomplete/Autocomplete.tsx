// MyAutocomplete.tsx

import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

interface MyAutocompleteProps {
	name: string;
	label: string;
	options: string[];
	onChange: (
		event: React.SyntheticEvent<Element, Event>,
		values: string[]
	) => void;
	values: string[];
	multiple: boolean;
}

const MyAutocomplete: React.FC<MyAutocompleteProps> = ({
	name,
	label,
	options,
	onChange,
	values,
	multiple,
}) => {
	return (
		<Autocomplete
			multiple={multiple}
			id={name}
			options={options}
			value={values}
			onChange={(event, newValues) => onChange(event, newValues as string[])}
			renderInput={(params) => <TextField {...params} label={label} />}
		/>
	);
};

export default MyAutocomplete;

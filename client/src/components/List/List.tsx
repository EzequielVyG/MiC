import React from 'react';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

type GenericListProps = {
	// name: string;
	elements: any[];
	onDelete: (index: number) => void; // Añadimos el onChange a las props
};

const GenericList: React.FC<GenericListProps> = ({ elements, onDelete }) => {
	return (
		<List>
			{elements.map((file: any, index: number) => (
				<ListItem key={index}>
					<ListItemText primary={file.name} />
					<IconButton
						edge='end'
						aria-label='delete'
						onClick={() => onDelete(index)}
					>
						<DeleteIcon />
					</IconButton>
				</ListItem>
			))}
		</List>
	);
};

export default GenericList;

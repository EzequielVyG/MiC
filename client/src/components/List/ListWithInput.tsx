import React, { Dispatch, SetStateAction, useState } from 'react';
import { List, ListItem, ListItemText, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

type GenericListProps = {
    // name: string;
    elements: any[];
    onDelete: (index: number) => void; // Añadimos el onChange a las props
    someDescriptions: string[];
    handleTextChange: Dispatch<SetStateAction<string[]>>;
};

const GenericInputList: React.FC<GenericListProps> = ({ elements, onDelete, someDescriptions, handleTextChange }) => {

    const [descriptions] = useState<string[]>([]);

    const onChangeText = (event: React.ChangeEvent<any>, index: number) => {
        descriptions[index] = event.target.value;
        someDescriptions[index] = event.target.value;
        handleTextChange(someDescriptions);
        // handleTextChange(someDescriptions);
    };

    return (
        <List>
            {elements.map((file: any, index: number) => (
                <>
                    <ListItem key={index}>
                        <ListItemText primary={file.name} />
                        <IconButton
                            edge='end'
                            aria-label='delete'
                            onClick={() => onDelete(index)}
                        >
                            <DeleteIcon />
                        </IconButton>
                        <br />

                    </ListItem>
                    <TextField
                        name={file.name}
                        value={descriptions[index]}
                        onChange={(event: React.ChangeEvent) => onChangeText(event, index)}
                        label='Descripcion'
                        required
                    />
                </>
            ))}
        </List>
    );
};

export default GenericInputList;
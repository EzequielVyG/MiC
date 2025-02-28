import React from 'react';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

type OperatorListProps = {
    // name: string;
    elements: any[];
    atributo?: string;
    colorRef?: any;
    t?: any;
    onDelete: (index: number) => void; // Añadimos el onChange a las props
};

const OperatorList: React.FC<OperatorListProps> = ({ elements, onDelete, colorRef, t }) => {

    return (
        <List>
            {elements.map((object: any, index: number) => (
                <ListItem style={{
                    paddingTop: 0, paddingBottom: 0, marginBottom: 5, borderRadius: 8, backgroundColor: object.status ? `${colorRef[object.status]}` : 'transparent',
                }} key={index}>
                    <ListItemText primary={object.user ? object.user.email : object.email} secondary={object.status && t['estadosOperador'][object.status]} />
                    {object.status !== 'PENDING' &&
                        <IconButton
                            edge='end'
                            aria-label='delete'
                            onClick={() => onDelete(index)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    }
                </ListItem>
            ))}
        </List>
    );
};

export default OperatorList;
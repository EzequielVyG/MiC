import React from 'react';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { OperatorStatus } from '@/features/Organizations/operatorStatusEnum';
import { OrganizationOperator } from '@/features/Organizations/OrganizationOperator';

type OperatorListProps = {
    // name: string;
    elements: OrganizationOperator[];
    atributo?: string;
    colorRef?: any;
    onDelete: (index: number) => void; // Añadimos el onChange a las props
};

const OperatorList: React.FC<OperatorListProps> = ({ elements, onDelete, colorRef }) => {

    return (
        <List>
            {elements.map((object: OrganizationOperator, index: number) => (
                <ListItem style={{
                    paddingTop: 0, paddingBottom: 0, marginBottom: 5, borderRadius: 8, backgroundColor: object.status ? `${colorRef[object.status]}` : 'transparent',
                }} key={index}>
                    <ListItemText primary={object.user.email} secondary={object.status && OperatorStatus[object.status as keyof typeof OperatorStatus]} />
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
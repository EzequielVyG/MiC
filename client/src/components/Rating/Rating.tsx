import React from 'react';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';

interface CustomRatingProps {
    value: number;
    size?: "small" | "medium" | "large";
    color?: string;
    emptyColor?: string;
}

const CustomRating: React.FC<CustomRatingProps> = ({ value, size = "small", color, emptyColor }) => {
    return (
        <Rating
            name="read-only"
            value={value}
            icon={<StarIcon style={{ color: color }} />}
            emptyIcon={<StarIcon style={{ color: emptyColor }} />}
            readOnly
            size={size}
        />
    );
};

export default CustomRating;

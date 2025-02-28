import Button from "@/components/Button/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import React from "react";

type FAQItemProps = {
  question: string;
  answer: string;
  nameButton?: string;
  onClick?: () => void;
};

const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  nameButton,
  onClick,
}) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{question}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {answer.split("\n").map((line, index) => (
          <Typography key={index} gutterBottom align="left">
            {line}
          </Typography>
        ))}{" "}
        <br />
        {nameButton && <Button label={nameButton} onClick={onClick} />}
      </AccordionDetails>
    </Accordion>
  );
};

export default FAQItem;

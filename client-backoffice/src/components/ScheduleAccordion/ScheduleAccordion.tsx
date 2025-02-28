import { PlaceSchedule } from "@/features/PlacesSchedules/place_schedule";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material";
import React from "react";

type ScheduleAccordionProps = {
  schedules: PlaceSchedule[];
};

const ScheduleAccordion: React.FC<ScheduleAccordionProps> = ({ schedules }) => {
  const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const todayIndex = new Date().getDay();
  const reorderedDays = [...daysOfWeek.slice(todayIndex), ...daysOfWeek.slice(0, todayIndex)];

  const normalizeString = (str: string) =>
    str
      .toLocaleLowerCase("es")
      .replace(/[áéíóú]/g, match => "aeiou"["áéíóú".indexOf(match)]);

  // Ordena los horarios por hora de apertura ascendente
  const sortedSchedules = [...schedules].sort((a, b) => a.openingHour.localeCompare(b.openingHour));

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <Typography>Horarios</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {reorderedDays.map((day, index) => {
          const normalizedDay = normalizeString(day);
          const schedulesForDay = sortedSchedules.filter(schedule => normalizeString(schedule.dayOfWeek!.name) === normalizedDay);

          return (
            <Typography key={index}>
              {day}:{" "}
              {schedulesForDay.length > 0 ? (
                schedulesForDay
                  .map((schedule, index) => (
                    <React.Fragment key={index}>
                      {schedule.openingHour !== "" && schedule.closingHour !== ""
                        ? `${schedule.openingHour.slice(0, 5)}-${schedule.closingHour.slice(0, 5)}`
                        : ""}
                      {index < schedulesForDay.length - 1 && " y "}
                    </React.Fragment>
                  ))
              ) : (
                "Cerrado"
              )}
            </Typography>
          );
        })}
      </AccordionDetails>
    </Accordion>
  );
};

export default ScheduleAccordion;

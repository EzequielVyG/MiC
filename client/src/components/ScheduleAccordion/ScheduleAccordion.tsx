import { PlaceSchedule } from "@/features/PlacesSchedules/place_schedule";
import en from "@/locale/en";
import es from "@/locale/es";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import Label from "../Label/Label";
import Tag from "../Tag/Tag";

type ScheduleAccordionProps = {
  schedules: PlaceSchedule[];
};

const ScheduleAccordion: React.FC<ScheduleAccordionProps> = ({ schedules }) => {
  const router = useRouter();
  const { locale } = router;
  const t: any = locale === "en" ? en : es;
  const daysOfWeek = [
    t["daysOfWeek"][0], // Domingo
    t["daysOfWeek"][1], // Lunes
    t["daysOfWeek"][2], // Martes
    t["daysOfWeek"][3], // Miércoles
    t["daysOfWeek"][4], // Jueves
    t["daysOfWeek"][5], // Viernes
    t["daysOfWeek"][6], // Sábado
  ];
  const todayIndex = new Date().getDay();
  const reorderedDays = [
    ...daysOfWeek.slice(todayIndex),
    ...daysOfWeek.slice(0, todayIndex),
  ];

  const normalizeString = (str: string) => {
    if (str) {
      return str
        .toLocaleLowerCase("es")
        .replace(/[áéíóú]/g, (match) => "aeiou"["áéíóú".indexOf(match)]);
    }
    // En caso de que str sea undefined o null, devuelve una cadena vacía
    return "";
  };
  // Ordena los horarios por hora de apertura ascendente
  const sortedSchedules = [...schedules].sort((a, b) =>
    a.openingHour.localeCompare(b.openingHour)
  );

  const dayNameMapping = {
    Sunday: "Domingo",
    Monday: "Lunes",
    Tuesday: "Martes",
    Wednesday: "Miércoles",
    Thursday: "Jueves",
    Friday: "Viernes",
    Saturday: "Sábado",
  };

  return (
    <Accordion
      style={{ backgroundColor: "transparent", boxShadow: "none" }}
      disableGutters
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        style={{
          padding: 0,
        }}
      >
        <Tag text={t["schedules"]} />
      </AccordionSummary>
      <AccordionDetails
        style={{
          padding: 0,
          paddingBottom: 5,
        }}
      >
        {reorderedDays.map((day, index) => {
          // Obtén el nombre del día en español utilizando dayNameMapping
          let dayNameInSpanish = daysOfWeek[index];
          if (locale !== "es") {
            dayNameInSpanish =
              dayNameMapping[dayNameInSpanish as keyof typeof dayNameMapping];
          }

          // Filtra los horarios por el nombre del día en español
          const schedulesForDay = sortedSchedules.filter(
            (schedule) =>
              normalizeString(schedule.dayOfWeek!.name) ===
              normalizeString(dayNameInSpanish)
          );

          const hasSchedules = schedulesForDay.length > 0;
          const isWholeDayOpen =
            hasSchedules &&
            schedulesForDay.every(
              (schedule) =>
                schedule.openingHour === "00:00:00" &&
                schedule.closingHour === "23:59:00"
            );

          let labelText = "";
          if (isWholeDayOpen) {
            labelText = `${daysOfWeek[index]}:${t["openAllDay"]}`;
          } else if (hasSchedules) {
            labelText = `${daysOfWeek[index]}: ${schedulesForDay
              .map((schedule) =>
                schedule.openingHour !== "" && schedule.closingHour !== ""
                  ? `${schedule.openingHour.slice(
                      0,
                      5
                    )}-${schedule.closingHour.slice(0, 5)}`
                  : ""
              )
              .filter(Boolean) // Filtramos los valores vacíos
              .join(" y ")}`; // Unimos los horarios con " y "
          } else {
            labelText = `${daysOfWeek[index]}: ${t["close"]}`;
          }

          return <Label id={"card_description"} text={labelText} key={index} />;
        })}
      </AccordionDetails>
    </Accordion>
  );
};

export default ScheduleAccordion;

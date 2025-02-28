import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Menu,
  IconButton,
  Backdrop,
  AccordionSummary,
  Accordion,
  AccordionDetails,
  MenuItem,
  Box,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useRouter } from "next/router";
import en from "@/locale/en";
import es from "@/locale/es";
import Label from "../Label/Label";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface FilterPanelProps {
  sections: FilterSection[];
  onFilterChange: (selectedOptions: { [key: string]: string[] }) => void;
  initialSelectedOptions?: { [key: string]: string[] };
}

interface FilterSection {
  title: string;
  filters: string[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  sections,
  onFilterChange,
  initialSelectedOptions,
}) => {
  const router = useRouter();
  const { locale } = router;
  const t: any = locale === "en" ? en : es;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string[];
  }>({});

  useEffect(() => {
    setSelectedOptions({});
    if (initialSelectedOptions) {
      setSelectedOptions(initialSelectedOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionChange = (option: string, title: string) => {
    setSelectedOptions((prevSelectedOptions) => {
      const updatedSelectedOptions = { ...prevSelectedOptions };
      if (!updatedSelectedOptions[title]) {
        updatedSelectedOptions[title] = [];
      }
      if (updatedSelectedOptions[title].includes(option)) {
        updatedSelectedOptions[title] = updatedSelectedOptions[title].filter(
          (item) => item !== option
        );
      } else {
        updatedSelectedOptions[title].push(option);
      }
      return updatedSelectedOptions;
    });
  };

  const applyFilters = () => {
    onFilterChange(selectedOptions);
    handleClose();
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        <FilterListIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <div style={{ paddingLeft: 15 }}>
          <Label variant="h6" text={t["filter"]} />
        </div>
        <Box
          sx={{
            maxHeight: "55vh",
            overflowY: "auto",
          }}
        >
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <Accordion
                sx={{
                  boxShadow: "none",
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    cursor: "pointer",
                    transition: "transform 0.3s ease",
                    backgroundColor: "#F3F5F6",
                    borderRadius: 5,
                    margin: 1,
                    boxShadow: "none",
                  }}
                >
                  <Label variant="subtitle1" text={t[section.title]} />
                </AccordionSummary>
                <AccordionDetails>
                  {section.filters.map((option, optionIndex) => (
                    <MenuItem
                      key={optionIndex}
                      onClick={() => handleOptionChange(option, section.title)}
                    >
                      <Checkbox
                        checked={Boolean(
                          selectedOptions[section.title]?.includes(option)
                        )}
                      />
                      <Label
                        variant="subtitle1"
                        text={t[option] ? t[option] : option}
                      />
                    </MenuItem>
                  ))}
                </AccordionDetails>
              </Accordion>
            </div>
          ))}
          <div
            style={{ padding: 5, display: "flex", justifyContent: "center" }}
          >
            <Button onClick={applyFilters} variant="contained">
              {t["filter_button"]}
            </Button>
          </div>
        </Box>
      </Menu>
      <Backdrop
        open={Boolean(anchorEl)}
        style={{ zIndex: 1, color: "#fff", opacity: 0.3 }}
      />
    </div>
  );
};

export default FilterPanel;

import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

type TabPanelProps = {
    children?: React.ReactNode;
    index: number;
    value: number;
};

type TabData = {
    label: string;
    content: React.ReactNode;
};

type TabsProps = {
    tabs: TabData[];
    numberTab?: number,
};

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
    return (
        <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`}>
            {value === index && <Box p={3}>{children}</Box>}
        </div>
    );
};

const GenericTabs: React.FC<TabsProps> = ({ tabs, numberTab = 0 }) => {
    const [selectedTab, setSelectedTab] = useState(numberTab);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    return (
        <div>
            <Tabs value={selectedTab} onChange={handleChange} aria-label="Tabs">
                {tabs.map((tab, index) => (
                    <Tab key={index} label={tab.label} />
                ))}
            </Tabs>
            {tabs.map((tab, index) => (
                <TabPanel key={index} value={selectedTab} index={index}>
                    {tab.content}
                </TabPanel>
            ))}
        </div>
    );
};

export default GenericTabs;

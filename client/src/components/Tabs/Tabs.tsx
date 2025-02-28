import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { SxProps } from '@mui/material';

type TabPanelProps = {
	children?: React.ReactNode;
	index: number;
	value: number;
	hidden?: boolean; // Nueva prop para determinar si se muestra o no
};

type TabData = {
	label: string;
	content: React.ReactNode;
	hidden?: boolean; // Nueva prop para determinar si se muestra o no
	icon?: React.ReactElement;
};

type TabsProps = {
	tabs: TabData[];
	numberTab?: number;
	sx?: SxProps;
	onTabChange?: (index: number) => void; // Cambio de tipo para onTabChange
	selected?: number;
};

const TabPanel: React.FC<TabPanelProps> = ({
	children,
	value,
	index,
	hidden,
}) => {
	return (
		<div
			role='tabpanel'
			hidden={hidden || value !== index}
			id={`tabpanel-${index}`}
		>
			{value === index && <Box p={3}>{children}</Box>}
		</div>
	);
};

const GenericTabs: React.FC<TabsProps> = ({
	tabs,
	sx,
	onTabChange,
	selected,
}) => {
	selected = selected ? selected : 0;
	const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
		if (onTabChange) {
			onTabChange(newValue);
			selected = newValue;
		}
	};

	return (
		<div>
			<Tabs
				value={selected}
				onChange={handleChange}
				aria-label='Tabs'
				sx={sx}
				variant='scrollable'
				scrollButtons='auto'
			>
				{tabs.map((tab, index) => (
					<Tab
						key={index}
						label={tab.label}
						icon={tab.icon}
						iconPosition='start'
						sx={{ display: tab.hidden ? 'none' : 'flex' }}
					/>
				))}
			</Tabs>
			{tabs.map((tab, index) => (
				<TabPanel key={index} value={selected!} index={index}>
					{tab.content}
				</TabPanel>
			))}
		</div>
	);
};

export default GenericTabs;

import { create } from 'zustand';

interface MyEventsFilters {
	statusFilters: string[];
	setStatusFilters: (filters: string[]) => void;
}

const useMyEventsFilters = create<MyEventsFilters>((set) => ({
	statusFilters: ['Vigentes'],
	setStatusFilters: (filters) => {
		set(() => ({ statusFilters: filters }));
	},
}));

export default useMyEventsFilters;

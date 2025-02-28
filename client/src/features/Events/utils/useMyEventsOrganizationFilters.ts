import { create } from "zustand";

interface MyEventsOrganizationFilters {
    orgFilters: string[];
    setOrgFilters: (orgFilters: string[]) => void;
}

const useMyEventsOrganizationFilters = create<MyEventsOrganizationFilters>((set) => ({
    orgFilters: [],
    setOrgFilters: (filters) => {
        set(() => ({ orgFilters: filters }))
    }
}));

export default useMyEventsOrganizationFilters;
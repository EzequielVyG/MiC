import { User } from '@/features/Users/user';
import { create } from 'zustand';

interface MyUser {
	myUser: User | null;
	setMyUser: (user: User | null) => void;
}

const useMyUser = create<MyUser>((set) => ({
	myUser: null,
	setMyUser: (user) => {
		set(() => ({ myUser: user }));
	},
}));

export default useMyUser;

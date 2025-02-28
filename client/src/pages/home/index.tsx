import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Loading from '@/components/Loading/Loading';
import { getuserByEmail } from '@/features/Users/hooks/useGetUserByEmailQuery';
import { useSession } from 'next-auth/react';
import useSelectedCircuit from '@/hooks/useSelectedCircuit';

import ReactGA from 'react-ga4';
import { ANALYTICS_ID } from '../../features/constants';
import useMyUser from '@/hooks/useMyUser';

const HomePage = () => {
	const router = useRouter();
	const { data: session } = useSession();
	const { setMyUser } = useMyUser();

	const [isLoading, setIsLoading] = useState(true);
	const { selectedCircuit } = useSelectedCircuit();

	const fetchUser = async () => {
		setIsLoading(true);
		const user = (await getuserByEmail(session?.user?.email as string)).data;
		const context = user?.preferences?.initialContext
			? user.preferences.initialContext.toLowerCase()
			: 'events';
		if (context !== 'circuits') {
			router.push(`/home/${context}`);
		} else {
			const route = selectedCircuit ? '/home/circuits' : 'circuits';
			router.push(route);
		}
		setMyUser(user);
		setIsLoading(false);
	};

	useEffect(() => {
		setIsLoading(true);
		fetchUser();

		// Inicializar analytics
		if (ANALYTICS_ID) {
			ReactGA.initialize(ANALYTICS_ID);
		}

		setIsLoading(false);
	}, [session]);

	return <>{isLoading ? <Loading /> : <></>}</>;
};

export default HomePage;

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import BasicLayout from '@/layouts/BasicLayout';
import Button from '@/components/Button/Button';

import { activateUser } from '@/features/Users/hooks/useActivateUserQuery';
import MainLayout from '@/layouts/MainLayout';

const UserList = () => {
	const router = useRouter();
	const { id } = router.query;

	const [message, setMessage] = useState('');

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const activate = async () => {
		if (typeof id === 'string') {
			const response = await activateUser(id);
			setMessage(response.message);
		}
	};

	useEffect(() => {
		if (typeof id === 'string') {
			activate();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	const handleButtonClick = () => {
		router.push('/auth/signin');
	};

	return (
		<MainLayout>
			<BasicLayout title={message}>
				<div style={{ backgroundColor: 'white' }}>
					{/* <Label text={message} variant="h5" /> */}
					<br />
					<Button label='Iniciar sesión' onClick={handleButtonClick} />
				</div>
			</BasicLayout>
		</MainLayout>
	);
};

export default UserList;

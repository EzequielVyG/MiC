import Loading from '@/components/Loading/Loading';

import CardNotification from '@/components/Card/CardNotification';
import { Notification } from '@/features/Notifications/hooks/notification';
import { findAll as getNotifications } from '@/features/Notifications/hooks/useGetNotifications';
import { markAllRead } from '@/features/Notifications/hooks/useMarkAllRead';
import { getuserByEmail } from '@/features/Users/hooks/useGetUserByEmailQuery';
import { User } from '@/features/Users/user';
import useCountNotificationStore from '@/hooks/useCountNotification';
import { hasPermission } from '@/hooks/useUserHasPermissionQuery';
import BasicLayout from '@/layouts/BasicLayout';
import MainLayout from '@/layouts/MainLayout';
import en from '@/locale/en';
import es from '@/locale/es';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const EventList: React.FC = () => {
	const [list, setList] = useState<Notification[]>([]);
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const { locale } = router;
	const { setCount } = useCountNotificationStore();
	const [myUser, setMyUser] = useState<User | null>();
	const { data: session } = useSession();
	const t: any = locale === 'en' ? en : es;

	useEffect(() => {
		if (!session || new Date(session.expires) < new Date()) {
			router.replace({
				pathname: '/auth/signin',
				query: { expired: true },
			});
		} else {
			if (session?.user?.email) {
				checkUserPermission(session?.user?.email);
				getuserByEmail(session?.user?.email).then(async (response) => {
					if (response.data) {
						setMyUser(response.data);
					}
				});
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session]);

	useEffect(() => {
		const fetchNotifications = async () => {
			if (myUser) {
				const someNotifications = await getNotifications(myUser!.email);
				setIsLoading(false);
				setList(someNotifications.data);
			}
		};
		setIsLoading(true);
		fetchNotifications();
		setIsLoading(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [myUser]);

	useEffect(() => {
		handleMarkAllRead();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [list]);

	const checkUserPermission = async (email: string) => {
		const response = await hasPermission(email, 'updateOwn', 'user');
		if (response.statusCode === 500) {
			router.replace('/permissionDenied');
		}
		setIsLoading(false);
	};

	const handleClick = async (notification: Notification) => {
		router.push(notification.link);
	};

	/* const handleMarkRead = async (id: string) => {
    const response = await marcarLeida(id);
  }; */

	const handleMarkAllRead = async () => {
		if (myUser) {
			const response = await markAllRead(myUser!.email);
			if (response?.status !== 500) {
				setCount(0);
			}
		}
	};

	return (
		<MainLayout>
			{isLoading ? (
				<Loading />
			) : (
				<>
					<BasicLayout title={t['myNotifications']}>
						<div>
							{list.map((notification: Notification, i: number) => (
								<div key={i}>
									<CardNotification
										title={notification.title}
										description={notification.description}
										status={notification.status}
										date={
											moment(notification.timestamp).isSame(moment(), 'day')
												? moment(notification.timestamp).format('HH:mm')
												: moment(notification.timestamp).format('DD/MM/yyyy')
										}
										onClick={() => handleClick(notification)}
									/>
								</div>
							))}
						</div>
					</BasicLayout>
				</>
			)}
		</MainLayout>
	);
};

export default EventList;

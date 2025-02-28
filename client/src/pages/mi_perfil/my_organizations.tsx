import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { default as Button } from '@/components/Button/Button';
import CardOrganization from '@/components/Card/CardOrganization';
import BasicLayout from '@/layouts/BasicLayout';
import en from '@/locale/en';
import es from '@/locale/es';

import LoadingSpinner from '@/components/Loading/Loading';
import { Organization } from '@/features/Organizations/Organization';
import { getOrganizationsByUserEmail } from '@/features/Organizations/hooks/useGetByUserEmailQuery';
import Alert from '@/components/Alert/Alert';

const MyOrganizations = (props: any) => {
	const router = useRouter();
	const { locale } = router;
	const t: any = locale === 'en' ? en : es;
	const { message } = router.query;

	const [showInfo, setShowInfo] = useState(false);
	const [showMessage, setShowMessage] = useState('');
	const [organizations, setOrganizations] = useState<Organization[]>();
	const [isLoading, setIsLoading] = useState(true);

	const handleCardClick = (id: string) => {
		router.push(`/organization/edit/${id}`);
	};

	useEffect(() => {
		fetchOrganizationData(props.myUser.email!);

		if (message) {
			setShowInfo(true);
			setShowMessage(message as string);
		}

		setIsLoading(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchOrganizationData = async (email: string) => {
		try {
			const organizationsResponse = await getOrganizationsByUserEmail(email);

			console.log('organizations user', organizationsResponse);
			setOrganizations(organizationsResponse.data);
		} catch (error) {
			console.error('Error fetching organization:', error);
		}
	};

	return (
		<BasicLayout title={t['my_organizations']}>
			<div
				style={{
					flex: 1,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
					textAlign: 'center',
				}}
			>
				{showInfo && (
					<Alert
						label={showMessage}
						severity='info'
						onClose={() => setShowInfo(false)}
					/>
				)}
			</div>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							marginBottom: 10,
						}}
					>
						<Button
							label={t['neworganization']}
							onClick={() => handleCardClick('new')}
						/>
					</div>
					{organizations &&
						organizations.map((organizationDato: Organization, i: number) => (
							<div key={i}>
								<CardOrganization
									title={organizationDato.legalName}
									address={organizationDato.address}
									phone={organizationDato.phone}
									status={organizationDato.status}
									photoUrl={undefined}
									id={organizationDato.id}
									onClick={() => handleCardClick(organizationDato.id!)}
								/>
							</div>
						))}
				</>
			)}
		</BasicLayout>
	);
};

export default MyOrganizations;

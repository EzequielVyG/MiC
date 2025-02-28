import { GetSessionParams, getSession } from 'next-auth/react';
import { getCsrfToken } from 'next-auth/react';

export default function IndexPage() {
	return null;
}

export const getServerSideProps = async (
	context: GetSessionParams | undefined
) => {
	const session = await getSession(context);
	return {
		props: {
			csrfToken: await getCsrfToken(context),
			session,
		},
		redirect: {
			destination: '/home',
		},
	};
};

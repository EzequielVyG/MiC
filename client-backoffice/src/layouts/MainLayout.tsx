import React, { ReactNode } from 'react';
import Navbar from '@/components/NavBar/NavBar';
import Link from 'next/link';
interface MainLayoutProps {
	children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
			<Navbar />
			<Link href={''} />
			<main
				style={{
					flex: 1,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
					textAlign: 'center',
				}}
			>
				{children}
			</main>

			{/* Pie de página común */}
		</div>
	);
};

export default MainLayout;

import React, { ReactNode } from 'react';
import Title from '@/components/Title/Title';

interface BasicLayoutProps {
	title: string;
	children: ReactNode;
}

const BasicLayout: React.FC<BasicLayoutProps> = ({ title, children }) => {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			{/* Encabezado solo con título de la app por ahora */}
			{/* <header>
        <Title textTitle={title} />
      </header> */}

			{/* Contenido de la página */}
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
				{/* <div
          style={{
            display: "flex",
            alignItems: "center"
          }}
        > */}
				<Title textTitle={title} />
				<br />
				{children}
				{/* </div> */}
			</main>

			{/* Pie de página común */}
			{/* <footer>
        <p>Derechos reservados © 2023</p>
      </footer> */}
		</div>
	);
};

export default BasicLayout;

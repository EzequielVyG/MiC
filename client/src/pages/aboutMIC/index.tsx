import Title from '@/components/Title/Title';
import BasicLayout from '@/layouts/BasicLayout';
import MainLayout from '@/layouts/MainLayout';
import { Grid, Typography } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import teamData from './teamData.json';

const AboutMIC = () => {
	return (
		<div>
			<MainLayout>
				<BasicLayout title={'Acerca de MIC'}>
					<Title textTitle={''}></Title>
					<div
						style={{
							padding: '10px',
							maxWidth: '700px',
						}}
					>
						<Typography>
							MIC – Mapa Interactivo Cultural es una app para que la cultura, el
							deporte y el turismo esté en tus manos en un sólo lugar,
							promoviendo los consumos culturales de tu ciudad.
						</Typography>
						<br />
						<Typography sx={{ fontWeight: 'bold' }}>
							Idea Original Distor producciones:
						</Typography>
						<br />
						<Grid container spacing={2}>
							{teamData.distorProducciones.map((member, index) => (
								<Grid item xs={12} sm={6} key={index}>
									<div style={{ display: 'flex', marginLeft: '20%' }}>
										<Typography>{member.name}</Typography>
										<span style={{ marginRight: '8px' }}>
											<a href={member.linkedin}>
												<LinkedInIcon sx={{ width: '30px' }} />
											</a>
										</span>
									</div>
								</Grid>
							))}
						</Grid>
						<br />
						<Typography sx={{ fontWeight: 'bold' }}>
							Proyecto y dirección de proyecto:
						</Typography>
						<br />
						<Typography>
							<Grid container spacing={1}>
								{teamData.direccion.map((member, index) => (
									<Grid item xs={12} sm={6} key={index}>
										<div style={{ display: 'flex', marginLeft: '20%' }}>
											<Typography>{member.name}</Typography>
											<span style={{ marginRight: '8px' }}>
												<a href={member.linkedin}>
													<LinkedInIcon sx={{ width: '30px' }} />
												</a>
											</span>
										</div>
									</Grid>
								))}
							</Grid>
						</Typography>
						<Typography sx={{ fontWeight: 'bold' }}>
							Equipo de desarrollo:
						</Typography>
						<br />
						<Grid container spacing={1}>
							{teamData.equipoDesarrollo.map((member, index) => (
								<Grid item xs={12} sm={6} key={index}>
									<div style={{ display: 'flex', marginLeft: '20%' }}>
										<Typography>{member.name}</Typography>
										<span style={{ marginRight: '8px' }}>
											{member.linkedin && (
												<a href={member.linkedin}>
													<LinkedInIcon sx={{ width: '30px' }} />
												</a>
											)}
										</span>
									</div>
								</Grid>
							))}
						</Grid>
						<br />
						<Typography sx={{ fontWeight: 'bold' }}>Diseño y UIX:</Typography>
						<br />
						<Grid container spacing={1}>
							{teamData.diseño.map((member, index) => (
								<Grid item xs={12} sm={6} key={index}>
									<div style={{ display: 'flex', marginLeft: '20%' }}>
										<Typography>{member.name}</Typography>
										<span style={{ marginRight: '8px' }}>
											{member.linkedin && (
												<a href={member.linkedin}>
													<LinkedInIcon sx={{ width: '30px' }} />
												</a>
											)}
										</span>
									</div>
								</Grid>
							))}
						</Grid>
						<br />
						<Typography sx={{ fontWeight: 'bold' }}>Operación:</Typography>
						<br />
						<Grid container spacing={1}>
							{teamData.operacion.map((member, index) => (
								<Grid item xs={12} sm={6} key={index}>
									<div style={{ display: 'flex', marginLeft: '20%' }}>
										<Typography>{member.name}</Typography>
										<span style={{ marginRight: '8px' }}>
											{member.linkedin && (
												<a href={member.linkedin}>
													<LinkedInIcon sx={{ width: '30px' }} />
												</a>
											)}
										</span>
									</div>
								</Grid>
							))}
						</Grid>
						<br />
						<Typography sx={{ fontWeight: 'bold' }}>Propietario:</Typography>
						<br />
						{teamData.propietario.map((member, index) => (
							<div style={{ display: 'flex', marginLeft: '5%' }} key={index}>
								<Typography>{member.name}</Typography>
								<span style={{ marginRight: '8px' }}>
									{member.linkedin && (
										<a href={member.linkedin}>
											<a href={member.linkedin}>
												<LanguageIcon sx={{ width: '30px' }} />
											</a>
										</a>
									)}
								</span>
							</div>
						))}
					</div>
				</BasicLayout>
			</MainLayout>
		</div>
	);
};

export default AboutMIC;

/* eslint-disable @next/next/no-img-element */
import Alert from '@/components/Alert/Alert';
import Button from '@/components/Button/Button';
import Carousel from '@/components/ImageCarousel/Carousel';
import Input from '@/components/Input/Input';
import Label from '@/components/Label/Label';
import Loading from '@/components/Loading/Loading';
import Tag from '@/components/Tag/Tag';
import TagCategory from '@/components/Tag/TagCategory';
import { Event } from '@/features/Events/Event';
import { getById as findById } from '@/features/Events/hooks/useGetByIdQuery';
import MainLayout from '@/layouts/MainLayout';
import en from '@/locale/en';
import es from '@/locale/es';
import MapIcon from '@mui/icons-material/Map';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { putAcceptEvent } from '@/features/Events/hooks/usePutAcceptEventQuery';
import { putRejectEvent } from '@/features/Events/hooks/usePutRejectEventQuery';
import { useSession } from 'next-auth/react';
import Title from '@/components/Title/Title';

const ViewCard: React.FC = () => {
	const router = useRouter();
	const { id } = router.query;
	const { locale } = router;
	const { data: session } = useSession();
	const t: any = locale === 'en' ? en : es;

	const [isLoading, setIsLoading] = useState(true);

	const [eventData, setEventData] = useState<Event | null>(null);

	const [activeTab, setActiveTab] = useState(0);

	const [isDecline, setIsDecline] = useState(false);
	const [message, setMessage] = useState('');

	const [showInfo, setShowInfo] = useState(false);
	const [showMessage, setShowMessage] = useState('');

	useEffect(() => {
		async function fetchEventData() {
			try {
				if (typeof id === 'string') {
					const event = await findById(id);
					setEventData(event.data);
					if (event.data?.status === 'Programado') {
						setShowMessage(
							'El evento ya fue aceptado y se encuentra visible para los usuarios.'
						);
						setShowInfo(true);
					}
				}
			} catch (error) {
				console.error('Error fetching place data:', error);
			}
			setIsLoading(false);
		}

		if (!session || new Date(session.expires) < new Date()) {
			router.replace({
				pathname: '/auth/signin',
				query: { expired: true },
			});
		} else {
			fetchEventData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	const toMap = (id: string) => {
		router.push({
			pathname: '/home',
			query: { event_id: id, filter: 'events' },
		});
	};

	const handleTabChange = (
		event: any,
		newValue: React.SetStateAction<number>
	) => {
		setActiveTab(newValue);
	};

	const onClickCategory = (categoryId: string) => {
		router.push({
			pathname: '/home',
			query: { category_id: categoryId },
		});
	};

	const handleAccept = async () => {
		const response = await putAcceptEvent(id as string);
		setShowMessage(response.message);
		if (response.statusCode === 200) {
			setEventData(response.data);
		}
		setShowInfo(true);
	};

	const handleDecline = () => {
		setIsDecline(true);
	};

	const handleConfirmDecline = async () => {
		const response = await putRejectEvent(id as string, message);
		setShowMessage(response.message);
		if (response.statusCode === 200) {
			setEventData(response.data);
		}
		setShowInfo(true);
	};

	return (
		<MainLayout>
			{isLoading ? (
				<Loading />
			) : (
				<>
					{eventData && eventData.status !== 'Cancelado' ? (
						<div
							style={{
								padding: 10,
								maxWidth: '500px',
							}}
						>
							{/* Portada (rectángulo) */}
							{eventData.photos && eventData.photos.length > 0 && (
								<div
									style={{
										width: '100%',
										height: '100px', // Altura del rectángulo de portada
										backgroundColor: '#ccc', // Color de fondo del rectángulo
										position: 'relative',
									}}
								>
									<img
										src={eventData.photos[0].photoUrl}
										alt='Portada del evento'
										style={{
											width: '100%',
											height: '100%',
											objectFit: 'cover', // Para que la imagen llene el rectángulo
										}}
									/>
								</div>
							)}

							{/* Title - Rating */}
							<div
								style={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									paddingLeft: 10,
									paddingRight: 10,
								}}
							>
								<Label id={'card_title'} text={eventData.name!} />
							</div>
							{eventData.principalCategory && (
								<TagCategory
									text={eventData.principalCategory!.name}
									color={eventData.principalCategory!.color}
									onClickCategory={() =>
										onClickCategory(eventData.principalCategory?.id)
									}
								/>
							)}

							{/* Address - To Map */}
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									margin: 5,
								}}
							></div>

							{/* Card - Info */}
							{(eventData.description ||
								eventData.place.domicile ||
								eventData.place.phone ||
								eventData.place.url ||
								eventData.place.facebook_url ||
								eventData.place.instagram_url ||
								eventData.place.twitter_url ||
								eventData.startDate) && (
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											backgroundColor: '#F3F5F6',
											alignItems: 'center',
											borderRadius: 8,
											padding: 10,
											margin: 10,
											boxShadow: 'none',
										}}
									>
										<Tabs
											value={activeTab}
											onChange={handleTabChange}
											textColor='inherit'
											color='#FFFFFF'
											style={{
												color: '#FFFFFF',
												backgroundColor: '#B88268',
												borderRadius: '12px',
											}}
										>
											<Tab label={t['detail']} />
											<Tab label={t['address']} />
											<Tab label={t['contact']} />
										</Tabs>
										<Box>
											{activeTab === 0 && (
												<div>
													<p>
														<Label text={eventData.description}></Label>
													</p>
													<p>
														<Label
															text={
																'Fecha de inicio: ' +
																moment(eventData.startDate).format(
																	'DD/MM/yyyy HH:mm'
																)
															}
														></Label>
														{eventData.endDate && (
															<Label
																text={
																	'Fecha de fin: ' +
																	moment(eventData.endDate).format(
																		'DD/MM/yyyy HH:mm'
																	)
																}
															></Label>
														)}
													</p>
													<p>
														<Label text={'Precio: ' + eventData.price}></Label>
													</p>
													<p>
														<Label text={eventData.minors}></Label>
													</p>
												</div>
											)}
											{activeTab === 1 && (
												<div>
													<p>
														<p>
															<Label text={'Lugar del evento: '}></Label>
														</p>
														<Label text={eventData.place.name!} />
														<Label
															id={'card_description'}
															text={eventData.place.description!}
														/>
														<p>
															<Label text={'Dirección del lugar: '}></Label>
														</p>
														<IconButton
															sx={{
																backgroundColor: '#8EA2A5',
																borderRadius: '50%',
																margin: '0.2rem',
																'&:hover': {
																	backgroundColor: '#8EA2A5',
																},
															}}
															size='small'
															onClick={() => toMap(eventData.id!)}
														>
															<MapIcon style={{ color: 'white' }} />
														</IconButton>
														<Label
															id={'card_description'}
															text={eventData.place.domicile}
														/>
													</p>
												</div>
											)}
											{activeTab === 2 && (
												<div>
													<p>
														<Label text={eventData.creator!.name!}></Label>
														<Label text={eventData.creator.email}></Label>
													</p>
												</div>
											)}
										</Box>
									</div>
								)}
							{/* <Tag color="#984D98" width="87%" text={"Entradas"}></Tag>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    backgroundColor: "#F3F5F6",
                                    borderRadius: 8,
                                    padding: 10,
                                    margin: 10,
                                    boxShadow: "none",
                                }}
                            >
                                <Tabs
                                    value={activeTab2}
                                    onChange={handleTabChange2}
                                    textColor="inherit"
                                    //indicatorColor=""
                                    color="#FFFFFF"
                                    style={{
                                        color: "#FFFFFF",
                                        backgroundColor: "#B88268",
                                        borderRadius: "12px",
                                    }}
                                >
                                    <Tab label="Lugar" />
                                    <Tab label="Función" />
                                    <Tab label="Pagar" />
                                </Tabs>
                                <Box>
                                    {activeTab2 === 0 && (
                                        <div>
                                            <p>
                                                <FormControl
                                                    sx={{
                                                        m: 1,
                                                        minWidth: 120,
                                                        width: "95%",
                                                        backgroundColor: "#8EA2A5",
                                                    }}
                                                    size="small"
                                                >
                                                    <InputLabel
                                                        sx={{ color: "#FFFFFF" }}
                                                        id="demo-select-small-label"
                                                    >
                                                        Elija la fila
                                                    </InputLabel>
                                                    <Select
                                                        labelId="demo-select-small-label"
                                                        id="demo-select-small"
                                                        label="Fila"
                                                        sx={{
                                                            "& svg": {
                                                                fill: "#FFFFFF", // Cambia el color de la flecha desplegable aquí
                                                            },
                                                        }}
                                                    ></Select>
                                                </FormControl>
                                            </p>
                                            <FormControl
                                                sx={{
                                                    m: 1,
                                                    minWidth: 120,
                                                    width: "95%",
                                                    backgroundColor: "#8EA2A5",
                                                }}
                                                size="small"
                                            >
                                                <InputLabel
                                                    sx={{ color: "#FFFFFF" }}
                                                    id="demo-select-small-label"
                                                >
                                                    Elija la butaca
                                                </InputLabel>
                                                <Select
                                                    labelId="demo-select-small-label"
                                                    id="demo-select-small"
                                                    label="Fila"
                                                    sx={{
                                                        "& svg": {
                                                            fill: "#FFFFFF", // Cambia el color de la flecha desplegable aquí
                                                        },
                                                    }}
                                                ></Select>
                                            </FormControl>
                                        </div>
                                    )}
                                    {activeTab2 === 1 && (
                                        <div>
                                            <p>
                                                <FormControl
                                                    sx={{
                                                        m: 1,
                                                        minWidth: 120,
                                                        width: "95%",
                                                        backgroundColor: "#8EA2A5",
                                                    }}
                                                    size="small"
                                                >
                                                    <InputLabel
                                                        sx={{ color: "#FFFFFF" }}
                                                        id="demo-select-small-label"
                                                    >
                                                        Elija la función
                                                    </InputLabel>
                                                    <Select
                                                        labelId="demo-select-small-label"
                                                        id="demo-select-small"
                                                        label="Fila"
                                                        sx={{
                                                            "& svg": {
                                                                fill: "#FFFFFF", // Cambia el color de la flecha desplegable aquí
                                                            },
                                                        }}
                                                    ></Select>
                                                </FormControl>
                                            </p>
                                        </div>
                                    )}
                                    {activeTab2 === 2 && (
                                        <div>
                                            <p>
                                                <Label text={""}></Label>
                                            </p>
                                        </div>
                                    )}
                                </Box>
                            </div> */}

							{/* Card - Images */}
							{eventData.photos!.length > 0 && (
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										backgroundColor: '#F3F5F6',
										borderRadius: 5,
										padding: 10,
										margin: 10,
										boxShadow: 'none',
									}}
								>
									<div
										style={{
											display: 'flex',
											marginBottom: 10,
										}}
									>
										<Tag text='Fotos' />
									</div>
									<Carousel
										images={eventData.photos!.map((photo) => photo.photoUrl)}
									/>
								</div>
							)}
						</div>
					) : (
						<>
							<Title textTitle={t['eventCanceled']}></Title>
						</>
					)}

					<div
						style={{
							display: 'flex',
							justifyContent: 'space-around',
							margin: 10,
							position: 'sticky',
							gap: '10px',
						}}
					>
						<Button
							variant='outlined'
							onClick={() =>
								router.replace({
									pathname: '/notifications',
								})
							}
						>
							{t['go_back']}
						</Button>
						{eventData?.status === 'Pendiente' && (
							<>
								<Button label={t['decline']} onClick={handleDecline} />
								<Button label={t['accept']} onClick={handleAccept} />
							</>
						)}
					</div>

					{isDecline && (
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								margin: 10,
								position: 'sticky',
								gap: '10px',
							}}
						>
							<Input
								field={{
									value: message,
									onChange: (e) => {
										setMessage(e.target.value);
									}, // onBlur: undefined,
									label: 'Motivo de rechazo',
									type: 'text',
									required: true,
									multiline: true,
									rows: 5,
								}}
							/>
							<Button
								label={t['decline_confirm']}
								onClick={handleConfirmDecline}
							/>
						</div>
					)}
					{showInfo && (
						<Alert
							label={showMessage}
							severity='info'
							onClose={() => setShowInfo(false)}
						/>
					)}
				</>
			)}
		</MainLayout>
	);
};

export default ViewCard;

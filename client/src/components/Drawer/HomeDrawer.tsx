import en from '@/locale/en';
import es from '@/locale/es';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import MapIcon from '@mui/icons-material/Map';
import { Box, Hidden, IconButton, Typography, styled } from '@mui/material';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { grey } from '@mui/material/colors';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

type HomeDrawerProps = {
	content: React.ReactNode;
	showButtons?: boolean;
	isOpened?: boolean;
	setIsOpened?: () => void;
	anchor?: 'bottom' | 'left' | 'right' | 'top';
};

const HomeDrawer: React.FC<HomeDrawerProps> = ({
	content,
	showButtons,
	isOpened,
	anchor,
	setIsOpened,
}) => {
	const router = useRouter();
	const { locale } = router;
	const t: any = locale === 'en' ? en : es;
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const toggleDrawer = () => {
		if (setIsOpened) {
			setIsOpened();
		}
		setIsDrawerOpen(!isDrawerOpen);
	};

	const Puller = styled(Box)(({ theme }) => ({
		width: 30,
		height: 6,
		backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
		borderRadius: 3,
		position: 'absolute',
		top: 8,
		left: 'calc(50% - 15px)',
	}));

	return (
		<div>
			{showButtons === true || showButtons === undefined ? (
				<IconButton
					sx={{
						position: 'fixed',
						boxShadow: 3,
						bottom: '22%',
						right: 20,
						backgroundColor: 'white',
						borderRadius: '16px',
						padding: 2,
						'&:hover': {
							backgroundColor: '#F3F5F6',
						},
						display: { xs: 'flex', md: 'none' },
					}}
					size='large'
					onClick={toggleDrawer}
				>
					<FormatListBulletedIcon style={{ color: '#8EA2A5' }} />
					<Typography sx={{ marginLeft: 1, color: '#8EA2A5' }}>
						{t['seeList']}
					</Typography>
				</IconButton>
			) : (
				<></>
			)}

			<SwipeableDrawer
				anchor={anchor ? anchor : 'bottom'}
				open={isOpened !== undefined ? isOpened : isDrawerOpen}
				onClose={toggleDrawer}
				onOpen={toggleDrawer}
				PaperProps={{
					sx: {
						borderTopLeftRadius: '16px',
						borderTopRightRadius: '16px',
						maxHeight: '100vh',
					},
				}}
			>
				<Hidden mdUp>
					<Puller></Puller>
				</Hidden>
				<div
					style={{
						padding: '16px',
						backgroundColor: 'white',
					}}
				>
					{content}
				</div>
				{showButtons === true || showButtons === undefined ? (
					<IconButton
						sx={{
							position: 'sticky',
							boxShadow: 3,
							bottom: 16,
							right: 16,
							backgroundColor: 'white',
							borderRadius: '16px',
							padding: 2,
							marginLeft: 'auto',
							marginRight: 2,
							'&:hover': {
								backgroundColor: '#F3F5F6',
							},
							display: { xs: 'flex', md: 'none' },
						}}
						size='large'
						onClick={toggleDrawer}
					>
						<MapIcon style={{ color: '#8EA2A5' }} />
						<Typography
							sx={{
								marginLeft: 1,
								color: '#8EA2A5',
							}}
						>
							{t['seeMap']}
						</Typography>
					</IconButton>
				) : (
					<></>
				)}
			</SwipeableDrawer>
		</div>
	);
};

export default HomeDrawer;

import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridToolbar, esES } from '@mui/x-data-grid';
import Label from '../Label/Label';

type Column = GridColDef;

type RowData = Record<string, string | number>;

type TableProps = {
	columns: Column[];
	data: RowData[];
	showFilters?: boolean;
	showColumnsButton?: boolean;
	showDensitySelector?: boolean;
	isDisableToolbarButton?: boolean;
};

const TableExample: React.FC<TableProps> = ({
	columns,
	data,
	showFilters = true,
	showColumnsButton = true,
	showDensitySelector = true,
	isDisableToolbarButton = true
}) => {
	const [calculatedColumnWidths, setCalculatedColumnWidths] = useState<
		number[]
	>([]);

	useEffect(() => {
		const totalColumns = columns.length;
		const desiredTotalWidthInVw = 85;
		const viewportWidth = window.innerWidth;
		const calculatedColumnWidths: number[] = [];

		columns.forEach(() => {
			const columnWidth =
				(viewportWidth * desiredTotalWidthInVw) / (100 * totalColumns);
			calculatedColumnWidths.push(columnWidth);
		});

		setCalculatedColumnWidths(calculatedColumnWidths);
	}, [columns]);

	const columnsWithWidth = columns.map((column, index) => ({
		...column,
		width: calculatedColumnWidths[index],
	}));

	if (data.length === 0) {
		return <Label text={`No hay datos disponibles`} variant='h6' />;
	}

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				width: '100%',
			}}
		>
			<DataGrid
				rows={data}
				columns={columnsWithWidth}
				rowSelection={false}
				initialState={{
					pagination: {
						paginationModel: {
							pageSize: 10,
						},
					},
				}}
				pageSizeOptions={[5, 10, 25]}
				slots={{ toolbar: GridToolbar }}
				slotProps={{
					toolbar: {
						csvOptions: { disableToolbarButton: isDisableToolbarButton },
						printOptions: { disableToolbarButton: true },
						showQuickFilter: true,
						quickFilterProps: { debounceMs: 250 },
					},
				}}
				localeText={esES.components.MuiDataGrid.defaultProps.localeText}
				style={{ flex: 1, width: '100%' }}
				hideFooter={!showDensitySelector}
				disableColumnFilter={!showFilters}
				disableColumnMenu={!showColumnsButton}
			/>
		</div>
	);
};

export default TableExample;

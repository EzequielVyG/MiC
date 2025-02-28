import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '../Button/Button';
import { LoadingButton } from '@mui/lab';

interface FieldConfig {
	name: string;
	component: React.FC<any>;
	props: any;
}

interface GenericFormProps {
	initialValues: Record<string, any>;
	validationSchema: Yup.Schema<any>;
	fields: FieldConfig[];
	onSubmit: (values: Record<string, any>, actions: any) => void;
	buttonLabel: string;
	cancelLabel?: string;
	isLoading?: boolean;
	isCancelable?: boolean; // New prop for cancel button
	onCancel?: () => void; // New prop for cancel function
}

const GenericForm: React.FC<GenericFormProps> = ({
	initialValues,
	validationSchema,
	fields,
	buttonLabel = 'Confirmar',
	cancelLabel = 'Cancelar',
	onSubmit,
	isCancelable = false,
	isLoading,
	onCancel,
}) => {
	return (
		<Formik
			enableReinitialize
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={onSubmit}
		>
			{({ isSubmitting, errors, touched }) => (
				<Form>
					<div style={{ width: '70vw', minWidth: '100px', maxWidth: '300px' }}>
						{fields.map((field) => (
							<div key={field.name} style={{ marginBottom: '14px' }}>
								<Field
									name={field.name}
									as={field.component}
									{...field.props}
								/>

								{errors[field.name] && touched[field.name] && (
									<span style={{ color: 'red' }}>
										<ErrorMessage name={field.name} />
									</span>
								)}
							</div>
						))}
						<div
							style={{
								display: 'flex',
								justifyContent: isCancelable ? 'space-around' : 'center',
							}}
						>
							{isCancelable && onCancel && (
								<Button type='button' label={cancelLabel} onClick={onCancel} />
							)}
							{isLoading == undefined && isLoading == null ? (
								<Button
									type='submit'
									label={buttonLabel}
									disabled={isSubmitting}
								/>
							) : (
								<LoadingButton
									variant='contained'
									type='submit'
									disabled={isSubmitting}
									loading={isLoading}
								>
									{buttonLabel}
								</LoadingButton>
							)}
						</div>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default GenericForm;

import React, { useState } from 'react';
import { object, string } from 'yup';

import BasicLayout from '@/layouts/BasicLayout';
import Input from '@/components/Input/Input';
import Label from '@/components/Label/Label';
import Alert from '@/components/Alert/Alert';
import GenericForm from '@/components/Form/ValidationForm';
import MainLayout from '@/layouts/MainLayout';
import { sendPasswordTokenQuery } from '@/features/Users/hooks/useSendPasswordTokenQuery';

const ForgotMyPassword = () => {

    const [showInfo, setShowInfo] = useState(false);
    const [info, setInfo] = useState({
        message: '',
        type: ''
    });

    const handleButtonClick = async (values: Record<string, string>) => {
        await sendPasswordTokenQuery(values.email);
        setInfo({ message: 'Se envió la solicitud para reestablecer la clave, por favor revise su casilla de correo electrónico para saber cómo continuar.', type: 'success' });
        setShowInfo(true);
    };

    const initialValues = {
        email: '',
    };

    const validationSchema = object().shape({
        email: string().required('*Email requerido').email('Email inválido'),
    });

    const fields = [
        {
            name: 'email',
            label: 'Campo 1',
            props: { label: 'Email', required: true },
            component: Input,
        }];

    return (
        <MainLayout>
            <BasicLayout title='Olvidé mi contraseña'>
                {showInfo && info && (
                    <Alert
                        label={info.message}
                        severity={info.type === 'success' ? 'success' : 'error'}
                        onClose={() => setShowInfo(false)}
                    />
                )}
                <br />

                <Label text={'Ingrese su email para reestablecer su contraseña'} />
                <br />
                <GenericForm
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    fields={fields}
                    onSubmit={handleButtonClick}
                    buttonLabel='Recuperar contraseña'
                />
                <br />
                <br />
            </BasicLayout>
        </MainLayout>
    );
};

export default ForgotMyPassword;
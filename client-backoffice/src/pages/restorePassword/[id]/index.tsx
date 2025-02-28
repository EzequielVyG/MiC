import { useState, useEffect } from "react";

import * as Yup from "yup";

import { useRouter } from 'next/router';
import useCheckTokenExp from "@/features/Users/hooks/useCheckTokenExp";
import useRestorePasswordQuery from "@/features/Users/hooks/useRestorePasswordQuery";

import useGetPasswordToken from "@/features/Users/hooks/useGetPasswordToken";
import MainLayout from "@/layouts/MainLayout";
import BasicLayout from "@/layouts/BasicLayout";
import Alert from "@/components/Alert/Alert";
import GenericForm from "@/components/Form/ValidationForm";
import PasswordInput from "@/components/Input/PasswordInput";

const Restore = () => {

    const [userEmail, setUserEmail] = useState("");

    const [isError, setIsError] = useState(false);
    const [info, setInfo] = useState({
        message: '',
        type: ''
    });

    // El nombre de la variable tiene que coincidir con el nombre del param en la ruta
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (typeof id === 'string') {

            if (!isTokenExpired())
                getData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const isTokenExpired = () => {
        const userData = useCheckTokenExp.checkTokenExpiration(id);
        setUserEmail(userData);
        if (userData === "") {
            setInfo({ message: "Tiempo expirado: Usted contaba con 24hs para realizar el cambio de contraseña, para reestablecer su clave debe volver a solicitarlo.", type: 'error' });
            setIsError(true);
            return true;
        }

        return false;
    }

    const getData = async () => {
        const aTokenComplete = (await useGetPasswordToken.getTokenData(id)).data;
        if (aTokenComplete.status === "invalido") {
            setInfo({ message: "Error: Este link ya fue utilizado, en caso de querer cambiar la contraseña nuevamente debe volver a solicitarlo.", type: 'error' });
            setIsError(true);
        }

    };

    const initialValues = {
        password: "",
        confirmPassword: "",
    };

    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .required("*Debe ingresar su nueva contraseña")
            .min(8, "Debe tener al menos 8 caracteres, una mayúscula y un número")
            .matches(
                /(?=.*[A-Z])(?=.*?[0-9])/,
                "Debe tener al menos 8 caracteres, una mayúscula y un número"
            ),
        confirmPassword: Yup.string()
            .required("*Debe confirmar su nueva contraseña")
            .oneOf([Yup.ref("password")], "Las contraseñas deben coincidir")
            .min(8, "Debe tener al menos 8 caracteres, una mayúscula y un número")
            .matches(
                /(?=.*[A-Z])(?=.*?[0-9])/,
                "Debe tener al menos 8 caracteres, una mayúscula y un número"
            ),
    });


    const handleFormSubmit = async (values: Record<string, any>) => {
        try {
            await useRestorePasswordQuery.restorePassword(
                userEmail,
                values.password,
                id
            );

            // router.replace({ pathname: '/auth/signin', query: { info: "Contraseña modificada con éxito." } },);

        } catch (error: any) {
            console.log(error);

        }
    };

    const fields = [
        {
            name: 'password',
            label: 'Campo 1',
            props: { label: 'Nueva contraseña' },
            component: PasswordInput,
        },
        {
            name: 'confirmPassword',
            label: 'Campo 2',
            props: { label: 'Confirme su nueva contraseña' },
            component: PasswordInput,
        },
    ];

    return (
        <MainLayout>
            {isError ?
                <Alert
                    label={info.message}
                    severity={info.type === 'error' ? 'error' : 'success'}
                    onClose={() => router.replace('/auth/signin')}
                />
                :
                <BasicLayout title='Olvidé mi contraseña'>
                    <GenericForm
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        fields={fields}
                        onSubmit={handleFormSubmit} buttonLabel={"Reestablecer contraseña"} />

                </BasicLayout>
            }
        </MainLayout>
    );
};

export default Restore;
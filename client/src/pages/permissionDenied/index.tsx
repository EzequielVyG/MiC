import { useRouter } from 'next/router';
import MainLayout from "@/layouts/MainLayout";
import BasicLayout from "@/layouts/BasicLayout";
import Label from "@/components/Label/Label";
import Button from '@/components/Button/Button';

export default function ErrorAccess() {
    const router = useRouter();

    const toBack = () => {
        router.replace("/");
    };

    return (
        <MainLayout>
            <BasicLayout title={"Error"}>
                <Label text={"No cuenta con permisos para visualizar esta página."} />
                <br />
                <Button onClick={toBack}>Volver</Button>
            </BasicLayout>
        </MainLayout>

    );
}

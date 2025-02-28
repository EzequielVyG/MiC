import React, { useEffect } from 'react';
import MainLayout from "@/layouts/MainLayout";
import BasicLayout from "@/layouts/BasicLayout";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const HomePage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session || new Date(session.expires) < new Date()) {
      router.replace({
        pathname: "/auth/signin",
        query: { expired: true },
      });
    }
  }, [session]);

  return (
    <MainLayout>
      <BasicLayout title="Bienvenido al sitio de gestion MIC">
      </BasicLayout>
    </MainLayout>
  );
};

export default HomePage;

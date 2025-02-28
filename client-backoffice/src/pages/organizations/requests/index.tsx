import Alert from "@/components/Alert/Alert";
import Table from "@/components/Table/Table";
import GenericTabs from "@/components/Tabs/Tabs";
import Title from "@/components/Title/Title";
import StaticLayout from "@/layouts/StaticLayout";
import React, { useEffect, useState } from "react";

import { getAllOrganizations } from "@/features/Organizations/hooks/useGetAllQuery";
import { putTakeOrganization } from "@/features/Organizations/hooks/usePutTakeQuery";
import BackHandIcon from "@mui/icons-material/BackHand";
import EditIcon from "@mui/icons-material/Edit";

import LoadingSpinner from "@/components/Loading/Loading";
import { getuserByEmail } from "@/features/Users/hooks/useGetUserByEmailQuery";
import { hasPermission } from "@/hooks/useUserHasPermissionQuery";
import { IconButton } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const OrganizationPage: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { selectedTab, message } = router.query;

  const [isLoading, setIsLoading] = useState(true);

  const [solicitudes, setSolicitudes] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [showMessage, setShowMessage] = useState("");
  const [aSelectedTab, setASelectedTab] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!session || new Date(session.expires) < new Date()) {
        router.replace({
          pathname: "/auth/signin",
          query: { expired: true },
        });
      } else {
        setIsLoading(true); // Configurar isLoading a true al principio

        if (session?.user?.email) {
          await checkUserPermission(session?.user?.email);
        }

        if (message) {
          setShowMessage(message as string);
          setShowInfo(true);
          setASelectedTab(selectedTab ? parseInt(selectedTab as string, 10) : 0);
        }
      }
    };

    fetchData();
  }, [session, selectedTab, message]);

  const checkUserPermission = async (email: string) => {
    const response = await hasPermission(
      email,
      "readAny",
      "organizationRequest"
    );
    if (response.statusCode === 500) {
      router.replace("/permissionDenied");
    }
    await getData();
    setIsLoading(false);
  };

  const getData = async () => {
    try {
      const response = await getAllOrganizations();
      const solicitudesParser = response.data.map((s: any) => {
        return {
          id: s.id,
          legalName: s.legalName,
          address: s.address,
          createdAt: moment.utc(s.createdAt).format("DD-MM-yyyy"),
          validator: s.validator ? s.validator.email : "-",
          status: s.status,
        };
      });

      const solicitudesFiltradas = solicitudesParser.filter(
        (solicitud: any) =>
          solicitud.status !== "Activo" &&
          solicitud.status !== "Rechazado" &&
          (solicitud.status !== "En revisión" ||
            (solicitud.status === "En revisión" &&
              solicitud.validator === session?.user?.email))
      );

      setSolicitudes(solicitudesFiltradas);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const columnsTodas: GridColDef[] = [
    {
      field: "legalName",
      headerName: "Razón social",
      type: "string",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "address",
      headerName: "Domicilio",
      type: "string",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "createdAt",
      headerName: "Fecha",
      type: "string",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "validator",
      headerName: "Validador",
      type: "string",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "Estado",
      type: "string",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Acciones",
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => (
        <>
          {params.row.status === "En revisión" &&
            params.row.validator === session?.user?.email && (
              <IconButton
                onClick={() => handleEdit(params.row.id)}
                color="secondary"
              >
                <EditIcon />
              </IconButton>
            )}
          {params.row.status === "En espera" &&
            params.row.validator === session?.user?.email && (
              <IconButton
                onClick={() => handleEdit(params.row.id)}
                color="secondary"
              >
                <EditIcon />
              </IconButton>
            )}
          {params.row.status === "Pendiente" && (
            <IconButton
              onClick={() => handleGet(params.row.id)}
              color="secondary"
            >
              <BackHandIcon />
            </IconButton>
          )}
        </>
      ),
    },
  ];

  const handleEdit = async (id: string) => {
    router.push(`/organizations/requests/${id}`);
  };

  const handleGet = async (id: string) => {
    setShowInfo(true);
    setShowMessage("Solicitud tomada con éxito.");
    const aValidator = await getuserByEmail(session!.user!.email!);
    const body = {
      id: id,
      validator: aValidator.data,
    };
    await putTakeOrganization(body);
    getData();
  };

  type TabData = {
    label: string;
    content: React.ReactNode;
  };

  const tabsData: TabData[] = [
    {
      label: `Todas (${solicitudes.length})`,
      content: (
        <Table columns={columnsTodas} data={solicitudes} showFilters={false} />
      ),
    },
  ];

  return (
    <StaticLayout>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Title textTitle={"Gestión de Organizaciones"} />
          <br />
          {showInfo && (
            <Alert
              label={showMessage}
              severity="info"
              onClose={() => setShowInfo(false)}
            />
          )}
          <GenericTabs tabs={tabsData} numberTab={aSelectedTab} />
        </>
      )}
    </StaticLayout>
  );
};

export default OrganizationPage;

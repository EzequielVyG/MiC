/* eslint-disable @next/next/no-img-element */
import Alert from "@/components/Alert/Alert";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Label from "@/components/Label/Label";
import Loading from "@/components/Loading/Loading";
import MainLayout from "@/layouts/MainLayout";
import en from "@/locale/en";
import es from "@/locale/es";

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { getOperatorComplete } from "@/features/Organizations/hooks/useGetOperatorComplete";
import { Organization } from "@/features/Organizations/Organization";

import { putOperatorStatus } from "@/features/Organizations/hooks/useUpdateOperatorStatusQuery";

const ViewCard: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const { locale } = router;
    const t: any = locale === "en" ? en : es;

    const [isLoading, setIsLoading] = useState(true);

    const [organization, setOrganization] = useState<Organization | null>(null);

    const [isDecline, setIsDecline] = useState(false);
    const [message, setMessage] = useState("");

    const [showInfo, setShowInfo] = useState(false);
    const [showMessage, setShowMessage] = useState("");

    const [status, setStatus] = useState("");

    const [operator, setOperator] = useState<any>(null);

    useEffect(() => {
        setIsDecline(false);
        fetchOrganizationData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    async function fetchOrganizationData() {
        try {
            // console.log(id);
            if (typeof id === "string") {
                const organizationId = id.split(".")[0];
                const userId = id.split(".")[1];


                const operatorComplete = await getOperatorComplete(organizationId, userId)
                setOrganization(operatorComplete.data.organization);


                console.log("operatorComplete", operatorComplete.data);
                setOperator(operatorComplete.data);
                setStatus(operatorComplete.data.status);
                if (operatorComplete.data.status === "ACCEPTED") {
                    setShowMessage(
                        "La solicitud ya fue aceptada, usted ya es operador de la organización."
                    );
                    setShowInfo(true);
                }
                if (operatorComplete.data.status === "REJECTED") {
                    setShowMessage(
                        "La solicitud ya fue rechazada, usted no es operador de la organización."
                    );
                    setShowInfo(true);
                }
            }
        } catch (error) {
            console.error("Error fetching place data:", error);
        }
        setIsLoading(false);
    }

    const handleDecline = () => {
        setIsDecline(true);
    };

    const handleAccept = async () => {
        const response = await putOperatorStatus(
            operator.id,
            'ACCEPTED'
        );
        fetchOrganizationData();
        setShowMessage(response.message);
        setShowInfo(true);
    };

    const handleConfirmDecline = async () => {
        const response = await putOperatorStatus(
            operator.id,
            'REJECTED'
        );
        fetchOrganizationData();
        setShowMessage(response.message);
        setShowInfo(true);
    };

    return (
        <MainLayout>
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    {organization && (
                        <div
                            style={{
                                padding: 10,
                                maxWidth: "500px",
                            }}
                        >

                            {/* Title - Rating */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                }}
                            >
                                <Label id={"card_title"} text={"Solicitud de operación"} />
                            </div>

                            {/* Card - Info */}
                            {(organization.cuit || organization.phone) && (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        backgroundColor: "#F3F5F6",
                                        alignItems: "center",
                                        borderRadius: 8,
                                        padding: 10,
                                        margin: 10,
                                        boxShadow: "none",
                                    }}
                                >
                                    <div>
                                        <Label text={"La organización cuyo nombre es: " + organization.legalName! + " ha indicado que usted es su operador. A continuacion puede ver los datos de la misma."} />

                                        <p>
                                            <Label text={"CUIT: " + organization.cuit}></Label>
                                        </p>
                                        <p>
                                            <Label text={"Teléfono: " + organization.phone}></Label>
                                        </p>

                                    </div>

                                </div>
                            )}
                        </div>
                    )}

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-around",
                            margin: 10,
                            position: "sticky",
                            gap: "10px",
                        }}
                    >
                        <Button
                            variant="outlined"
                            onClick={() =>
                                router.replace({
                                    pathname: "/notifications",
                                })
                            }
                        >
                            {t["go_back"]}
                        </Button>
                        {status === "PENDING" && (
                            <>
                                <Button label={t["decline"]} onClick={handleDecline} />
                                <Button label={t["accept"]} onClick={handleAccept} />
                            </>
                        )}
                    </div>

                    {isDecline && (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                margin: 10,
                                position: "sticky",
                                gap: "10px",
                            }}
                        >
                            <Input
                                field={{
                                    value: message,
                                    onChange: (e) => {
                                        setMessage(e.target.value);
                                    }, // onBlur: undefined,
                                    label: "Motivo de rechazo",
                                    type: "text",
                                    required: true,
                                    multiline: true,
                                    rows: 5,
                                }}
                            />
                            <Button
                                label={t["decline_confirm"]}
                                onClick={handleConfirmDecline}
                            />
                        </div>
                    )}
                    {showInfo && (
                        <Alert
                            label={showMessage}
                            severity="info"
                            onClose={() => setShowInfo(false)}
                        />
                    )}
                </>
            )}
        </MainLayout>
    );
};

export default ViewCard;

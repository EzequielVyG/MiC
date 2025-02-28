/* eslint-disable @next/next/no-img-element */
import Alert from "@/components/Alert/Alert";
import Button from "@/components/Button/Button";
import Carousel from "@/components/ImageCarousel/Carousel";
import Input from "@/components/Input/Input";
import Label from "@/components/Label/Label";
import Loading from "@/components/Loading/Loading";
import Tag from "@/components/Tag/Tag";
import TagCategory from "@/components/Tag/TagCategory";
import { Event } from "@/features/Events/Event";
import { getById as findById } from "@/features/Events/hooks/useGetByIdQuery";
import MainLayout from "@/layouts/MainLayout";
import en from "@/locale/en";
import es from "@/locale/es";
import MapIcon from "@mui/icons-material/Map";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { getStatus } from "@/features/Events/hooksParticipant/useGetStatusQuery";
import { putAcceptOrganization } from "@/features/Events/hooksParticipant/usePutAcceptEventQuery";
import { putRejectOrganization } from "@/features/Events/hooksParticipant/usePutRejectEventQuery";

const ViewCard: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { locale } = router;
  const t: any = locale === "en" ? en : es;

  const [isLoading, setIsLoading] = useState(true);

  const [eventData, setEventData] = useState<Event | null>(null);

  const [activeTab, setActiveTab] = useState(0);

  const [isDecline, setIsDecline] = useState(false);
  const [message, setMessage] = useState("");

  const [showInfo, setShowInfo] = useState(false);
  const [showMessage, setShowMessage] = useState("");

  const [idEvent, setIdEvent] = useState("");
  const [idOrganization, setIdOrganization] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchEventData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchEventData() {
    try {
      if (typeof id === "string") {
        const idEv = id.split(".")[0];
        const idOr = id.split(".")[1];
        setIdEvent(idEv);
        setIdOrganization(idOr);

        const event = await findById(idEv);
        setEventData(event.data);

        const estado = await getStatus(idEv, idOr);
        setStatus(estado.data);
        if (estado.data === "Accepted") {
          setShowMessage(
            "El evento ya fue aceptado. Tu organizacion formará parte de este evento."
          );
          setShowInfo(true);
        }
        if (estado.data === "Reject") {
          setShowMessage(
            "El evento ya fue rechazado. Tu organizacion no formará parte de este evento"
          );
          setShowInfo(true);
        }
      }
    } catch (error) {
      console.error("Error fetching place data:", error);
    }
    setIsLoading(false);
  }

  const toMap = (id: string) => {
    router.push({
      pathname: "/home",
      query: { event_id: id, filter: "events" },
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
      pathname: "/home",
      query: { category_id: categoryId },
    });
  };

  const handleDecline = () => {
    setIsDecline(true);
  };

  const handleAccept = async () => {
    const response = await putAcceptOrganization(
      idEvent as string,
      idOrganization as string
    );
    fetchEventData();
    setShowMessage(response.message);
    setShowInfo(true);
  };

  const handleConfirmDecline = async () => {
    const response = await putRejectOrganization(
      idEvent as string,
      idOrganization as string,
      message
    );
    fetchEventData();
    setShowMessage(response.message);
    setShowInfo(true);
  };

  return (
    <MainLayout>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {eventData && (
            <div
              style={{
                padding: 10,
                maxWidth: "500px",
              }}
            >
              {/* Portada (rectángulo) */}
              {eventData.photos && eventData.photos.length > 0 && (
                <div
                  style={{
                    width: "100%",
                    height: "100px", // Altura del rectángulo de portada
                    backgroundColor: "#ccc", // Color de fondo del rectángulo
                    position: "relative",
                  }}
                >
                  <img
                    src={eventData.photos[0].photoUrl}
                    alt="Portada del evento"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover", // Para que la imagen llene el rectángulo
                    }}
                  />
                </div>
              )}

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
                <Label id={"card_title"} text={eventData.name!} />
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
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
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
                    <Tabs
                      value={activeTab}
                      onChange={handleTabChange}
                      textColor="inherit"
                      color="#FFFFFF"
                      style={{
                        color: "#FFFFFF",
                        backgroundColor: "#B88268",
                        borderRadius: "12px",
                      }}
                    >
                      <Tab label={t["detail"]} />
                      <Tab label={t["address"]} />
                      <Tab label={t["contact"]} />
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
                                "Fecha de inicio: " +
                                moment(eventData.startDate).format(
                                  "DD/MM/yyyy HH:mm"
                                )
                              }
                            ></Label>
                            {eventData.endDate && (
                              <Label
                                text={
                                  "Fecha de fin: " +
                                  moment(eventData.endDate).format(
                                    "DD/MM/yyyy HH:mm"
                                  )
                                }
                              ></Label>
                            )}
                          </p>
                          <p>
                            <Label text={"Precio: " + eventData.price}></Label>
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
                              <Label text={"Lugar del evento: "}></Label>
                            </p>
                            <Label text={eventData.place.name!} />
                            <Label
                              id={"card_description"}
                              text={eventData.place.description!}
                            />
                            <p>
                              <Label text={"Dirección del lugar: "}></Label>
                            </p>
                            <IconButton
                              sx={{
                                backgroundColor: "#8EA2A5",
                                borderRadius: "50%",
                                margin: "0.2rem",
                                "&:hover": {
                                  backgroundColor: "#8EA2A5",
                                },
                              }}
                              size="small"
                              onClick={() => toMap(eventData.id!)}
                            >
                              <MapIcon style={{ color: "white" }} />
                            </IconButton>
                            <Label
                              id={"card_description"}
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
              {eventData.photos!.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#F3F5F6",
                    borderRadius: 5,
                    padding: 10,
                    margin: 10,
                    boxShadow: "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      marginBottom: 10,
                    }}
                  >
                    <Tag text="Fotos" />
                  </div>
                  <Carousel
                    images={eventData.photos!.map((photo) => photo.photoUrl)}
                  />
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
            {status === "Pending" && (
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

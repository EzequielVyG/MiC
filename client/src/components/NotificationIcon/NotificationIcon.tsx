import { findAll as getNotReadNotifications } from "@/features/Notifications/hooks/useGetNotReadNotifications";
import useCountNotificationStore from "@/hooks/useCountNotification";
import firebaseApp from "@/utils/firebase/firebase";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Badge } from "@mui/material";
import { getMessaging, onMessage } from "firebase/messaging";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import theme from "../Theme";

type NotificationProps = {
  /*   color: LogoColor;
  height?: number; // Nueva prop para el tamaño de la imagen
  width?: number; // Nueva prop para el tamaño de la imagen */
};

const NotificationIcon: React.FC<NotificationProps> = () => {
  const { data: session } = useSession();
  const [newNotifications, setNewNotifications] = useState<boolean>(false);
  const { count, setCount } = useCountNotificationStore();
  let c = count;

  useEffect(() => {
    const fetchNotifications = async () => {
      if (session?.user?.email) {
        const someNotifications = await getNotReadNotifications(
          session.user.email
        );
        if (someNotifications.data.length > 0) {
          setNewNotifications(true);
          setCount(someNotifications.data.length);
        } else {
          setCount(0);
        }
      }
    };
    fetchNotifications();
  }, [session]);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const messaging = getMessaging(firebaseApp);
      const unsubscribe = onMessage(messaging, (payload: any) => {
        console.log("Foreground push notification received:", payload);
        setNewNotifications(true);

        setCount(c + 1);
        c++;
        // Handle the received push notification while the app is in the foreground
        // You can display a notification or update the UI based on the payload
      });
      return () => {
        unsubscribe(); // Unsubscribe from the onMessage event
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {newNotifications ? (
        <>
          <Badge badgeContent={count} color="error">
            <NotificationsIcon
              style={{
                color: theme.palette.primary.light,
              }}
            />
          </Badge>
        </>
      ) : (
        <NotificationsIcon style={{ color: theme.palette.primary.light }} />
      )}
    </>
    /*     <Image
      priority
      src={require(`./muestras logo mic_MANDA-${color}.svg`)}
      alt="Logo de MIC"
      width={width} // Proporcionar el tamaño deseado
      height={height} // Proporcionar el tamaño deseado
    /> */
  );
};

export default NotificationIcon;

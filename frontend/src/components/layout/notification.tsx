import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const Notifications = (props: any) => {
  const [id, setID] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const notificationListener = (newNotification: any) => {
      if (newNotification && newNotification.type === "newNotification") {
        let thisID = id;
        let notification = new Notification(
          thisID,
          newNotification.content,
          newNotification.duration,
          newNotification.autoClose,
          () => {
            setNotifications((prevNotifications) =>
              prevNotifications.filter((not) => not.id !== thisID)
            );
          }
        );
        setNotifications((prevNotifications) => [
          notification,
          ...prevNotifications,
        ]);
        setID((prevID) => prevID + 1);
      }
    };
    props.notificationHandler.addObserver(notificationListener);
    return () => props.notificationHandler.removeObserver(notificationListener);
  }, [props.notificationHandler, id, notifications]);

  return (
    <div
      id="notifications"
      className="max-w[100vw] pointer-events-none absolute left-0 right-0 z-50 ml-auto mr-auto flex h-screen w-[30rem] flex-col items-center overflow-hidden pt-[10rem] text-center"
    >
      {notifications.map((notification: Notification) => (
        <NotificationView
          key={notification.id}
          id={notification.id}
          notification={notification}
          content={notification.content}
          autoClose={notification.autoClose}
        />
      ))}
    </div>
  );
};

const NotificationView = (props: any) => {
  const [close, setClose] = useState(false);
  useEffect(() => {
    if (props.notification.autoClose) props.notification.startTimer();

    props.notification.onTimeout(() => {
      setClose(true);
    });
  }, []);

  useEffect(() => {
    if (close) setTimeout(() => props.notification.close(), 200);
  }, [close]);

  return (
    <div
      className={`notification pointer-events-auto m-2 w-3/4 rounded-md bg-text-col p-4 text-primary-900 ${
        props.notification.autoClose && "autoclose"
      } ${close ? "close" : "open"} relative`}
    >
      {!props.notification.autoClose && (
        <button
          onClick={() => setClose(true)}
          className="absolute top-2 right-2 cursor-pointer bg-transparent hover:bg-transparent"
        >
          <AiOutlineClose />
        </button>
      )}
      {props.notification.content}
    </div>
  );
};

class Notification {
  id: number;
  content: any;
  duration: number;
  autoClose: boolean;
  onClose: any;
  timeoutFunctions: any[];
  timerStarted: boolean;

  constructor(
    id: number,
    content: any,
    duration: number,
    autoClose: boolean,
    onClose: any
  ) {
    this.id = id;
    this.content = content;
    this.duration = duration;
    this.autoClose = autoClose;
    this.onClose = onClose;
    this.timeoutFunctions = [];
    this.timerStarted = false;
  }

  startTimer() {
    if (!this.timerStarted)
      setTimeout(() => {
        this.timeoutFunctions.forEach((cb) => cb());
      }, this.duration);

    this.timerStarted = true;
  }

  onTimeout(cb: any) {
    this.timeoutFunctions.push(cb);
  }

  close() {
    this.onClose();
  }
}

export default Notifications;

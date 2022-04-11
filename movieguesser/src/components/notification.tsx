import { useEffect, useState } from "react"

const Notifications = (props: any) => {
  const [id, setID] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    const notificationListener = (newNotification: any) => {
      if (newNotification && newNotification.type === "newNotification") {
        let thisID = id;
        let notification = {
          id: thisID,
          content: newNotification.content
        }
        setNotifications(prevNotifications => [notification, ...prevNotifications])
        setTimeout(() => setNotifications(prevNotifications => prevNotifications.filter(not => not.id !== thisID)), 2000);
        setID(prevID => prevID + 1);
      }
    }
    props.notificationHandler.addObserver(notificationListener);
    return () => props.notificationHandler.removeObserver(notificationListener);
  }, [props.notificationHandler, id, notifications])

  return <div id="notifications" className="absolute h-screen z-50 w-[20rem] ml-auto mr-auto left-0 right-0 text-center flex flex-col items-center pointer-events-none pt-[10rem] overflow-hidden">
    {notifications.map(notification => <Notification key={notification.id} id={notification.id} content={notification.content} />)}
  </div>
}

const Notification = (props: any) => {
  /*
  const [closing, setClosing] = useState(false);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    setTimeout(() => setClosing(true), 1500);
    setTimeout(() => setVisible(false), 1600);
  })
  */
  return <div className={`notification w-3/4 bg-text-col text-primary-900 p-4 m-2 rounded-md ${false ? "closing" : ""} ${true ? "" : "invisible"}`}>
    {props.content}
  </div>
}

export default Notifications
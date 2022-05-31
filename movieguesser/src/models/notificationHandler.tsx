class NotificationHandler {
  observers: any[]
  constructor() {
    this.observers = [];
  }

  sendCustomNotification(element: any, duration: number = 2000, autoClose: boolean = true) {
    this.notifyObservers({
      type: "newNotification",
      content: element,
      duration: duration,
      autoClose: autoClose,
    });
  }

  sendNotification(text: string, duration: number = 2000, autoClose: boolean = true) {
    this.notifyObservers({
      type: "newNotification",
      content: text,
      duration: duration,
      autoClose: autoClose,
    });
  }

  addObserver(observer: any) {
    this.observers = [...this.observers, observer];
  }

  removeObserver(observer: any) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notifyObservers(arg: any) {
    this.observers.forEach(observer => {
      try {
        observer(arg)
      } catch (e) { }
    });
  }

}

export default NotificationHandler
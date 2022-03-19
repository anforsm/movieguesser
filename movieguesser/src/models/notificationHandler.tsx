class NotificationHandler {
  observers: any[]
  constructor() {
    this.observers = [];
  }

  sendNotification(text: string) {
    this.notifyObservers({
      type: "newNotification",
      content: text
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
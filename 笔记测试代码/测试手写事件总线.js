class EventEmit {
  constructor() {
    this.event = [];
  }

  on(type, callback) {
    if (!this.event[type]) {
      this.event[type] = [];
    }
    this.event.push(callback);
  }

  off(type, callback) {
    if (!this.event[type]) return;

    if (!callback) {
      delete this.event[type];
    }

    this.event[type].filter((item) => item !== callback);
  }

  emit(type) {
    if (!this.event[type]) return;

    this.event[type].forEach((cb) => {
      cb();
    });
  }
}

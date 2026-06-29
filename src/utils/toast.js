class ToastEventEmitter {
  constructor() {
    this.listeners = [];
  }
  
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  emit(message, type = 'info') {
    this.listeners.forEach(listener => listener({ message, type, id: Date.now() }));
  }

  success(message) {
    this.emit(message, 'success');
  }

  error(message) {
    this.emit(message, 'error');
  }

  info(message) {
    this.emit(message, 'info');
  }

  warning(message) {
    this.emit(message, 'warning');
  }
}

export const toast = new ToastEventEmitter();

import { defineStore } from 'pinia';

const apiURL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8080';

export const useLiveStore = defineStore('live', () => {
  function connectUser() {
    const eventSource = new EventSource(`${apiURL}/live/user`, { withCredentials: true });
    eventSource.onerror = (err) => {
      console.error(err);
    };

    eventSource.onopen = (err) => {
      console.log('Live connection onopen');
    };

    eventSource.onmessage = ({ data }) => {
      console.log('New message', JSON.parse(data));
    };
  }

  return {
    connectUser,
  };
});

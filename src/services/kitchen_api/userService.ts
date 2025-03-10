import { initInstance } from './client';

export function retrieveUsers(username: string) {
  return initInstance().get('/users', {
    params: {
      username: username,
    },
  });
}

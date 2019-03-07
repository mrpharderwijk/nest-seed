import * as http from 'request-promise-native';

export const httpProviders: any = [
  {
    provide: '',
    useFactory: () => {
      return http.defaults({
        headers: {
          ['Accept']: 'application/json',
          'Content-type': 'application/json',
          'User-agent': 'my-🍪-app',
        },
      });
    },
  },
];

import { Connection } from 'mongoose';
import { TokenSchema } from './schemas/token.schema';

export const tokensProviders = [
  {
    provide: 'TokenModelToken',
    useFactory: (connection: Connection) =>
      connection.model('Token', TokenSchema),
    inject: ['DbConnectionToken'],
  },
];

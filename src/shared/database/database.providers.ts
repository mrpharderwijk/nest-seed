import * as mongoose from 'mongoose';
import { ConfigService } from 'nestjs-config';

export const databaseProviders = [
  {
    provide: 'DbConnectionToken',
    inject: [ConfigService],
    useFactory: async (
      configService: ConfigService,
    ): Promise<typeof mongoose> => {
      return await mongoose.connect(configService.get('database').host, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      });
    },
  },
];

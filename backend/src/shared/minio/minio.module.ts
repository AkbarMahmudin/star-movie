import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MINIO_TOKEN } from './minio.decorator';
import * as Minio from 'minio';

@Global()
@Module({
  exports: [MINIO_TOKEN],
  providers: [
    {
      inject: [ConfigService],
      provide: MINIO_TOKEN,
      useFactory: async (
        configService: ConfigService,
      ): Promise<Minio.Client> => {
        const endpoint = configService.getOrThrow("MINIO_ENDPOINT"); // bisa "localhost:9000" atau "minio.example.com"

        // --- Pisahkan host & port bila ada ---
        const [host, portStr] = endpoint.split(":");
        const port = portStr ? parseInt(portStr, 10) : undefined;

        const useSSL = configService.get<string>("MINIO_USE_SSL") === "true";

        return new Minio.Client({
          endPoint: host,
          port: port, // boleh undefined
          useSSL,
          accessKey: configService.getOrThrow("MINIO_ACCESS_KEY"),
          secretKey: configService.getOrThrow("MINIO_SECRET_KEY"),
        });
      },
    },
  ],
})
export class MinioModule {}

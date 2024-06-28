import { Request, Response } from 'express';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ServerOptions } from 'https';

export type CompressionOptions = {
  chunkSize?: number;
  filter?: (req: Request, res: Response) => boolean;
  level?: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  memLevel?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  strategy?: number;
  threshold?: number;
  windowBits?: number;
};

export type IHttpOptions = {
  appUrl?: string;
  baseUrl: string;
  host: string;
  port: number;
  compression?: CompressionOptions | boolean;
  cors?: CorsOptions;
  tls?: ServerOptions;
  trustProxy?: boolean | string | number | ((ip: string) => boolean);
  rateLimit?: {
    skipIf?: () => boolean;
    ttl?: number;
    limit?: number;
  };
};

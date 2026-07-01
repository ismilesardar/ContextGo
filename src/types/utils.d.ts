import { S } from '@faker-js/faker/dist/airline-CLphikKp';

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
}

// mail send utils function
export interface SendMail {
  subject: string;
  receiver: string;
  body: any;
}

import { NODE_ENV } from '@/config/url.config';
import { ApiResponse } from '@/types/utils';
import { type ClassValue, clsx } from 'clsx';
import { NextResponse } from 'next/server';
import { twMerge } from 'tailwind-merge';
import { AppError } from './app-error';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate'
      ? (accurateSizes[i] ?? 'Bytest')
      : (sizes[i] ?? 'Bytes')
  }`;
}

// api response parch helper function
export const response = <T>(res: ApiResponse<T>) => {
  return NextResponse.json(
    {
      success: res.success,
      message: res.message,
      data: res.data || null // Standardize 'no data' as null
    },
    { status: res.statusCode } // This actually sets the HTTP status code
  );
};

export const catchError = (error: any, customMessage?: string) => {
  let statusCode = error.statusCode || 500;
  let message = customMessage || error.message || 'Internal Server Error';

  // Handle Custom AppErrors (Errors you throw manually)
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  const isDev = NODE_ENV === 'development';

  // response helper
  return response({
    success: false,
    statusCode: statusCode,
    message: isDev ? message : customMessage || message,
    data: isDev
      ? {
          stack: error.stack,
          name: error.name,
          details: error
        }
      : null
  });
};

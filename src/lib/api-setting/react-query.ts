import type {
  DefaultOptions,
  UseMutationOptions,
  UseQueryOptions
} from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { Promisable } from 'type-fest';

const queryConfig: DefaultOptions = {
  queries: {
    throwOnError: true,
    refetchOnWindowFocus: false,
    retry: false
  }
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });

// export type ExtractFnReturnType<FnType extends (...args: any) => any> =
//   Promisable<ReturnType<FnType>>;
export type ExtractFnReturnType<FnType extends (...args: any) => any> = Awaited<
  ReturnType<FnType>
>;

export type QueryConfig<QueryFnType extends (...args: any) => any> = Omit<
  UseQueryOptions<ExtractFnReturnType<QueryFnType>>,
  'queryKey' | 'queryFn'
>;

export type MutationConfig<MutationFnType extends (...args: any) => any> =
  UseMutationOptions<
    ExtractFnReturnType<MutationFnType>,
    AxiosError,
    Parameters<MutationFnType>[0]
  >;

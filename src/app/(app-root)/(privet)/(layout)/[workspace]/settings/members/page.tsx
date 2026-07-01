import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { MembersView } from '@/features/workspace/components/members-view-page';
import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';

export const metadata: Metadata = {
  title: `Settings - Members - ${APP_NAME}`
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};
const Page = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return <MembersView />;
};

export default Page;

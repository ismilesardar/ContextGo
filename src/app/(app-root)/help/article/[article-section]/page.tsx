import { APP_NAME } from '@/config/url.config';
import { HelpArticleView } from '@/features/help/components/help-article-view';
import { getHelpArticle } from '@/features/help/content/help-articles';
import type { Metadata } from 'next';

type PageProps = {
  params: Promise<{ 'article-section': string }>;
};

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { 'article-section': slug } = await params;
  const article = getHelpArticle(slug);

  if (!article) {
    return { title: `Documentation – ${APP_NAME}` };
  }

  return {
    title: `${article.title} – ${APP_NAME} Documentation`,
    description: article.summary
  };
}

export default async function Page({ params }: PageProps) {
  const { 'article-section': slug } = await params;
  return <HelpArticleView slug={slug} />;
}

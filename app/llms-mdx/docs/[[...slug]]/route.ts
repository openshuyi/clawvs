import { getLLMText, source } from '@/lib/source';
import { notFound } from 'next/navigation';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/llms-mdx/docs/[[...slug]]'>) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  return new Response(await getLLMText(page), {
    headers: {
      'Content-Type': 'text/markdown',
    },
  });
}

export function generateStaticParams() {
  // 过滤掉空 slug，避免静态导出时文件/目录冲突
  return source.generateParams().filter((p) => p.slug && p.slug.length > 0);
}

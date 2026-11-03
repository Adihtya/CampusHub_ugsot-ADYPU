import PageHero from '@/components/PageHero';
import CommunityFeed from '@/components/CommunityFeed';
import { posts } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Community · UGSOTADYPU Hub' };

export default function CommunityPage() {
  const sorted = [...posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return (
    <main className="container page page--narrow">
      <PageHero
        tag="Ask · Help · Build"
        tagColor={{ bg: '#E3E9FF', fg: '#2A3FB0' }}
        before="What’s "
        highlight="up"
        after="?"
        sub="Ask questions, get unstuck, and find people to build with."
      />
      <CommunityFeed initialPosts={sorted} now={Date.now()} />
    </main>
  );
}

import Link from "next/link";
import Head from "next/head";
import { getSortedPostsData } from "../lib/api";
import Layout, { siteTitle } from "../components/Layout";

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <ul>
        {allPostsData.map(({ slug, title, date }) => (
          <li key={slug}>
            <Link as={`/posts/${slug}`} href="/posts/[slug]">
              <a>{title}</a>
            </Link>
            <p>{date}</p>
          </li>
        ))}
      </ul>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

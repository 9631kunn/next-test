import Link from "next/link";
import Head from "next/head";
import { getAllPosts } from "../lib/api";
import { CMS_NAME } from "../lib/constants";

import Layout from "../components/Layout";

export default function Index({ allPosts }) {
  const heroPost = allPosts[0];
  const morePosts = allPosts.slice(1);
  return (
    <Layout>
      <Head>
        <title>{CMS_NAME}</title>
      </Head>
      {heroPost && (
        <>
          <Link href={heroPost.slug}>
            <a>
              <h1>{heroPost.title}</h1>
            </a>
          </Link>
          <img src={heroPost.coverImage} alt="" />
          <date>{heroPost.date}</date>
          <small>{heroPost.author.name}</small>
          <p>{heroPost.excerpt}</p>
        </>
      )}
    </Layout>
  );
}

export async function getStaticProps() {
  const allPosts = getAllPosts([
    "title",
    "date",
    "slug",
    "author",
    "coverImage",
    "excerpt",
  ]);
  return {
    props: { allPosts },
  };
}

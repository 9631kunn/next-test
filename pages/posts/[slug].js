import Head from "next/link";
import { useRouter } from "next/router";
// import { CMS_NAME } from "../../lib/constants";
import markdownToHtml from "../../lib/markdownToHtml";
import { getPostBySlug, getAllPosts } from "../../lib/api";

import Layout from "../../components/Layout";

export default function Post({ post }) {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <h1>404</h1>;
  }
  return (
    <Layout>
      {router.isFallback ? (
        <h1>LOADING...</h1>
      ) : (
        <div>
          <Head>{post.title}</Head>
          <h1>{post.title}</h1>
          <div>{post.content}</div>
        </div>
      )}
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug, [
    "title",
    "date",
    "slug",
    "author",
    "content",
    "ogImage",
    "coverImage",
  ]);
  const content = await markdownToHtml(post.content || "");
  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts(["slug"]);

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}

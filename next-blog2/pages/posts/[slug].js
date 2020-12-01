import Head from "next/head";

import Layout from "../../components/Layout";
import { getAllPostsSlugs, getPostData } from "../../lib/api";

const Post = ({ postData }) => (
  <Layout>
    <Head>{postData.title}</Head>
    <article>
      <h1>{postData.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </article>
  </Layout>
);

export async function getStaticPaths() {
  const paths = getAllPostsSlugs();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.slug);
  return {
    props: {
      postData,
    },
  };
}

export default Post;

import Head from "next/head";
import Link from "next/link";

import Layout from "../../components/Layout";

const FirstPost = () => (
  <Layout>
    <Head>
      <title>TEST</title>
    </Head>
    <h1>TEST</h1>
    <Link href="/">
      <a>HOME</a>
    </Link>
    <style jsx>{`
      h1 {
        color: tomato;
      }
    `}</style>
  </Layout>
);

export default FirstPost;

import Head from "next/head";
import Link from "next/link";

const author = "9631kunn";
export const siteTitle = "TEST_BLOG";

const Layout = ({ children, home }) => (
  <div data-component="layout">
    <Head>
      <link rel="icon" href="/favicon.ico" />
      <meta name="description" content="THIS_IS_MY_TEST_BLOG" />
    </Head>
    <header>
      {home ? (
        <>
          <h1>{author}</h1>
        </>
      ) : (
        <Link href="/">
          <a>
            <h3>{author}</h3>
          </a>
        </Link>
      )}
    </header>
    <main>{children}</main>
    {!home && (
      <Link href="/">
        <a>BACK_TO_HOME</a>
      </Link>
    )}
  </div>
);

export default Layout;

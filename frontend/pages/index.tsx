import type { NextPage } from "next";
import Login from "components/Login";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Chaterbox</title>
        <meta name="chaterbox" content="chat app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Login />
      </main>
    </div>
  );
};

export default Home;

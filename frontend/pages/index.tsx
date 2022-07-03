import type { NextPage } from "next";
import Head from "next/head";
import StatesBrowser from "../components/States/StatesBrowser";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Albedo 2.0</title>
        <meta name="description" content="Albedo. Predicting astronomical events." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <StatesBrowser />
      </main>
    </>
  );
};

export default Home;

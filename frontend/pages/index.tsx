import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import StatesList from "../components/StatesList";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Albedo 2.0</title>
        <meta name="description" content="Albedo. Predicting astronomical events." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <StatesList />
      </main>
    </div>
  );
};

export default Home;

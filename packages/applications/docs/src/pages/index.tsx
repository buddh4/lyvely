import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomepagePoweredBy from '@site/src/components/HomepagePoweredBy';
import HomepageUseCases from '@site/src/components/HomepageUseCases';
import useBaseUrl, {useBaseUrlUtils} from '@docusaurus/useBaseUrl';


import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title flex items-center gap-4">
          <img
            alt="'Lyvely logo'"
            className="w-40"
            src={useBaseUrl('/img/logo.svg')}
            width="200"
            height="200"
          />
          <p class="text-6xl text-left">
            Flexible, <b>self-improvement</b> and <b>collaboration</b> platform for anyone
          </p>

        </h1>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/guide/intro">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageUseCases />
        <HomepagePoweredBy />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}

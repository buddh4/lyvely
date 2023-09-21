import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'For you',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Use Lyvely privately to achieve private goals and improve on various aspects of your live as well as establishing
        a healthy work live balance.
      </>
    ),
  },
  {
    title: 'For your family',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Lyvely provides intuitive tools to plan and communicate family issues in a private and secure way.
      </>
    ),
  },
  {
    title: 'For your friends',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        With Lyvely you have a private space to share information with your friends and chat.
      </>
    ),
  },
  {
    title: 'For your business',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Lyvely can help your organization grow by providing group and organization level profiles and tools used to plan
        communicate and overview activities within your business, from keeping track of goals to graphical representation
        of the data important for your business success.
      </>
    ),
  },
  {
    title: 'For your customers',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Invite your customers to a Lyvely profile and collaboratively plan task and activities, communicate and share
        further information. Since Lyvely profiles are private by default it supports multi tenancy out of the box.
      </>
    ),
  },
  {
    title: 'For your education',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Use Lyvely for school and keep track of your progression, take notes and create group profiles for school projects
        to communicate with your friends.
      </>
    ),
  },

];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

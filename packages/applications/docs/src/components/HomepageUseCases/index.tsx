import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import svgForYou from '@site/static/img/undraw_mindfulness.svg'
import svgForFriends from '@site/static/img/undraw_social_friends.svg'
import svgForBusiness from '@site/static/img/undraw_business_plan.svg'
import svgForCustomers from '@site/static/img/undraw_customer_survey.svg'
import svgForEducation from '@site/static/img/undraw_education.svg'
import svgForCommunity from '@site/static/img/undraw_community.svg'

type UseCaseItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const UseCaseList: UseCaseItem[] = [
  {
    title: 'For you',
    Svg: svgForYou,
    description: (
      <>
        Use Lyvely privately to achieve private goals and improve on various aspects of your live as well as establishing
        a healthy work live balance. Users can manage multiple profiles with various visibility options.
      </>
    ),
  },
  {
    title: 'For friends & family',
    Svg: svgForFriends,
    description: (
      <>
        Lyvely provides intuitive tools to plan and communicate between family and friends in a private and secure way.
        By creating a group or organization profile for your family and friends you can intuitively plan and discuss
        upcoming events, todos and other issues.
      </>
    ),
  },
  {
    title: 'For your community',
    Svg: svgForCommunity,
    description: (
      <>
        Build a community and publicly share content as discussions and other types of content. Lyvely optionally supports
        access for unauthenticated users and public profiles and sophisticated permission and content visibility policies.
      </>
    ),
  },
  {
    title: 'For your business',
    Svg: svgForBusiness,
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
    Svg: svgForCustomers,
    description: (
      <>
        Invite your customers to a Lyvely profile and collaboratively plan task and activities, communicate and share
        further information. Since profiles and users are private by default, Lyvely can serve as a safe space
        for you and your customers to discuss issues and provide customer support.
      </>
    ),
  },
  {
    title: 'For your education',
    Svg: svgForEducation,
    description: (
      <>
        Use Lyvely for school and keep track of your progression, take notes and create group profiles for school projects
        to communicate with your friends. Many of the features such as tasks, habits and journals support shared or user-specific
        modes, which can be useful if you want to delegate activities to multiple users..
      </>
    ),
  },

];

function Feature({title, Svg, description}: UseCaseItem) {
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

export default function HomepageUseCases(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {UseCaseList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  svgPaths: string[],
  svgViewBox: string,
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Profiles',
    svgViewBox: '0 0 20 20',
    svgPaths: [
      'M19 11c-0.142 2.503-1.491 4.664-3.47 5.922l-0.030 0.018-5.5 3.060-5.5-3.060c-2.009-1.276-3.358-3.437-3.499-5.92l-0.001-0.020v-8c3.38 0 6.5-1.12 9-3 2.5 1.89 5.62 3 9 3v8zM10 12.080l2.92 2.040-1.030-3.41 2.84-2.15-3.56-0.080-1.17-3.36-1.17 3.36-3.56 0.080 2.83 2.14-1.030 3.4 2.93-2.010z'
    ],
    description: (
      <>
        Create multiple profiles from private single user profiles to public group or organization profiles. Profiles are isolated areas within the platform with own users, permissions and set of feature.
      </>
    ),
  },
  {
    title: 'Permissions',
    svgViewBox: '0 0 20 20',
    svgPaths: [
      'M19 11c-0.142 2.503-1.491 4.664-3.47 5.922l-0.030 0.018-5.5 3.060-5.5-3.060c-2.009-1.276-3.358-3.437-3.499-5.92l-0.001-0.020v-8c3.38 0 6.5-1.12 9-3 2.5 1.89 5.62 3 9 3v8zM10 12.080l2.92 2.040-1.030-3.41 2.84-2.15-3.56-0.080-1.17-3.36-1.17 3.36-3.56 0.080 2.83 2.14-1.030 3.4 2.93-2.010z'
    ],
    description: (
      <>
        Create multiple profiles from private single user profiles to public group or organization profiles. Profiles are isolated areas within the platform with own users, permissions and set of feature.
      </>
    ),
  },
  {
    title: 'Permissions',
    svgViewBox: '0 0 20 20',
    svgPaths: [
      'M19 11c-0.142 2.503-1.491 4.664-3.47 5.922l-0.030 0.018-5.5 3.060-5.5-3.060c-2.009-1.276-3.358-3.437-3.499-5.92l-0.001-0.020v-8c3.38 0 6.5-1.12 9-3 2.5 1.89 5.62 3 9 3v8zM10 12.080l2.92 2.040-1.030-3.41 2.84-2.15-3.56-0.080-1.17-3.36-1.17 3.36-3.56 0.080 2.83 2.14-1.030 3.4 2.93-2.010z'
    ],
    description: (
      <>
        Create multiple profiles from private single user profiles to public group or organization profiles. Profiles are isolated areas within the platform with own users, permissions and set of feature.
      </>
    ),
  },
  {
    title: 'Policies',
    svgViewBox: '0 0 20 20',
    svgPaths: [
      'M19 11c-0.142 2.503-1.491 4.664-3.47 5.922l-0.030 0.018-5.5 3.060-5.5-3.060c-2.009-1.276-3.358-3.437-3.499-5.92l-0.001-0.020v-8c3.38 0 6.5-1.12 9-3 2.5 1.89 5.62 3 9 3v8zM10 12.080l2.92 2.040-1.030-3.41 2.84-2.15-3.56-0.080-1.17-3.36-1.17 3.36-3.56 0.080 2.83 2.14-1.030 3.4 2.93-2.010z'
    ],
    description: (
      <>
        Create multiple profiles from private single user profiles to public group or organization profiles. Profiles are isolated areas within the platform with own users, permissions and set of feature.
      </>
    ),
  },
  {
    title: 'Content',
    svgViewBox: '0 0 20 20',
    svgPaths: [
      'M19 11c-0.142 2.503-1.491 4.664-3.47 5.922l-0.030 0.018-5.5 3.060-5.5-3.060c-2.009-1.276-3.358-3.437-3.499-5.92l-0.001-0.020v-8c3.38 0 6.5-1.12 9-3 2.5 1.89 5.62 3 9 3v8zM10 12.080l2.92 2.040-1.030-3.41 2.84-2.15-3.56-0.080-1.17-3.36-1.17 3.36-3.56 0.080 2.83 2.14-1.030 3.4 2.93-2.010z'
    ],
    description: (
      <>
        Create multiple profiles from private single user profiles to public group or organization profiles. Profiles are isolated areas within the platform with own users, permissions and set of feature.
      </>
    ),
  },
  {
    title: 'Features',
    svgViewBox: '0 0 20 20',
    svgPaths: [
      'M19 11c-0.142 2.503-1.491 4.664-3.47 5.922l-0.030 0.018-5.5 3.060-5.5-3.060c-2.009-1.276-3.358-3.437-3.499-5.92l-0.001-0.020v-8c3.38 0 6.5-1.12 9-3 2.5 1.89 5.62 3 9 3v8zM10 12.080l2.92 2.040-1.030-3.41 2.84-2.15-3.56-0.080-1.17-3.36-1.17 3.36-3.56 0.080 2.83 2.14-1.030 3.4 2.93-2.010z'
    ],
    description: (
      <>
        Create multiple profiles from private single user profiles to public group or organization profiles. Profiles are isolated areas within the platform with own users, permissions and set of feature.
      </>
    ),
  },
  {
    title: 'I18n',
    svgViewBox: '0 0 20 20',
    svgPaths: [
      'M19 11c-0.142 2.503-1.491 4.664-3.47 5.922l-0.030 0.018-5.5 3.060-5.5-3.060c-2.009-1.276-3.358-3.437-3.499-5.92l-0.001-0.020v-8c3.38 0 6.5-1.12 9-3 2.5 1.89 5.62 3 9 3v8zM10 12.080l2.92 2.040-1.030-3.41 2.84-2.15-3.56-0.080-1.17-3.36-1.17 3.36-3.56 0.080 2.83 2.14-1.030 3.4 2.93-2.010z'
    ],
    description: (
      <>
        Create multiple profiles from private single user profiles to public group or organization profiles. Profiles are isolated areas within the platform with own users, permissions and set of feature.
      </>
    ),
  },
  {
    title: 'Realtime',
    svgViewBox: '0 0 20 20',
    svgPaths: [
      'M19 11c-0.142 2.503-1.491 4.664-3.47 5.922l-0.030 0.018-5.5 3.060-5.5-3.060c-2.009-1.276-3.358-3.437-3.499-5.92l-0.001-0.020v-8c3.38 0 6.5-1.12 9-3 2.5 1.89 5.62 3 9 3v8zM10 12.080l2.92 2.040-1.030-3.41 2.84-2.15-3.56-0.080-1.17-3.36-1.17 3.36-3.56 0.080 2.83 2.14-1.030 3.4 2.93-2.010z'
    ],
    description: (
      <>
        Create multiple profiles from private single user profiles to public group or organization profiles. Profiles are isolated areas within the platform with own users, permissions and set of feature.
      </>
    ),
  },
  {
    title: 'Ui',
    svgViewBox: '0 0 20 20',
    svgPaths: [
      'M19 11c-0.142 2.503-1.491 4.664-3.47 5.922l-0.030 0.018-5.5 3.060-5.5-3.060c-2.009-1.276-3.358-3.437-3.499-5.92l-0.001-0.020v-8c3.38 0 6.5-1.12 9-3 2.5 1.89 5.62 3 9 3v8zM10 12.080l2.92 2.040-1.030-3.41 2.84-2.15-3.56-0.080-1.17-3.36-1.17 3.36-3.56 0.080 2.83 2.14-1.030 3.4 2.93-2.010z'
    ],
    description: (
      <>
        Create multiple profiles from private single user profiles to public group or organization profiles. Profiles are isolated areas within the platform with own users, permissions and set of feature.
      </>
    ),
  },
  {
    title: 'Type-Safe Api',
    svgViewBox: '0 0 20 20',
    svgPaths: [
      'M19 11c-0.142 2.503-1.491 4.664-3.47 5.922l-0.030 0.018-5.5 3.060-5.5-3.060c-2.009-1.276-3.358-3.437-3.499-5.92l-0.001-0.020v-8c3.38 0 6.5-1.12 9-3 2.5 1.89 5.62 3 9 3v8zM10 12.080l2.92 2.040-1.030-3.41 2.84-2.15-3.56-0.080-1.17-3.36-1.17 3.36-3.56 0.080 2.83 2.14-1.030 3.4 2.93-2.010z'
    ],
    description: (
      <>
        Create multiple profiles from private single user profiles to public group or organization profiles. Profiles are isolated areas within the platform with own users, permissions and set of feature.
      </>
    ),
  },
];

function Feature({title, svgPaths, svgViewBox, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4 relative')}>
      <svg viewBox={svgViewBox} className="w-5 text-violet-700 absolute left-0 top-[5px]">
        {svgPaths.map((path, idx) => (
          <path fill="currentColor" d={path}></path>
        ))}
      </svg>
      <div className="mx-8">
        <h4 className="text-lg font-semibold text-gray-600">{title}</h4>
        <p className="text-sm text-gray-500 mb-8">{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container text-center">
        <h1 className="text-2xl text-violet-500">
          Framework at a glance
        </h1>
        <h2 className="text-xl text-gray-400 mt-2">
          All tools you need for creating a sophisticated platform.
        </h2>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type PoweredByItem = {
  title: string;
  url: string;
};

const PoweredByList: PoweredByItem[] = [
  {
    title: 'NestJS',
    url: '#'
  },
  {
    title: 'Vue.js',
    url: '#'
  },
  {
    title: 'Tailwind',
    url: '#'
  },
  {
    title: 'MongoDB',
    url: '#'
  },
  {
    title: 'Redis',
    url: '#'
  },
];

function PoweredByItem({title, url}: PoweredByItem) {
  return (
    <li className="flex justify-center items-end px-2 pb-2 rounded border border-gray-300">
      <a href="url" className="inline-block text-md">
        { title }
      </a>
    </li>
  );
}

export default function HomepagePoweredBy(): JSX.Element {
  return (
    <section className={clsx(styles.features, ' bg-gray-100 border-y border-gray-300')}>
      <div className="container">
        <h6 className="text-lg text-center text-gray-800 mb-2">
          Powered By
        </h6>
        <div className="flex justify-center">
          <ul className="flex flex-wrap gap-2 justify-center p-0">
            {PoweredByList.map((props, idx) => (
              <PoweredByItem key={idx} {...props} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

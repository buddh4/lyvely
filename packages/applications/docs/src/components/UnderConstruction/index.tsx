import React from 'react';

export default function UnderConstruction(): JSX.Element {
  return (
    <section className="bg-orange-300 py-2">
      <div className="container text-center">
        <div className="flex justify-center">
          <svg id="icon-cone" className="w-5 mr-2" viewBox="0 0 32 32">
            <path d="M30.854 28.014h-29.709c-0.631 0-1.144 0.496-1.144 1.109v1.771c0 0.613 0.513 1.109 1.144 1.109h29.71c0.633 0 1.145-0.496 1.145-1.109v-1.771c-0.001-0.613-0.513-1.109-1.146-1.109zM21.332 11.985h-10.686l-2.659 5.988h16.005zM17.743 1.071c0 0-0.21-1.074-1.659-1.074s-1.676 1.111-1.676 1.111l-2.902 8.871h9.154l-2.917-8.908zM25.102 19.977h-18.037l-2.777 7.023h23.592z"></path>
          </svg>
          <span className="text-sm text-gray-900">
            This project is under active development!
          </span>
        </div>
      </div>
    </section>
  );
}

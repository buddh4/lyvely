export interface Error {
  icon?: string;
  title: string;
  msg: string;
}

export interface ErrorState extends Error {
  state: boolean;
}

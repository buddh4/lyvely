export type ObjectClassDefinition = { [n: string]: boolean };
export type ArrayClassDefinition = (string | ObjectClassDefinition)[];
export type CssClassDefinition =
  | string
  | ArrayClassDefinition
  | ObjectClassDefinition;
export type StyleDefinition = { [n: string]: string };

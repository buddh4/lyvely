export interface ISetting {
  key: string;
  type: StringConstructor | BooleanConstructor | NumberConstructor;
  validator?: (val: any) => boolean;
}

import { IModuleImport, IModulesGlobImport } from '@/core';

export interface IWebConfig {
  apiUrl: string;
  baseUrl: string;
  moduleImports?: Array<IModulesGlobImport | IModuleImport>;
  modules?: Record<string, unknown>;
}

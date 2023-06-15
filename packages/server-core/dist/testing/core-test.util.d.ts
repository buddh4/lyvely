import { Provider, DynamicModule, ForwardReference } from '@nestjs/common';
import { ModelDefinition } from '@nestjs/mongoose/dist/interfaces';
import { Type } from '@lyvely/common';
import { TestingModuleBuilder } from '@nestjs/testing';
import mongoose from 'mongoose';
export declare const closeInMongodConnection: (key: string) => Promise<void>;
export declare const closeInMongodConnections: () => Promise<void>;
export declare function createCoreTestingModule(key: string, providers?: Provider[], models?: ModelDefinition[], imports?: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>, config?: {}): TestingModuleBuilder;
export declare function getObjectId(id: string): mongoose.Types.ObjectId;

import { ClientSession, Connection } from 'mongoose';
import { TransactionOptions } from 'mongodb';
export type Transaction = {
    session?: ClientSession;
};
export declare function setTransactionSupport(ts: boolean): void;
export declare function startSession(connection: Connection): Promise<ClientSession | undefined>;
export declare function startTransaction(connection: Connection, options?: TransactionOptions): Promise<{
    session?: ClientSession;
}>;
export declare function commitTransaction(transaction: Transaction): Promise<void>;
export declare function abortTransaction(transaction: Transaction): Promise<void>;
export declare function withTransaction<T>(connection: Connection, handler: (transaction: Transaction) => Promise<T>, options?: TransactionOptions): Promise<T>;

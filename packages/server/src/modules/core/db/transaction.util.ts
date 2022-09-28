import mongoose from 'mongoose';
import { ClientSession, TransactionOptions } from 'mongodb';

let transactionSupport = false;

type Transaction = { session: ClientSession };

export function setTransactionSupport(ts: boolean) {
  transactionSupport = ts;
}

export async function startSession(connection: mongoose.Connection) {
  return transactionSupport ? connection.startSession() : undefined;
}

export async function startTransaction(connection: mongoose.Connection, options?: TransactionOptions) {
  const session = await startSession(connection);
  if (session) session.startTransaction(options);
  return { session };
}

export async function commitTransaction({ session }) {
  if (transactionSupport && session) {
    await session.commitTransaction();
  }
}

export async function abortTransaction({ session }) {
  if (transactionSupport && session) {
    await session.abortTransaction();
  }
}

export async function withTransaction<T>(
  connection: mongoose.Connection,
  handler: (transaction: Transaction) => Promise<T>,
  options?: TransactionOptions,
): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    const transaction = await startTransaction(connection);
    try {
      const result = await handler(transaction);
      await commitTransaction(transaction);
      resolve(result);
    } catch (e) {
      await abortTransaction(transaction);
      reject(e);
    }
  });
}

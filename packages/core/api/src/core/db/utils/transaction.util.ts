import { ClientSession, Connection } from 'mongoose';
import type { TransactionOptions } from 'mongodb';

let transactionSupport = false;

export type Transaction = { session?: ClientSession };

export function setTransactionSupport(ts: boolean) {
  transactionSupport = ts;
}

export async function startSession(connection: Connection): Promise<ClientSession | undefined> {
  return transactionSupport ? connection.startSession() : undefined;
}

export async function startTransaction(
  connection: Connection,
  options?: TransactionOptions
): Promise<{ session?: ClientSession }> {
  const session = await startSession(connection);
  if (session) session.startTransaction(options);
  return { session };
}

export async function commitTransaction(transaction: Transaction) {
  if (transactionSupport && transaction.session) {
    await transaction.session.commitTransaction();
  }
}

export async function abortTransaction(transaction: Transaction) {
  if (transactionSupport && transaction.session) {
    await transaction.session.abortTransaction();
  }
}

export async function withTransaction<T>(
  connection: Connection,
  handler: (transaction: Transaction) => Promise<T>,
  options?: TransactionOptions
): Promise<T> {
  const transaction = await startTransaction(connection, options);
  try {
    const result = await handler(<Transaction>transaction);
    await commitTransaction(transaction);
    return result;
  } catch (e) {
    await abortTransaction(transaction);
    throw e;
  }
}

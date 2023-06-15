"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withTransaction = exports.abortTransaction = exports.commitTransaction = exports.startTransaction = exports.startSession = exports.setTransactionSupport = void 0;
let transactionSupport = false;
function setTransactionSupport(ts) {
    transactionSupport = ts;
}
exports.setTransactionSupport = setTransactionSupport;
async function startSession(connection) {
    return transactionSupport ? connection.startSession() : undefined;
}
exports.startSession = startSession;
async function startTransaction(connection, options) {
    const session = await startSession(connection);
    if (session)
        session.startTransaction(options);
    return { session };
}
exports.startTransaction = startTransaction;
async function commitTransaction(transaction) {
    if (transactionSupport && transaction.session) {
        await transaction.session.commitTransaction();
    }
}
exports.commitTransaction = commitTransaction;
async function abortTransaction(transaction) {
    if (transactionSupport && transaction.session) {
        await transaction.session.abortTransaction();
    }
}
exports.abortTransaction = abortTransaction;
async function withTransaction(connection, handler, options) {
    return new Promise(async (resolve, reject) => {
        const transaction = await startTransaction(connection, options);
        try {
            const result = await handler(transaction);
            await commitTransaction(transaction);
            resolve(result);
        }
        catch (e) {
            await abortTransaction(transaction);
            reject(e);
        }
    });
}
exports.withTransaction = withTransaction;

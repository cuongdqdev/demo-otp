const TransactionModel = require('../database/transaction-coll');
const UserModel = require('../database/user-coll')
const Client = require('authy-client').Client;
const client = new Client({ key: 'zdia5L5nZU736Na79RUuB1JVbTd8yFdP' });

class Transaction extends TransactionModel {
    static transfer(sender, reciever, amount, note) {
        return new Promise(async resolve => {
            try {

                if (Number.isNaN(amount) || !Number.isInteger(amount) || Math.sign(amount) != 1) {
                    return resolve({ error: true, message: 'invalid_amout' })
                }

                // kiểm tra số dư tài khoản
                let infoSender = await UserModel.findOne({ account: sender });

                if (!infoSender) {
                    return resolve({ error: true, message: 'cannot_find_sender' })
                }

                // kiểm tra số tiền chuyển
                if (infoSender.amount < Number(amount)) {
                    return resolve({ error: true, message: 'not_enough_money' })
                }

                // kiểm tra reciever
                let infoReciever = await UserModel.findOne({ account: reciever });

                if (!infoReciever) {
                    return resolve({ error: true, message: 'cannot_find_reciever' })
                }

                let infoTransaction = new TransactionModel({ sender, reciever, amount, note });

                if (!infoTransaction)
                    return resolve({ error: true, message: "cannot_transfer" });

                let infoTransactionAfterSaved = await infoTransaction.save();

                let senderAuthyID = infoSender.authyID;


                // await client.requestSms({ authyId: senderAuthyID })
                //     .then(function (response) {
                //         console.log('Message sent successfully to', response.cellphone);
                //     })
                //     .catch(function (error) {
                //         throw error;
                //     });

                return resolve({ error: false, data: infoTransactionAfterSaved });

            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static verifyTransaction(otpNumber, TRANSACTION) {
        return new Promise(async resolve => {
            try {

                if (!TRANSACTION) {
                    return resolve({ error: true, message: 'transaction_not_exist' });
                }

                let { sender, reciever, amount, _id } = TRANSACTION.data;

                let { inValidOTP } = TRANSACTION.data;
                let { account } = TRANSACTION.data


                let senderInfo = await UserModel.findOne({ account: sender });

                console.log(senderInfo);

                if (!senderInfo) {
                    return resolve({ error: true, message: 'cannot_find_sender' })
                }

                flag = false;

                let authyID = senderInfo.authyID;

                console.log(authyID);

                console.log(otpNumber);

                 await client.verifyToken({ authyId: authyID, token: otpNumber })
                    .then(function (response) {
                        console.log('Token is valid');
                        flag = true;
                    })
                    .catch(function (error) {
                        throw error;
                    });


                if (!flag) {
                    TRANSACTION.data['inValidOTP'] = Number(inValidOTP) + 1;
                    if (TRANSACTION.data['inValidOTP'] === Number(5)) {
                        let infoSender = await UserModel.findOneAndUpdate(account, { status: '0' }, { new: true });
                        return resolve({ error: true, message: 'account_locked' })
                    }
                    return resolve({ error: true, data: 'invalid_otp' })
                }

                // trừ tiền sender
                let infoSender = await UserModel.findOneAndUpdate({ account: sender }, { $inc: { amount: Number(-amount) } }, { new: true });

                if (!infoSender) {
                    return resolve({ error: true, message: 'cannot_find_sender' });
                }

                // cộng tiền reciever
                let infoReciever = await UserModel.findOneAndUpdate({ account: reciever }, { $inc: { amount: Number(amount) } }, { new: true });

                if (!infoReciever) {
                    return resolve({ error: true, message: 'cannot_find_reciever' });
                }

                // cập nhật trạng thái transaction thành công
                let infoTransaction = await TransactionModel.findByIdAndUpdate(_id, { status: 1, OTP: otpNumber }, { new: true });

                if (!infoTransaction) {
                    return resolve({ error: true, message: 'cannot_transfer' });
                }

                return resolve({ error: false, data: infoTransaction })

            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }

    static historyTransaction(account) {
        return new Promise(async resolve => {
            try {

                let infoSenderTransaction = await TransactionModel.find({ sender: account });

                if (!infoSenderTransaction) return resolve({ error: true, message: 'cannot_find_sender_history_list' });

                let infoReceiverTransaction = await TransactionModel.find({ reciever: account });

                if (!infoReceiverTransaction) return resolve({ error: true, message: 'cannot_find_receiver_history_list' });

                let infoHistoryTransaction = [...infoSenderTransaction, ...infoReceiverTransaction];

                return resolve({ error: false, data: infoHistoryTransaction })
            } catch (error) {
                return resolve({ error: true, message: error.message })
            }
        })
    }
}

module.exports = Transaction
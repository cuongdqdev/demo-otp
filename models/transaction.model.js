const TransactionModel = require('../database/transaction-coll');

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

                let recieverAuthyID = infoReciever.authyID;


                // await client.requestSms({ authyId: recieverAuthyID })
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
                let { inValidOTP } = TRANSACTION.data;
                let { account } = TRANSACTION.data
                if (otpNumber !== '123456') {
                    TRANSACTION.data['inValidOTP'] = Number(inValidOTP) + 1;
                    if (TRANSACTION.data['inValidOTP'] === Number(5)) {
                        let infoSender = await UserModel.findOneAndUpdate(account, { status: '0' });
                        return resolve({ error: true, message: 'account_locked' })
                    }
                    return resolve({ error: true, data: 'invalid_otp' })
                }

                let { sender, reciever, amount, _id } = TRANSACTION.data;

                // trừ tiền sender
                let infoSender = await UserModel.findOneAndUpdate({ account: sender }, { $inc: { amount: Number(-amount) } });

                if (!infoSender) {
                    return resolve({ error: true, message: 'cannot_find_sender' });
                }

                // cộng tiền reciever
                let infoReciever = await UserModel.findOneAndUpdate({ account: reciever }, { $inc: { amount: Number(amount) } });

                if (!infoReciever) {
                    return resolve({ error: true, message: 'cannot_find_reciever' });
                }

                // await client.verifyToken({ authyId: 1635, token: '1234567' })
                //     .then(function (response) {
                //         console.log('Token is valid');
                //     })
                //     .catch(function (error) {
                //         throw error;
                //     });

                // cập nhật trạng thái transaction thành công
                let infoTransaction = await TransactionModel.findOneAndUpdate(_id, { status: 1 });

                if (!infoTransaction) {
                    return resolve({ error: true, message: 'cannot_transfer' });
                }

                return resolve({ error: false, data: infoTransaction })

            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
}

module.exports = Transaction
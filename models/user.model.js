const UserModel = require('../database/user-coll');

class User extends UserModel {
    static register(username, password, email, fullname, phone) {
        return new Promise(async resolve => {
            try {
                let authyID = '';

                let checkExist = await UserModel.findOne({
                    $or: [
                        { username: username },
                        { email: email },
                        { phone: phone }
                    ]
                })

                if (checkExist) return resolve({ error: true, message: 'username_or_email_or_phone_existed' });

                await client.registerUser({ countryCode: 'VN', email: email, phone: phone })
                    .then(function (response) {
                        // console.log('Authy Id', response.user.id);
                        authyID = response.user.id;
                    })
                    .catch(function (error) {
                        throw error;
                    });

                let infoUser = new UserModel({ username, password, email, fullname, phone, authyID });

                if (!infoUser)
                    return resolve({ error: true, message: "cannot_register" });

                let infoUserAfterSaved = await infoUser.save();

                return resolve({ error: false, data: infoUserAfterSaved });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static login(usernameOrPhone, password) {
        return new Promise(async resolve => {
            try {

                if (!usernameOrPhone || !password) {
                    return resolve({ error: true, message: 'invalid_param' })
                }

                let checkExist = await UserModel.findOne({
                    $or: [
                        { username: usernameOrPhone },
                        { phone: usernameOrPhone }
                    ]
                })

                if (!checkExist) return resolve({ error: true, message: 'username_or_phone_not_exist' });

                if (checkExist.password !== password) return resolve({ error: true, message: 'wrong_password' })

                checkExist['password'] = undefined;

                return resolve({ error: false, data: checkExist });
            } catch (error) {
                return resolve({ error: true, message: error.message })
            }
        });
    }
}

module.exports = User
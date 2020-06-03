const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
    async comparePasswords(saved, supplied) {
        const [hashed, salt] = saved.split('.');

        const hashedSuppliedBuff = await scrypt(supplied, salt, 64);

        return hashed === hashedSuppliedBuff.toString('hex');
    }

    async create(attrs){
        // attrs === { email: : '', password: ''}
        attrs.id = this.randomId();

        const salt = crypto.randomBytes(8).toString('hex');
        const buff = await scrypt(attrs.password, salt, 64);

        const records = await this.getAll();

        const record = {
            ...attrs,
            password: `${buff.toString('hex')}.${salt}`
        };

        records.push(record);

        await this.writeAll(records);

        return record;
    }
}

module.exports = new UsersRepository('users.json');

// const test = async () => {
//     const repo = new UsersRepository('users.json');

//     await repo.create({email: 'test@test.com', password: 'password'});

//     const users = await repo.getAll();

//     const user = await repo.getOne('60c9d733');

//     console.log(user);

//     await repo.delete('b0e82917');

//     await repo.update('c5a2046c', { name: 'barry briggs'});

//     const user = await repo.getOneBy({
//         email: 'test@test.com',
//         password: 'password',
//         id: 'c5a2046c'
//     });

//     console.log(user);
// }

// test();


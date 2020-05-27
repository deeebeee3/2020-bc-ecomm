const fs = require('fs');
const crypto = require('crypto');

class UsersRepository{
    constructor(filename){
        if(!filename){
            throw new Error('Creating a repository requires a filename');
        }

        this.filename = filename;

        try{
            fs.accessSync(this.filename);
        }catch(err){
            fs.writeFileSync(this.filename, '[]');
        }
    }

    async getAll() {
        //open the file called this.filename
        // const contents = await fs.promises.readFile(this.filename, {encoding: 'utf8'});

        //parse the contents
        // const data = JSON.parse(contents);

        //return the parsed data
        // return data;

        return JSON.parse(
            await fs.promises.readFile(this.filename, { 
                encoding: 'utf8'
            })
        );
    }

    async create(attrs){
        attrs.id = this.randomId();

        const records = await this.getAll();

        records.push(attrs);

        await this.writeAll(records);
    }

    async writeAll(records){
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
    }

    randomId() {
        //return Math.random() * 9999999;
        return crypto.randomBytes(4).toString('hex');
    }

    async getOne(id){
        const records = await this.getAll();

        return records.find(record => record.id === id);  
    }

    async delete(id) {
        const records = await this.getAll();

        //just keep the records that do not have the passed in id
        const filteredRecords = records.filter(record => record.id !== id);

        await this.writeAll(filteredRecords);
    }

    async update(id, attrs) {
        const records = await this.getAll();
        const record = records.find(record => record.id === id);

        if(!record){
            throw new Error(`Record with id ${id} not found`);
        }

        Object.assign(record, attrs);
        await this.writeAll(records);
    }
}

const test = async () => {
    const repo = new UsersRepository('users.json');

    //await repo.create({email: 'test@test.com', password: 'password'});

    //const users = await repo.getAll();

    //const user = await repo.getOne('60c9d733');

    //console.log(user);

    //await repo.delete('b0e82917');

    await repo.update('c5a2046c', { name: 'barry briggs'});
}

test();


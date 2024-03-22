const bcrypt = require('bcryptjs')
const db = require('_helpers/db')

module.exports = {
    getAll,
    create
}

async function getAll(){
    return await db.User.findAll();
}

async function create(params){
    if(await db.User.findOne({where : {email : params.email}})){
        throw 'Email "' + params.email + '" is already registered';
    }

    const user = new db.User(params);

    user.passwordHash = await bcrypt.hash(params.password, 10);

    await user.save()
}
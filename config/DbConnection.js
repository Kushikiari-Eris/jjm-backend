const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()


const dbConnection = async () =>{
    try {
        await mongoose.connect(process.env.DB_DATABASE)
        
        console.log('Database Connected Successfully')
        
    } catch (error) {
        console.log(error)
    }
}

module.exports = dbConnection
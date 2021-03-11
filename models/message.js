const { Sequelize, Model, DataTypes } = require('sequelize')
const sequelize = new Sequelize({

    dialect:'sqlite',
    storage:'./database.sqlite'
})

class Message extends Model{}

Message.init({
    message:{
        type:DataTypes.STRING,
        allowNull:false
    },
    author:{
        type:DataTypes.STRING,
        allowNull:false
    },
    ts:{
        type: DataTypes.BIGINT,
        allowNull:false
    }

},{sequelize})

Message.sync()

module.exports = Message;

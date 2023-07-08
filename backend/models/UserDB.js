const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserDB = mongoose.model(
  new Schema({ //cria de fato a tabela
    id: { //adição de informações da tabela
      type:Number, //O type define o tipo. Pode ser String ou Number.
      required: true, //Esse campo tem que estar preenchido pra ser cadastrado, senão não vai.
      unique: true //Bom pra IDs. Não permite que dois IDs de tabelas diferentes sejam iguais.
    },
    //id: Number,
    name: String,
    email: String,
    password: String,
    creditCard: {
      name: String,
      number: Number,
      cvv: Number
    }
  })
);

module.exports = UserDB;

const mongoose = require('mongoose');

// Definindo o Schema para Endereço
const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  country: String
});

// Definindo o Schema para Usuário
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  addresses: [addressSchema]  // Array de endereços incorporados
});

// Criando os modelos a partir dos Schemas
const Address = mongoose.model('Address', addressSchema);
const User = mongoose.model('User', userSchema);

// Criando um novo usuário com endereços incorporados
const user = new User({
  name: 'João Silva',
  email: 'joao@example.com',
  addresses: [
    { street: 'Rua A', city: 'São Paulo', state: 'SP', country: 'Brasil' },
    { street: 'Rua B', city: 'Rio de Janeiro', state: 'RJ', country: 'Brasil' },
  ]
});


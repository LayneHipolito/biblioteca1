const UserDB = require('../models/UserDB'); //importamos a tabela (que no mongo é chamada de collection) pra usarmos aqui no file do controller do user.

module.exports = class UserController { //já exportamos a função pra usar em outros files enquanto a criamos. Essa classe vai ter todas as funções/métodos que precisamos pra mexer no usuário.

  static async register(req, res) { //req = request, res = response. A request tem todas as informações que vem do front, a response é o que o back vai mandar depois de fazer o que precisa com a request.
    //coisas do id
    var id = req.body.id
    const max = await UserDB.findOne({}).sort({ id: -1 }); //essa linha e a debaixo produzem um id único pro user tendo certeza de não repetir um que já tem.
    id = max == null ? 1 : max.id + 1;
    //resto das propriedades do modelo
    const name = req.body.name; //a const que criamos recebe o valor correspondente ao que esperamos do front (nesse caso, um nome) pra podermos trabalhar com a informação aqui no back.
    const email = req.body.email; //mesma coisa, só que agora é email e assim por diante.
    const password = req.body.password;
    const creditCard = req.body.creditCard
    const confirmpassword = req.body.confirmpassword; //repare que a confirmpassword não existe na tabela do user, pois só precisamos comparar as duas senhas (igual geralmente pede pra escrever duas vezes durante o cadastro) e depois mandamos só uma vez pra tabela desse novo usuário.

    // validations
    if (!name) { //Aqui fazemos as verificações pra ver se os campos não vieram vazios. 
      res.status(422).json({ message: 'O nome é obrigatório!' }) //Caso a constante esteja vazia, mandamos uma res com o status 422 (que significa 'Formato correto mas falta informação') e daí um json com uma mensagem. 
      return //O return para o fluxo do código. Então ele é forçado a acabar aqui caso o erro aconteça, impedindo que o novo usuário seja salvo faltando informação.
    };

    if (!email) {
      res.status(422).json({ message: 'O e-mail é obrigatório!' })
      return
    };

    if (!password) {
      res.status(422).json({ message: 'A senha é obrigatória!' })
      return
    };
  
    if(!creditCard){
      res.status(422).json({message: 'Os dados do cartão de crédito são obrigatórios!'})
    };
 
    if (!confirmpassword) {
      res.status(422).json({ message: 'A confirmação de senha é obrigatória!' })
      return
    }

    if (password != confirmpassword) { //Aqui os dois campos são comparados pra ver se a senha é a mesma. Caso não seja ele termina a função com a mensagem abaixo.
      res
        .status(422)
        .json({ message: 'A senha e a confirmação precisam ser iguais!' })
      return
    } // Perceba que o padrão aqui é que no final de todas as verificações o programa finalmente faz o que tem que fazer. Nesse caso, um registro. E no caminho as informações tem que passar por todas as verificações sem falhar, caso contrário o código termina.


    // check if user exists
    const userExists = await UserDB.findOne({ email: email }) //aqui a const userExists recebe do banco um usuário caso já haja algum com o email em questão.

    if (userExists) { //Caso tenha sido encontrado um usuário, esse if termina o programa, pois não se pode cadastrar dois usuários com o mesmo email no nosso código. Você pode substituir essa verificação e colocar o cpf no lugar ou qualquer outra variável baseado no critério que quer seguir.
      res.status(422).json({ message: 'Email já cadastrado!' })
      return
    }

    // create user
    const user = new UserDB({ //Aqui, depois de passar por todas as verificações com sucesso, a const user recebe o modelo de tabela do User do Models (Com todas as informações igual lá) e então nós preenchemos cada campo com as informações que vieram do front através do req.body, agora que já verificamos todas elas.
      id: id,
      name: name,
      email: email,
      password: password,
      creditCard: creditCard,
    }) //Mas perceba que o novo usuário ainda não está cadastrado no banco, ele apenas foi construido. Apenas quando se utiliza a função .save() do mongoose o novo objeto é salvo.

    try { //O try indica que essa parte do código a seguir pode dar varios erros, então preparamos no catch uma tratativa, geralmente com o intuito de manter o app funcionando mesmo caso um erro aconteça. Isso é importante pq sites não podem cair só pq algum erro aconteceu. 
      const newUser = await user.save() //Aqui o nosso novo user com todas as informações preenchidas finalmente é salvo no banco com a função .save(). A const newUser vai servir pra mostrar na tela o usuário salvo depois, visto que ela armazena o valor de user.
      res.status(201).json({ //Não esqueça que a res é o que o front vai mostrar, então sempre temos que comunicar algo. Aqui, ela comunica o sucesso da operação.
        message: 'Cliente cadastrado com sucesso!',
        newUser: newUser, //Aqui o usuário salvo é mostrado ao usuário na tela pra ele ver o que foi salvo.
    })

    } catch (error) { //Aqui o bloco catch pode ser acionado caso haja algum erro na parte dentro do blocop try.
      console.error(error); //Aqui o erro é exibido no terminal.
      res.status(500).json({ message: 'Erro ao salvar cliente' }) //Aqui a res retorna o status 500 (que signfica erro desconhecido) e uma mensagem pro front.
    }
  } //A partir daqui o código se torna bem repetitivo, mas vou comentar o que tiver de diferente.

  //Aqui finalmente começa outra função/método dentro da nossa classe de mexer no User. A de registrar é a maior pois tem muitas verificações pra fazer já que são necessárias todas as informações da tabela do user pra fazer o cadastro de um novo usuário.
  static async MostrarUsuarios(req, res) { //Essa função é bem simples, ela pega todos os usuários registrados e mostra no front. Não é necessário recuperar nada do request pois nada irá ser registrado/alterado nessa função.
    try {  
      const resultado = await UserDB.find({}); //Como  o objetivo aqui é só mostrar todos os users, nós declaramos uma const (igual sempre que queremos armazenar uma informação) e por meio do UserDB.find({}) nós retornamos tudo. O find, diferente do findOne, é capaz de retornar mais de um único user, e quando declaramos as {} vazias ele pega tudo o que tem relacionado àquela tabela.
      res.status(200).json(resultado); //Aqui, como sempre quando queremos mandar coisa pro front, usamos o res (response) e enviamos os usuários armazenados na const resultado como json.
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao listar os assinantes" });
    }
  }

  static async login(req, res) {
    const email = req.body.email
    const password = req.body.password

    if (!email) {
      res.status(422).json({ message: 'O e-mail é obrigatório!' })
      return
    }

    if (!password) {
      res.status(422).json({ message: 'A senha é obrigatória!' })
      return
    }

    // check if user exists
    const user = await UserDB.findOne({ email: email })

    if (!user) {
      return res
        .status(422)
        .json({ message: 'Não há usuário cadastrado com este e-mail!' })
    }

    // check if password match
    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {
      return res.status(422).json({ message: 'Senha inválida' })
    }

    await createUserToken(user, req, res)
  }

  /*verifica se um usuário está autenticado com base no token de autorização fornecido e retorna 
  as informações do usuário (sem a senha) ou null se o usuário não estiver autenticado*/
  static async checkUser(req, res) {
    let currentUser

    console.log(req.headers.authorization)

    if (req.headers.authorization) {
      const token = getToken(req)
      const decoded = jwt.verify(token, 'nossosecret')

      currentUser = await User.findById(decoded.id)

      currentUser.password = undefined
    } else {
      currentUser = null
    }

    res.status(200).send(currentUser)
  }

  static async getUserById(req, res) {
    const id = req.params.id

    const user = await UserDB.findById(id)

    if (!user) {
      res.status(422).json({ message: 'Usuário não encontrado!' })
      return
    }

    res.status(200).json({ user })
  }
  
  static async editUser(req, res) {
    const token = getToken(req)

    //console.log(token);

    const user = await getUserByToken(token)

    // console.log(user);
    // console.log(req.body)
    // console.log(req.file.filename)

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;
    const address = req.body.address;
    const cpf = req.body.cpf;
    const creditCard = req.body.creditCard;
    const confirmpassword = req.body.confirmpassword;

    // validations
    if (!name) {
      res.status(422).json({ message: 'O nome é obrigatório!' })
      return
    }

    user.name = name;

    if (!email) {
      res.status(422).json({ message: 'O e-mail é obrigatório!' })
      return
    }

    // check if user exists
    const userExists = await User.findOne({ email: email })

    if (user.email !== email && userExists) {
      res.status(422).json({ message: 'Por favor, utilize outro e-mail!' })
      return
    }

    user.email = email;

     // check if password match
     if (password != confirmpassword) {
      res.status(422).json({ error: 'As senhas não conferem.' })

      // change password
    } else if (password == confirmpassword && password != null) {
      // creating password
      const salt = await bcrypt.genSalt(12)
      const reqPassword = req.body.password

      const passwordHash = await bcrypt.hash(reqPassword, salt)

      user.password = passwordHash;
    }

    /*if (image) {
      const imageName = req.file.filename
      user.image = imageName
    }*/

    if (!phone) {
      res.status(422).json({ message: 'O telefone é obrigatório!' })
      return
    }

    user.phone = phone;

    if(!address){
      res.status(422).json({ message: 'O endereço é obrigatório!' })
    }

    user.address = address;

    if(!cpf){
      res.status(422).json({ message: 'O CPF é obrigatório!' })
    }

    user.cpf = cpf;

    if(!creditCard){
      res.status(422).json({ message: 'O cartão de crédito é obrigatório!' })
    }

    user.creditCard = creditCard;

    try {
      // returns updated data
      const updatedUser = await UserDB.findOneAndUpdate(
        { _id: user._id },
        { $set: user },
        { new: true },
      )
      res.json({
        message: 'Usuário atualizado com sucesso!',
        data: updatedUser,
      })
    } catch (error) {
      res.status(500).json({ message: error })
    }
  }

  static async deleteUser(req, res) {
    try {
      const id = req.params.id;
      const _id = String((await UserDB.findOne({ id: id }))._id);
      await UserDB.findByIdAndRemove(String(_id));
      res.status(200).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao excluir o cliente" });
    }
  }
}
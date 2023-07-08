const router = require("express").Router();//importanto o router

const UserController = require("../controllers/UserController");//importando o controller do User

router.get("/users", UserController.MostrarUsuarios);
router.post("/register", UserController.register);//rota de cadastro
router.post("/login", UserController.login);//rota de login
router.get("/checkuser", UserController.checkUser);
router.patch("/edit/:id", /*verifyToken,*/ /*imageUpload.single("image"),*/ UserController.editUser);//rota para editar usuário
router.delete("/:id", UserController.deleteUser);//rota para deletar usuário por id
router.get("/:id", UserController.getUserById);//rota de listar usuário por id

module.exports = router;

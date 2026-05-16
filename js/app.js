import { registrarContato, exibirContatos } from "./contatos.js";

registrarContato();
exibirContatos();

import { uploadParaCloudinary } from "./cloudnary.js";
uploadParaCloudinary();


import { registrarContato, exibirContatos } from "./contatos.js";
import { uploadParaCloudinary } from "./cloudnary.js";


const btnLogin = document.getElementById("btn-login");
const loginContainer = document.getElementById("login-container");
const mainContent = document.getElementById("main-content");


btnLogin.addEventListener("click", () => {

  const usuario = document.getElementById("login-user").value;
  const senha = document.getElementById("login-password").value;


  if (usuario && senha) {


    loginContainer.style.display = "none";


    mainContent.style.display = "block";

    registrarContato();
    exibirContatos();
    uploadParaCloudinary();

  } else {

    alert("Preencha usuário e senha");

  }

});
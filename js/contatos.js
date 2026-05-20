const BASE_URL = "https://bakcend-fecaf-render.onrender.com/contatos" /*endereço da API*/

/*-----------------------------------função GET---------------------------------------------*/

export async function getContatos() {
  const response = await fetch(BASE_URL) /*fetch() Função nativa do JavaScript usada para acessar APIs. method GET é o padrão do fetch*/
  if (!response.ok) /*! significa 'não'*/ {
    throw new Error("Erro ao buscar contatos")
  }
  return response.json()
}

/*---------------------------------------------------------------------------------------*/

/*-----------------------------------função POST-------------------------------------------*/

export async function criarContato(contato) {
  const optionsPost = {
    method: "POST",/*Enviar dados para criar algo.*/
    headers: {
      "Content-Type": "application/json" /*está avisando que os dados enviados estarão em json*/
    },
    body: JSON.stringify(contato) /*transforma o objeto em texto json*/
  }/*tudo isso cria um objeto de configurações da requisição*/

  const respondePost = await fetch(BASE_URL, optionsPost)
  /*Agora o fetch envia:
- URL
- método POST
- body
- headers
Tudo para a API.*/

  if (!respondePost.ok) {
    throw new Error("Erro ao criar contato")
  }

  return respondePost.json() /*return devolve um valor*/
  /*  
      JSON.stringify() | JS → JSON para a api receber valor em json
      response.json()  | JSON → JS para a api responder em objeto javascript
*/
}

/*--------------------------------------------------------------------------------------*/

/*-----------------------------------função PUT-------------------------------------------*/

export async function atualizarContato(id /*qual contato será alterado*/, contato) {
  const optionsPut = {
    method: "PUT",/*significa atualizar algo existente*/
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(contato)
  }

  const respondePut = await fetch(`${BASE_URL}/${id}` /*atualiza o id que será atualizado*/, optionsPut)

  if (!respondePut.ok) {
    throw new Error("Erro ao atualizar contato")
  }

  return respondePut.json()
}

/*--------------------------------------------------------------------------------------*/

/*-----------------------------------função DELETE-----------------------------------------*/

export async function deletarContato(id) {
  const optionsDelete = {
    method: "DELETE" /*pra excluir algo*/
  }

  const respondeDelete = await fetch(`${BASE_URL}/${id}`, optionsDelete)

  if (!respondeDelete.ok) {
    throw new Error("Erro ao deletar contato")
  }

  return true
}

/*--------------------------------------------------------------------------------------*/

/*-----------------------------------ESTADO DA APLICAÇÃO----------------------------------*/

let idEditando = null /*guarda qual contato está sendo editado. null = nenhum*/
let fotoUrl = ""      /*guarda a URL da foto após o upload no Cloudinary*/

/*--------------------------------------------------------------------------------------*/

/*-----------------------------------UPLOAD CLOUDINARY------------------------------------*/

async function uploadCloudinary(arquivo) {
    const formData = new FormData()
    formData.append("file", arquivo)
    formData.append("upload_preset", "contatos")
    const response = await fetch(
        "https://api.cloudinary.com/v1_1/dax5dntte/image/upload",
        {
            method: "POST",
            body: formData
        }
    )
    const dados = await response.json()
    fotoUrl = dados.secure_url /*salva a URL pública da imagem*/
}

/*--------------------------------------------------------------------------------------*/

/*-----------------------------------PREVIEW DE IMAGEM------------------------------------*/

function previewImagem({ target }) {
    const arquivo = target.files[0]
    if (!arquivo) return
    const previewImage = document.getElementById("preview-image")
    previewImage.src = URL.createObjectURL(arquivo) /*mostra a imagem localmente antes do upload*/
    uploadCloudinary(arquivo)
}

/*--------------------------------------------------------------------------------------*/

/*-----------------------------------RENDERIZAR CONTATOS----------------------------------*/

async function mostrarContatos() {
    const lista = document.getElementById("lista")
    lista.innerHTML = "" /*limpa a lista antes de redesenhar*/
    const contatos = await getContatos()

    for (let i = 0; i < contatos.length; i++) {
        /*for repete código várias vezes*/
        /*let i = 0 cria uma variável chamada i*/
        /*length é a quantidade de itens*/
        /*i++ significa que i aumenta de 1 em 1*/
        const contato = contatos[i] /*contatos[i] = pegue o item da posição i*/

/*----------------------------------- CRIAR CARD ---------------------------------------*/

        const card = document.createElement("div")
        card.classList.add("card")
        card.innerHTML = `
            <img src="${contato.foto}" alt="foto">
            <div class="card-info">
                <h2>${contato.nome}</h2>
                <p><strong>Celular:</strong> ${contato.celular}</p>
                <p><strong>Email:</strong> ${contato.email}</p>
                <p><strong>Endereço:</strong> ${contato.endereco}</p>
                <p><strong>Cidade:</strong> ${contato.cidade}</p>
                <div class="botoes">
                    <button class="btn-editar">Editar</button>
                    <button class="btn-deletar">Deletar</button>
                </div>
            </div>
        `
        lista.appendChild(card) /*Pega a variável card e coloca dentro da div de id lista.*/

/*---------------------------------------BOTÃO DELETAR-----------------------------*/

        const btnDeletar = card.querySelector(".btn-deletar") /*procura dentro da variavel card o .btn-deletar na div. queryselector busca classe e id (com #) tb*/

        btnDeletar.addEventListener("click", async function () {
            await deletarContato(contato.id)
            mostrarContatos() /*recarregar*/
        }) /*addEventListener é qdo eu clicar no btnDeletar, a função aí vai rodar*/

/*-------------------------------------BOTÃO EDITAR-----------------------------*/

        const btnEditar = card.querySelector(".btn-editar")
        btnEditar.addEventListener("click", function () {
            const previewImage = document.getElementById("preview-image")
            document.getElementById("nome").value     = contato.nome
            document.getElementById("celular").value  = contato.celular
            document.getElementById("email").value    = contato.email
            document.getElementById("endereco").value = contato.endereco
            document.getElementById("cidade").value   = contato.cidade
            previewImage.src = contato.foto
            fotoUrl      = contato.foto
            idEditando   = contato.id

            window.scrollTo({ top: 0, behavior: "smooth" }) /*faz a tela rolar pra cima*/
        })

    } /*o for termina aqui*/
}

/*--------------------------------------------------------------------------------------*/

/*-----------------------------------SALVAR FORMULÁRIO------------------------------------*/

function iniciarFormulario() {
    const formulario   = document.getElementById("formulario")
    const previewInput = document.getElementById("preview-input")
    const previewImage = document.getElementById("preview-image")

    formulario.addEventListener("submit", async function (event) {
        event.preventDefault() /*o comportamento padrão do formulário é recarregar a página (preventDefault quebra esse comportamento)*/
        const contato = {
            nome:     document.getElementById("nome").value,
            celular:  document.getElementById("celular").value,
            foto:     fotoUrl,
            email:    document.getElementById("email").value,
            endereco: document.getElementById("endereco").value,
            cidade:   document.getElementById("cidade").value
        }

        if (idEditando != null) {
            await atualizarContato(idEditando, contato) /*EDITAR: envia PUT*/
            idEditando = null
        } else {
            await criarContato(contato) /*CRIAR: envia POST*/
        }

        formulario.reset()
        previewImage.src = "./image/iconeUpload.png"
        fotoUrl = ""
        mostrarContatos()
    })

    previewInput.addEventListener("change", previewImagem)
}

/*--------------------------------------------------------------------------------------*/

/*-----------------------------------TELA DO CRUD-----------------------------------------*/

export function mostrarSistema(app) {
    app.innerHTML = `
        <section class="form-section">
            <form id="formulario" class="form-container">
                <h2>Adicionar Novo Contato</h2>
                <div class="preview-container">
                    <input 
                        type="file"
                        id="preview-input"
                        class="preview-input"
                        accept="image/*">
                    <label for="preview-input" class="preview-label">
                        <img 
                            id="preview-image"
                            class="preview-image"
                            src="./image/iconeUpload.png"
                            alt="upload">
                    </label>
                </div>
                <input type="text"  id="nome"     placeholder="Nome"     required>
                <input type="text"  id="celular"  placeholder="Celular"  required>
                <input type="email" id="email"    placeholder="Email"    required>
                <input type="text"  id="endereco" placeholder="Endereço" required>
                <input type="text"  id="cidade"   placeholder="Cidade"   required>
                <button type="submit" class="btn-salvar">Salvar Contato</button>
            </form>
        </section>

        <section class="list-section">
            <div id="lista" class="lista-contatos"></div>
        </section>
    `
    iniciarFormulario() /*ativa os eventos do formulário*/
    mostrarContatos()   /*carrega os contatos da API*/
}

/*--------------------------------------------------------------------------------------*/

/*-----------------------------------TELA DE LOGIN----------------------------------------*/

export function mostrarLogin(app) {
    app.innerHTML = `
        <section class="login-container">
            <form class="login-form" id="login-form">
                <h2>Login</h2>
                <input type="email"    placeholder="Email" required>
                <input type="password" placeholder="Senha" required>
                <button class="btn-login">Entrar</button>
            </form>
        </section>
    `
    const loginForm = document.getElementById("login-form")
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault()
        mostrarSistema(app) /*ao fazer login, troca a tela para o CRUD*/
    })
}

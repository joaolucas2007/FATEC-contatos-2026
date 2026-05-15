const BASE_URL = "https://bakcend-fecaf-render.onrender.com/contatos";




async function getContatos() {
  try {
    const response = await fetch(BASE_URL);

    if (!response.ok) {
      throw new Error("Erro ao buscar contatos");
    }

    return await response.json();

  } catch (error) {
    console.error(error);
    return [];
  }
}




export function registrarContato() {

  const form = document.getElementById("form-contato");

  if (!form) return;

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const contato = {
      nome: document.getElementById("input-nome").value,
      celular: document.getElementById("input-celular").value,
      email: document.getElementById("input-email").value,
      foto: document.getElementById("input-foto").value,
      endereco: document.getElementById("input-endereco").value,
      cidade: document.getElementById("input-cidade").value,
    };

    try {

      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contato),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar contato");
      }

      alert("Contato cadastrado com sucesso!");

      form.reset();

      exibirContatos();

    } catch (error) {

      console.error(error);

      alert("Erro ao cadastrar contato");
    }
  });
}


export async function exibirContatos() {

  const contatos = await getContatos();

  console.log(contatos);

  const template = document.getElementById("cards");

  const emptyState = document.getElementById("empty-state");

  if (!template) return;

  template.replaceChildren();

  if (contatos.length === 0) {

    emptyState.style.display = "flex";

    return;
  }

  emptyState.style.display = "none";

  contatos.forEach((item) => {

    const cardContato = `
      <div class="contact-card-style">

        <h3>${item.nome}</h3>

        <img
          src="${item.foto || 'https://img.freepik.com/psd-gratuitas/ilustracao-3d-de-avatar-ou-perfil-humano_23-2150671122.jpg'}"
          alt="imagem do contato"
        />

        <p><strong>Id:</strong> ${item.id}</p>

        <p><strong>Celular:</strong> ${item.celular || "Não informado"}</p>

        <p><strong>E-mail:</strong> ${item.email || "Não informado"}</p>

        <p><strong>Endereço:</strong> ${item.endereco || "Não informado"}</p>

        <p><strong>Cidade:</strong> ${item.cidade || "Não informado"}</p>

        <div class="card-actions">

          <button
            class="btn-action btn-put"
            onclick="editarContato(${item.id})"
          >
            Editar Contato
          </button>

          <button
            class="btn-action btn-delete"
            onclick="deletarContato(${item.id})"
          >
            Excluir Contato
          </button>

        </div>

      </div>
    `;

    template.innerHTML += cardContato;
  });
}



window.deletarContato = async function(id) {

  const confirmar = confirm(
    "Deseja excluir este contato?"
  );

  if (!confirmar) return;

  try {

    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erro ao deletar contato");
    }

    alert("Contato excluído!");

    exibirContatos();

  } catch (error) {

    console.error(error);

    alert("Erro ao excluir contato");
  }
};


window.editarContato = async function(id) {

  const contatos = await getContatos();

  const contato = contatos.find(
    (item) => item.id == id
  );

  if (!contato) return;

  document.getElementById("input-nome").value =
    contato.nome;

  document.getElementById("input-celular").value =
    contato.celular;

  document.getElementById("input-email").value =
    contato.email;

  document.getElementById("input-foto").value =
    contato.foto;

  document.getElementById("input-endereco").value =
    contato.endereco;

  document.getElementById("input-cidade").value =
    contato.cidade;

  // REMOVE O FORM ANTIGO
  const form = document.getElementById("form-contato");

  form.onsubmit = async function(e) {

    e.preventDefault();

    const contatoAtualizado = {
      nome: document.getElementById("input-nome").value,
      celular: document.getElementById("input-celular").value,
      email: document.getElementById("input-email").value,
      foto: document.getElementById("input-foto").value,
      endereco: document.getElementById("input-endereco").value,
      cidade: document.getElementById("input-cidade").value,
    };

    try {

      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contatoAtualizado),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar contato");
      }

      alert("Contato atualizado!");

      form.reset();

      form.onsubmit = null;

      registrarContato();

      exibirContatos();

    } catch (error) {

      console.error(error);

      alert("Erro ao atualizar contato");
    }
  };
};

let fotoBase64 = ""
const previewInput = document.getElementById("preview-input")
const previewImage = document.getElementById("preview-image")

function previewImagem({ target }) {
    const arquivo = target.files[0]
    if (!arquivo) return
    previewImage.src = URL.createObjectURL(arquivo)
    converterBase64(arquivo)
}

function converterBase64(arquivo) {
    const reader = new FileReader()
    reader.onload = function () {
        fotoBase64 = reader.result
    }
    reader.readAsDataURL(arquivo)
}

previewInput.addEventListener("change", previewImagem)
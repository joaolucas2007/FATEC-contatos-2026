const BASE_URL = "https://bakcend-fecaf-render.onrender.com/contatos";

const form = document.getElementById("form-contato");
const inputId = document.getElementById("input-id");
const inputNome = document.getElementById("input-nome");
const inputCelular = document.getElementById("input-celular");
const inputEmail = document.getElementById("input-email");
const inputFoto = document.getElementById("input-foto");
const inputEndereco = document.getElementById("input-endereco");
const inputCidade = document.getElementById("input-cidade");
const cards = document.getElementById("cards");
const emptyState = document.getElementById("empty-state");
const contador = document.getElementById("contador");
const btnCancelar = document.getElementById("btn-cancelar");
const formTitle = document.getElementById("form-title");
const searchInput = document.getElementById("search-input");

let contatos = [];

async function getContatos() {
    try {
        const response = await fetch(BASE_URL);
        contatos = await response.json();
        renderContatos(contatos);
    } catch (error) {
        console.error("Erro ao buscar contatos:", error);
    }
}

function renderContatos(lista) {
    cards.innerHTML = "";
    contador.textContent = `${lista.length} contatos`;
    emptyState.style.display = lista.length === 0 ? "flex" : "none";

    lista.forEach((contato) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <div class="card__avatar">
                <img src="${contato.foto || 'https://via.placeholder.com/100'}" alt="${contato.nome}">
            </div>
            <div class="card__body">
                <h3 class="card__nome">${contato.nome}</h3>
                <p class="card__info">📱 ${contato.celular || "N/A"}</p>
                <p class="card__info">✉️ ${contato.email || "N/A"}</p>
                <p class="card__info">📍 ${contato.cidade || "N/A"}</p>
            </div>
            <div class="card__actions">
                <button class="btn btn--edit editar" data-id="${contato.id}">✎</button>
                <button class="btn btn--delete deletar" data-id="${contato.id}">🗑</button>
            </div>
        `;
        cards.appendChild(card);
    });
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const contato = {
        nome: inputNome.value,
        celular: inputCelular.value,
        email: inputEmail.value,
        foto: inputFoto.value,
        endereco: inputEndereco.value,
        cidade: inputCidade.value,
    };
    const id = inputId.value;

    const method = id ? "PUT" : "POST";
    const url = id ? `${BASE_URL}/${id}` : BASE_URL;

    await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contato),
    });

    resetForm();
    getContatos();
});

cards.addEventListener("click", async (e) => {
    const id = e.target.dataset.id;
    if (e.target.classList.contains("editar")) {
        const contato = contatos.find(c => String(c.id) === id);
        inputId.value = contato.id;
        inputNome.value = contato.nome;
        inputCelular.value = contato.celular;
        inputEmail.value = contato.email;
        inputFoto.value = contato.foto;
        inputEndereco.value = contato.endereco;
        inputCidade.value = contato.cidade;
        formTitle.textContent = "Editar Contato";
        btnCancelar.style.display = "inline-block";
    }
    if (e.target.classList.contains("deletar")) {
        if (confirm("Deseja excluir este contato?")) {
            await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
            getContatos();
        }
    }
});

btnCancelar.addEventListener("click", resetForm);

function resetForm() {
    form.reset();
    inputId.value = "";
    formTitle.textContent = "Novo Contato";
    btnCancelar.style.display = "none";
}

searchInput.addEventListener("input", () => {
    const valor = searchInput.value.toLowerCase();
    const filtrados = contatos.filter(c => c.nome.toLowerCase().includes(valor));
    renderContatos(filtrados);
});

getContatos();
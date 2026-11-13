const Interface = (() => {
  const el = {
    form: document.getElementById("form-tarefa"),
    id: document.getElementById("tarefa-id"),
    titulo: document.getElementById("titulo"),
    responsavel: document.getElementById("responsavel"),
    prazo: document.getElementById("prazo"),
    status: document.getElementById("status"),
    btnSalvar: document.getElementById("btn-salvar"),
    btnCancelar: document.getElementById("btn-cancelar"),
    tituloForm: document.getElementById("titulo-form"),
    erroTitulo: document.getElementById("erro-titulo"),
    erroResponsavel: document.getElementById("erro-responsavel"),
    busca: document.getElementById("busca"),
    filtroStatus: document.getElementById("filtro-status"),
    lista: document.getElementById("lista"),
    vazio: document.getElementById("vazio"),
    contador: document.getElementById("contador"),
  };

  function lerFormulario() {
    return {
      id: el.id.value,
      titulo: el.titulo.value.trim(),
      responsavel: el.responsavel.value.trim(),
      prazo: el.prazo.value,
      status: el.status.value,
    };
  }

  function limparErros() {
    el.erroTitulo.textContent = "";
    el.erroResponsavel.textContent = "";
    el.titulo.classList.remove("invalido");
    el.responsavel.classList.remove("invalido");
  }

  function mostrarErros(erros) {
    limparErros();
    if (erros.titulo) {
      el.erroTitulo.textContent = erros.titulo;
      el.titulo.classList.add("invalido");
    }
    if (erros.responsavel) {
      el.erroResponsavel.textContent = erros.responsavel;
      el.responsavel.classList.add("invalido");
    }
  }

  function limparFormulario() {
    el.form.reset();
    el.id.value = "";
    el.tituloForm.textContent = "Nova tarefa";
    el.btnSalvar.textContent = "Adicionar tarefa";
    el.btnCancelar.hidden = true;
    limparErros();
  }

  function preencherFormulario(tarefa) {
    el.id.value = tarefa.id;
    el.titulo.value = tarefa.titulo;
    el.responsavel.value = tarefa.responsavel;
    el.prazo.value = tarefa.prazo;
    el.status.value = tarefa.status;
    el.tituloForm.textContent = "Editar tarefa";
    el.btnSalvar.textContent = "Salvar alterações";
    el.btnCancelar.hidden = false;
    el.titulo.focus();
  }

  function criarBotao(texto, classe, aoClicar, rotuloAcessivel) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = `btn btn-pequeno ${classe}`;
    botao.textContent = texto;
    botao.setAttribute("aria-label", rotuloAcessivel);
    botao.addEventListener("click", aoClicar);
    return botao;
  }

  function criarItem(tarefa, acoes) {
    const atrasada = Regras.estaAtrasada(tarefa);

    const item = document.createElement("li");
    item.className = "item";
    item.dataset.id = tarefa.id;
    if (tarefa.status === "concluida") item.classList.add("concluida");
    if (atrasada) item.classList.add("atrasada");

    const topo = document.createElement("div");
    topo.className = "item-topo";

    const titulo = document.createElement("span");
    titulo.className = "item-titulo";
    titulo.textContent = tarefa.titulo;

    const selo = document.createElement("span");
    selo.className = atrasada ? "selo selo-atrasada" : `selo selo-${tarefa.status}`;
    selo.textContent = atrasada ? "Atrasada" : Regras.ROTULOS_STATUS[tarefa.status];

    topo.append(titulo, selo);

    const info = document.createElement("p");
    info.className = "item-info";
    info.textContent = `Responsável: ${tarefa.responsavel} · Prazo: ${Regras.formatarData(tarefa.prazo)}`;

    const botoes = document.createElement("div");
    botoes.className = "item-acoes";

    const textoConcluir = tarefa.status === "concluida" ? "Reabrir" : "Concluir";
    botoes.append(
      criarBotao(textoConcluir, "btn-sucesso", () => acoes.concluir(tarefa.id), `${textoConcluir} tarefa ${tarefa.titulo}`),
      criarBotao("Editar", "btn-neutro", () => acoes.editar(tarefa.id), `Editar tarefa ${tarefa.titulo}`),
      criarBotao("Excluir", "btn-perigo", () => acoes.excluir(tarefa.id), `Excluir tarefa ${tarefa.titulo}`)
    );

    item.append(topo, info, botoes);
    return item;
  }

  function renderizarLista(tarefas, visiveis, acoes) {
    el.lista.replaceChildren(...visiveis.map((t) => criarItem(t, acoes)));
    el.vazio.hidden = visiveis.length > 0;

    const total = tarefas.length;
    el.contador.textContent =
      visiveis.length === total
        ? `${total} ${total === 1 ? "tarefa" : "tarefas"}`
        : `${visiveis.length} de ${total} tarefas`;
  }

  return {
    el,
    lerFormulario,
    mostrarErros,
    limparFormulario,
    preencherFormulario,
    renderizarLista,
  };
})();
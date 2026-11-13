let tarefas = Armazenamento.carregar();

const acoes = {
  concluir: alternarConclusao,
  editar: iniciarEdicao,
  excluir: excluirTarefa,
};

function atualizar() {
  const visiveis = Regras.filtrar(tarefas, Interface.el.busca.value, Interface.el.filtroStatus.value);
  Interface.renderizarLista(tarefas, visiveis, acoes);
}

function persistir() {
  Armazenamento.salvar(tarefas);
  atualizar();
}

function salvarTarefa(evento) {
  evento.preventDefault();

  const { id, ...dados } = Interface.lerFormulario();
  const erros = Validacao.validar(dados);
  Interface.mostrarErros(erros);
  if (Object.keys(erros).length > 0) return;

  if (id) {
    tarefas = tarefas.map((t) => (t.id === id ? { ...t, ...dados } : t));
  } else {
    tarefas.push({ id: Regras.gerarId(), criadaEm: Date.now(), ...dados });
  }

  Interface.limparFormulario();
  persistir();
}

function iniciarEdicao(id) {
  const tarefa = tarefas.find((t) => t.id === id);
  if (tarefa) Interface.preencherFormulario(tarefa);
}

function excluirTarefa(id) {
  const tarefa = tarefas.find((t) => t.id === id);
  if (!tarefa) return;
  if (!window.confirm(`Excluir a tarefa "${tarefa.titulo}"?`)) return;

  tarefas = tarefas.filter((t) => t.id !== id);
  if (Interface.el.id.value === id) Interface.limparFormulario();
  persistir();
}

function alternarConclusao(id) {
  tarefas = tarefas.map((t) => (t.id === id ? Regras.alternarConclusao(t) : t));
  persistir();
}

Interface.el.form.addEventListener("submit", salvarTarefa);
Interface.el.btnCancelar.addEventListener("click", Interface.limparFormulario);
Interface.el.busca.addEventListener("input", atualizar);
Interface.el.filtroStatus.addEventListener("change", atualizar);

atualizar();
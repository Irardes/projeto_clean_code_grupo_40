const Regras = (() => {
  const ROTULOS_STATUS = {
    pendente: "Pendente",
    andamento: "Em andamento",
    concluida: "Concluída",
  };

  function gerarId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function hojeISO() {
    const agora = new Date();
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const dia = String(agora.getDate()).padStart(2, "0");
    return `${agora.getFullYear()}-${mes}-${dia}`;
  }

  function estaAtrasada(tarefa) {
    return Boolean(tarefa.prazo) && tarefa.status !== "concluida" && tarefa.prazo < hojeISO();
  }

  function formatarData(iso) {
    if (!iso) return "Sem prazo";
    const [ano, mes, dia] = iso.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  function normalizar(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  function filtrar(tarefas, termoBusca, filtroStatus) {
    const termo = normalizar(termoBusca.trim());

    return tarefas.filter((t) => {
      const combinaTexto =
        !termo || normalizar(t.titulo).includes(termo) || normalizar(t.responsavel).includes(termo);

      let combinaStatus = true;
      if (filtroStatus === "atrasada") combinaStatus = estaAtrasada(t);
      else if (filtroStatus !== "todas") combinaStatus = t.status === filtroStatus;

      return combinaTexto && combinaStatus;
    });
  }

  function alternarConclusao(tarefa) {
    return { ...tarefa, status: tarefa.status === "concluida" ? "pendente" : "concluida" };
  }

  return { ROTULOS_STATUS, gerarId, estaAtrasada, formatarData, filtrar, alternarConclusao };
})();
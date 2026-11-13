const Armazenamento = (() => {
  const CHAVE = "gerenciador-tarefas:v1";

  function carregar() {
    try {
      const dados = localStorage.getItem(CHAVE);
      return dados ? JSON.parse(dados) : [];
    } catch (erro) {
      return [];
    }
  }

  function salvar(tarefas) {
    localStorage.setItem(CHAVE, JSON.stringify(tarefas));
  }

  return { carregar, salvar };
})();
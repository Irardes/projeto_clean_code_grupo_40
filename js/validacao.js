const Validacao = (() => {
  function validar(dados) {
    const erros = {};

    if (dados.titulo.length < 3) {
      erros.titulo = "Informe um título com pelo menos 3 caracteres.";
    }

    if (!dados.responsavel) {
      erros.responsavel = "Informe o responsável.";
    }

    return erros;
  }

  return { validar };
})();
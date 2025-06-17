let doencas = [];

fetch('doencas.json')
  .then(res => res.json())
  .then(data => doencas = data)
  .catch(err => console.error("Erro ao carregar dados:", err));

function buscar() {
  const nomeTermo = document.getElementById("nomeInput").value.trim().toLowerCase();
  const cidTermo = document.getElementById("cidInput").value.trim().toUpperCase();
  const div = document.getElementById("resultado");

  if (!nomeTermo && !cidTermo) {
    div.innerHTML = "";
    return;
  }

  const resultado = doencas.find(d => 
    (nomeTermo && d.nome.toLowerCase().includes(nomeTermo)) ||
    (cidTermo && d.cid === cidTermo)
  );

  if (resultado) {
    div.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h3 class="card-title">${resultado.nome}</h3>
          <p><strong>CID:</strong> ${resultado.cid}</p>
          <p><strong>Descrição:</strong> ${resultado.descricao}</p>
          <p><strong>Causas:</strong> ${resultado.causas}</p>
          <p><strong>Sintomas:</strong> ${resultado.sintomas}</p>
          <p><strong>Tratamentos:</strong> ${resultado.tratamentos}</p>
          <p><strong>Prevenção:</strong> ${resultado.prevencao}</p>
        </div>
      </div>
    `;
  } else {
    div.innerHTML = "<p class='text-danger'>Nenhuma doença encontrada.</p>";
  }
}

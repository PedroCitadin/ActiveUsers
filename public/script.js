async function carregar() {
  const res = await fetch("/api/usuarios-ativos");
  const data = await res.json();

  const total = data.totalAtivos;
  const totalEl = document.getElementById("total");
  const card = document.querySelector(".card");

  totalEl.innerText = total;

  // reset classes
  document.body.className = "";
  card.className = "card";

  // lógica de alerta
  if (total <= 10) {
    card.classList.add("ok");
  } 
  else if (total <= 20) {
    card.classList.add("warn");
    document.body.classList.add("warn");
  } 
  else if (total < 30) {
    card.classList.add("alert");
    document.body.classList.add("warn");
  } 
  else {
    card.classList.add("danger");
    document.body.classList.add("danger");
  }

  const tbody = document.getElementById("lista");
  tbody.innerHTML = "";

  data.usuarios.forEach(u => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.DS_LOGIN}</td>
      <td>${u.NM_SUBJECT}</td>
      <td>${u.DT_CREATION}</td>
      <td>${u.DT_EXPIRATION}</td>
    `;
    tbody.appendChild(tr);
  });
}

carregar();
setInterval(carregar, 30000);

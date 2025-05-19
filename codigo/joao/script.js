let medico = {
    "doctorId": "1",
    "profileUrl": "url.com",
    "informacoesPessoais": {
        "Nome": "Emily",
        "urlFotoPerfil": "img/exemplomedica.jpeg",
        "biografia": "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    }
}

function carregaMedico(medico) {
    // Select all cards inside #cardMedico
    const cards = document.querySelectorAll("#cardMedico .card");
    cards.forEach(card => {
        // Update the image
        const img = card.querySelector("img");
        if (img) img.src = medico.informacoesPessoais.urlFotoPerfil;

        // Update the doctor's name
        const title = card.querySelector(".card-title");
        if (title) title.textContent = medico.informacoesPessoais.Nome;

        // Update the doctor's bio
        const text = card.querySelector(".card-text");
        if (text) text.textContent = medico.informacoesPessoais.biografia;
    });
}

document.addEventListener("DOMContentLoaded", function() {
    carregaMedico(medico);
});
/*
let medico = {
    "doctorId": "1",
    "profileUrl": "https://google.com",
    "informacoesPessoais": {
        "Nome": "Emily",
        "urlFotoPerfil": "img/exemplomedica.jpeg",
        "biografia": "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    }
}
*/
/*
async function loadAllData() {
    try 
    {
        const medicoResponse = await fetch('codigo/joao/medico.json');

        if (!medicoResponse.ok) {
            throw new Error(`HTTP error! status: ${medicoResponse.status}`);
        }

        const medico = await medicoResponse.json();

        console.log("medico:", medico);

    } 
    catch (error) 
    {
        console.error("Error loading data:", error);
    }
}
    */

async function loadDoctorsData() {
    const cardMedicoContainer = document.getElementById('cardMedico');

    if (cardMedicoContainer) {
        cardMedicoContainer.innerHTML = '<p>Carregando médicos...</p>';
    }

    try {
        const response = await fetch('medico.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const doctors = data.medicos;

        if (cardMedicoContainer) {
            cardMedicoContainer.innerHTML = '';
        }

        if (doctors && doctors.length > 0) {
            doctors.forEach(doctor => {
                const doctorCard = document.createElement('div');
                doctorCard.className = 'card'; 
                doctorCard.innerHTML = `
                    <a href="${doctor.profileUrl || '#'}" style="display: inline-block; text-decoration: none; border: none;">
                        <img src="${doctor.urlFotoPerfil}" class="card-img-top" alt="Foto de perfil de ${doctor.Nome}">
                    </a>
                    <div class="card-body">
                        <h5 class="card-title">${doctor.Nome}</h5>
                        <p class="card-text">${doctor.biografia}</p>
                    </div>
                `;

                if (cardMedicoContainer) {
                    cardMedicoContainer.appendChild(doctorCard);
                }
            });
        } else {
            if (cardMedicoContainer) {
                cardMedicoContainer.innerHTML = '<p>Nenhum médico encontrado no momento.</p>';
            }
        }

    } catch (error) {
        console.error("Erro ao carregar dados dos médicos:", error);

        if (cardMedicoContainer) {
            cardMedicoContainer.innerHTML = '<p style="color: red;">Não foi possível carregar os médicos. Tente novamente mais tarde.</p>';
        }
    }
}

document.addEventListener('DOMContentLoaded', loadDoctorsData);

/*
function carregaMedico(medico) {
    // Select all cards inside #cardMedico
    const cards = document.querySelectorAll("#cardMedico .card");
    cards.forEach(card => {
        // Update the image
        const img = card.querySelector("img");
        if (img) img.src = medico.informacoesPessoais.urlFotoPerfil;

        const link = card.querySelector("a");
        if (link) link.href = medico.profileUrl;

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
*/
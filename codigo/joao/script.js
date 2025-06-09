let allSpecialties = []; 

async function displaySpecialtyDetails(specialtyId) 
{
    const sidebarArea = document.querySelector('.sidebar-area');
    if (!sidebarArea) 
    {
        console.error("Sidebar area not found in the DOM.");
        return;
    }

    const chosenSpecialty = allSpecialties.find(s => s.id === specialtyId);

    if (chosenSpecialty) 
    {
        const specialtyTitleElem = sidebarArea.querySelector('.card-title-esp');
        const specialtyImgElem = sidebarArea.querySelector('.card-img-esp');
        const specialtyImgLink = specialtyImgElem ? specialtyImgElem.closest('a') : null;
        const reasonsListElem = sidebarArea.querySelector('.card-body ul');
        const specialtyDescElem = sidebarArea.querySelector('.card-body p.card-text');

        if (specialtyTitleElem) 
        {
            specialtyTitleElem.textContent = chosenSpecialty.nome;
        }
        if (specialtyImgElem) {
            specialtyImgElem.src = chosenSpecialty.iconeUrl || 'img/placeholder.jpeg';
            specialtyImgElem.alt = `Ícone de ${chosenSpecialty.nome}`;
        }
        if (specialtyImgLink) 
        {
            specialtyImgLink.href = chosenSpecialty.linkDetalhes || '#';
        }
        if (specialtyDescElem) 
        {
            specialtyDescElem.textContent = chosenSpecialty.descricao;
        }

        const doencasListElem = sidebarArea.querySelector('.doencas-list');
        if (doencasListElem) {
            doencasListElem.innerHTML = '';
            const title = document.createElement('strong');
            title.textContent = 'Condições tratadas pela especialidade';
            doencasListElem.appendChild(title);
            doencasListElem.appendChild(document.createElement('br'));
            chosenSpecialty.doencas_principais.forEach(reason => {
                const li = document.createElement('li');
                li.textContent = reason;
                doencasListElem.appendChild(li);
            });
        }

        const sintomasListElem = sidebarArea.querySelector('.sintomas-list');
        if (sintomasListElem) {
            sintomasListElem.innerHTML = '';
            const title = document.createElement('strong');
            title.textContent = 'Sintomas principais';
            sintomasListElem.appendChild(title);
            sintomasListElem.appendChild(document.createElement('br'));

            let sintomas = chosenSpecialty.sintomas_chave;
            if (!Array.isArray(sintomas)) {
                sintomas = sintomas ? [sintomas] : [];
            }
            sintomas.forEach(sintoma => {
                const li = document.createElement('li');
                li.textContent = sintoma;
                sintomasListElem.appendChild(li);
            });
        }
    } else 
    {
        sidebarArea.querySelector('.card-title-esp').textContent = 'Especialidade Não Encontrada';
        sidebarArea.querySelector('.card-img-esp').src = 'img/placeholder.jpeg';
        sidebarArea.querySelector('.card-img-esp').alt = 'Especialidade não encontrada';
        sidebarArea.querySelector('.card-body p.card-text').textContent = 'Selecione uma especialidade válida.';
        sidebarArea.querySelector('.card-body ul').innerHTML = '<li>Nenhuma informação disponível.</li>';
        console.warn(`Specialty with ID "${specialtyId}" not found.`);
    }
}

async function loadDoctorsForSpecialty(specialtyId) 
{
    const cardMedicoContainer = document.getElementById('cardMedico');
    if (!cardMedicoContainer) 
    {
        console.error("Container #cardMedico not found in the DOM.");
        return;
    }

    cardMedicoContainer.innerHTML = '<p>Carregando médicos para esta especialidade...</p>';

    try 
    {
        const response = await fetch('medico.json');
        if (!response.ok) 
        {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        let doctors = data.medicos;

        const filteredDoctors = doctors.filter(doctor => doctor.specialtyId === specialtyId);

        cardMedicoContainer.innerHTML = ''; 

        if (filteredDoctors && filteredDoctors.length > 0) 
        {
            filteredDoctors.forEach(doctor => {
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
                cardMedicoContainer.appendChild(doctorCard);
            });
        } else 
    {
            cardMedicoContainer.innerHTML = '<p>Nenhum médico encontrado para esta especialidade no momento.</p>';
        }

    } 
    catch (error) 
    {
        console.error("Erro ao carregar dados dos médicos:", error);
        cardMedicoContainer.innerHTML = '<p style="color: red;">Não foi possível carregar os médicos. Tente novamente mais tarde.</p>';
    }
}

async function setupSpecialtyDropdown() 
{
    const specialtySelect = document.getElementById('specialtySelect');
    if (!specialtySelect) 
    {
        console.error("Dropdown element #specialtySelect not found.");
        return;
    }

    try 
    {
        const response = await fetch('medico.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        allSpecialties = data.especialidades;

        specialtySelect.innerHTML = '';

        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "Selecione uma especialidade...";
        defaultOption.selected = true; 
        defaultOption.disabled = true; 
        specialtySelect.appendChild(defaultOption);

        allSpecialties.forEach(specialty => 
        {
            const option = document.createElement('option');
            option.value = specialty.id;
            option.textContent = specialty.nome;
            specialtySelect.appendChild(option);
        });

        specialtySelect.addEventListener('change', (event) => {
            const selectedSpecialtyId = event.target.value;
            if (selectedSpecialtyId) 
            {
                displaySpecialtyDetails(selectedSpecialtyId);
                loadDoctorsForSpecialty(selectedSpecialtyId);
            }
        });

        if (allSpecialties.length > 0) 
        {
             specialtySelect.value = allSpecialties[0].id;
             displaySpecialtyDetails(allSpecialties[0].id);
             loadDoctorsForSpecialty(allSpecialties[0].id);
        } else 
        {
             specialtySelect.innerHTML = '<option value="">Nenhuma especialidade disponível</option>';
             specialtySelect.disabled = true;
             document.querySelector('.sidebar-area').innerHTML = '<p style="color: red;">Não foi possível carregar as especialidades.</p>';
             document.getElementById('cardMedico').innerHTML = '<p style="color: red;">Não foi possível carregar os médicos.</p>';
        }


    } catch (error) 
    {
        console.error("Erro ao configurar o dropdown de especialidades:", error);
        specialtySelect.innerHTML = '<option value="">Erro ao carregar especialidades</option>';
        specialtySelect.disabled = true;
        document.querySelector('.sidebar-area').innerHTML = '<p style="color: red;">Erro ao carregar especialidades.</p>';
        document.getElementById('cardMedico').innerHTML = '<p style="color: red;">Erro ao carregar médicos.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => 
{
    setupSpecialtyDropdown();
});

document.addEventListener('DOMContentLoaded', loadDoctorsData);
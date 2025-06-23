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
        if (doencasListElem) 
        {
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
        if (sintomasListElem) 
            {
            sintomasListElem.innerHTML = '';
            const title = document.createElement('strong');
            title.textContent = 'Sintomas principais';
            sintomasListElem.appendChild(title);
            sintomasListElem.appendChild(document.createElement('br'));

            let sintomas = chosenSpecialty.sintomas_chave;
            if (!Array.isArray(sintomas)) 
            {
                sintomas = sintomas ? [sintomas] : [];
            }
            sintomas.forEach(sintoma => 
            {
                const li = document.createElement('li');
                li.textContent = sintoma;
                sintomasListElem.appendChild(li);
            });
        }
    } 
    else 
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
            filteredDoctors.forEach(doctor => 
                {
                const doctorCard = document.createElement('div');
                doctorCard.className = 'card position-relative';

                doctorCard.innerHTML = `
                    <div style="position: absolute; top: 10px; right: 10px; z-index: 2;">
                        <div class="dropdown">
                            <button class="btn btn-link text-dark p-0" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="font-size: 1.5rem;">
                                &#8942;
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item edit-doctor" href="#" data-id="${doctor.doctorId}">Editar</a></li>
                                <li><a class="dropdown-item delete-doctor" href="#" data-id="${doctor.doctorId}">Deletar</a></li>
                            </ul>
                        </div>
                    </div>
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

            // Event listeners for edit and delete
            cardMedicoContainer.querySelectorAll('.delete-doctor').forEach(btn => 
                {
                btn.addEventListener('click', function(e) 
                {
                    e.preventDefault();
                    const doctorId = this.getAttribute('data-id');
                    if (confirm('Tem certeza que deseja deletar este médico?')) 
                    {
                        deleteDoctorById(doctorId);
                    }
                });
            });

            cardMedicoContainer.querySelectorAll('.edit-doctor').forEach(btn => 
            {
                btn.addEventListener('click', function(e) 
                {
                    e.preventDefault();
                    const doctorId = this.getAttribute('data-id');
                    editDoctorById(doctorId);
                });
            });

        } 
        else 
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

async function deleteDoctorById(doctorId) 
{
    /* terminar função */
}

function editDoctorById(doctorId) 
{
    /* terminar função */
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
        if (!response.ok) 
        {
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

        specialtySelect.addEventListener('change', (event) => 
        {
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
        } 
        else 
        {
             specialtySelect.innerHTML = '<option value="">Nenhuma especialidade disponível</option>';
             specialtySelect.disabled = true;
             document.querySelector('.sidebar-area').innerHTML = '<p style="color: red;">Não foi possível carregar as especialidades.</p>';
             document.getElementById('cardMedico').innerHTML = '<p style="color: red;">Não foi possível carregar os médicos.</p>';
        }


    } 
    catch (error) 
    {
        console.error("Erro ao configurar o dropdown de especialidades:", error);
        specialtySelect.innerHTML = '<option value="">Erro ao carregar especialidades</option>';
        specialtySelect.disabled = true;
        document.querySelector('.sidebar-area').innerHTML = '<p style="color: red;">Erro ao carregar especialidades.</p>';
        document.getElementById('cardMedico').innerHTML = '<p style="color: red;">Erro ao carregar médicos.</p>';
    }
}

function setupPhotoUrlValidation() 
{
    const photoInput = document.getElementById('photo');
    if (!photoInput) return;

    let urlWarning = photoInput.parentNode.querySelector('.photo-url-warning');
    if (!urlWarning) 
    {
        urlWarning = document.createElement('div');
        urlWarning.className = 'text-danger mt-1 photo-url-warning';
        urlWarning.style.display = 'none';
        photoInput.parentNode.appendChild(urlWarning);
    }

    let formatWarning = photoInput.parentNode.querySelector('.photo-format-warning');
    if (!formatWarning) 
    {
        formatWarning = document.createElement('div');
        formatWarning.className = 'text-danger mt-1 photo-format-warning';
        formatWarning.style.display = 'none';
        photoInput.parentNode.appendChild(formatWarning);
    }

    function isValidUrl(url) 
    {
        try 
        {
            new URL(url);
            return /^https?:\/\//i.test(url);
        } 
        catch 
        {
            return false;
        }
    }

    function isAcceptedFormat(url) 
    {
        return /\.(jpg|jpeg|gif|webp)$/i.test(url);
    }

    photoInput.addEventListener('input', function () 
    {
        const url = photoInput.value.trim();
        urlWarning.style.display = 'none';
        formatWarning.style.display = 'none';

        if (!url) return;

        if (!isValidUrl(url)) 
        {
            urlWarning.textContent = 'URL inválida.';
            urlWarning.style.display = 'block';
        } 
        else if (!isAcceptedFormat(url)) 
        {
            formatWarning.textContent = 'Formato não aceito. Apenas imagens JPG, GIF ou WEBP são permitidas.';
            formatWarning.style.display = 'block';
        }
    });
}

function setupBiographyValidation() 
{
    const bioInput = document.getElementById('biografiaid');
    if (!bioInput) return;

    let warningDiv = bioInput.parentNode.querySelector('.bio-warning');
    if (!warningDiv) 
    {
        warningDiv = document.createElement('div');
        warningDiv.className = 'text-danger mt-1 bio-warning';
        warningDiv.style.display = 'none';
        bioInput.parentNode.appendChild(warningDiv);
    }

    bioInput.addEventListener('input', function () 
    {
        const bioLength = bioInput.value.trim().length;
        if (bioLength < 150) 
        {
            warningDiv.textContent = `A biografia deve ter pelo menos 150 caracteres. (atual: ${bioLength})`;
            warningDiv.style.display = 'block';
        } 
        else 
        {
            warningDiv.style.display = 'none';
        }
    });
}

function setupNameValidation() 
{
    const nameInput = document.getElementById('nameid');
    if (!nameInput) return;

    let warningDiv = nameInput.parentNode.querySelector('.name-warning');
    if (!warningDiv) 
    {
        warningDiv = document.createElement('div');
        warningDiv.className = 'text-danger mt-1 name-warning';
        warningDiv.style.display = 'none';
        nameInput.parentNode.appendChild(warningDiv);
    }

    nameInput.addEventListener('input', function () 
    {
        if (nameInput.value.trim().length < 3) 
        {
            warningDiv.textContent = 'Nome inválido';
            warningDiv.style.display = 'block';
        } 
        else 
        {
            warningDiv.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => 
{
    setupSpecialtyDropdown();
    setupPhotoUrlValidation();
    setupBiographyValidation();
    setupNameValidation();
});

document.addEventListener('DOMContentLoaded', loadDoctorsData);

document.querySelector('form').addEventListener('submit', async function(event) 
{
    event.preventDefault();

    let response = await fetch('medico.json');
    let data = await response.json();

    const nome = document.getElementById('nameid').value.trim();
    const biografia = document.getElementById('biografiaid').value.trim();
    const specialtyId = document.getElementById('specialtySelect').value;
    const urlFotoPerfil = document.getElementById('photo').value.trim();

    function generateUniqueDoctorId(existingIds) 
    {
        let id;
        do 
        {
            id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        } 
        while (existingIds.has(id));
        return id;
    }

    const existingIds = new Set(data.medicos.map(m => m.doctorId));
    const newDoctorId = generateUniqueDoctorId(existingIds);

    const newDoctor = 
    {
        doctorId: newDoctorId,
        profileUrl: "#",
        Nome: nome,
        urlFotoPerfil: urlFotoPerfil,
        biografia: biografia,
        specialtyId: specialtyId
    };

    data.medicos.push(newDoctor);

    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], {type: "application/json"});
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = "medico.json";
    a.click();
    URL.revokeObjectURL(url);

    alert('Médico adicionado! O arquivo atualizado foi baixado. Substitua o medico.json no servidor para atualizar.');
});
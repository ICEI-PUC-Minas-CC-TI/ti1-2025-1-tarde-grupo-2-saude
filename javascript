/**
 * Sistema de Recomendação Médica Personalizada
 * 
 * Funcionalidades:
 * - Exibe dados do usuário
 * - Mostra lista de sintomas
 * - Apresenta recomendações médicas personalizadas
 */

// Elementos do DOM
const elements = {
    userData: document.getElementById('user-data'),
    symptomsList: document.getElementById('symptoms-list'),
    recommendationsList: document.getElementById('recommendations-list')
};

// Função para carregar dados do JSON
async function loadData() {
    try {
        const response = await fetch('scripts/data.json');
        if (!response.ok) {
            throw new Error('Erro ao carregar dados');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        showError();
        return null;
    }
}

// Função para exibir dados do usuário
function displayUserData(user) {
    const location = user.localizacao;
    
    elements.userData.innerHTML = `
        <div class="profile-item">
            <svg class="profile-icon" aria-hidden="true">
                <use href="assets/icons/user-icon.svg#user"></use>
            </svg>
            <span class="profile-label">Idade:</span>
            <span class="profile-value">${user.idade} anos</span>
        </div>
        <div class="profile-item">
            <svg class="profile-icon" aria-hidden="true">
                <use href="assets/icons/user-icon.svg#user"></use>
            </svg>
            <span class="profile-label">Gênero:</span>
            <span class="profile-value">${formatGender(user.genero)}</span>
        </div>
        <div class="profile-item">
            <svg class="profile-icon" aria-hidden="true">
                <use href="assets/icons/location-icon.svg#location"></use>
            </svg>
            <span class="profile-label">Localização:</span>
            <span class="profile-value">${location.cidade}, ${location.estado}</span>
        </div>
    `;
}

// Função para formatar gênero
function formatGender(gender) {
    const genders = {
        'feminino': 'Feminino',
        'masculino': 'Masculino',
        'outro': 'Outro'
    };
    return genders[gender] || gender;
}

// Função para exibir sintomas
function displaySymptoms(symptoms) {
    if (!symptoms || symptoms.length === 0) {
        elements.symptomsList.innerHTML = '<p>Nenhum sintoma registrado.</p>';
        return;
    }

    const symptomsHTML = symptoms.map(symptom => `
        <span class="symptom-tag">${symptom}</span>
    `).join('');

    elements.symptomsList.innerHTML = symptomsHTML;
}

// Função para exibir recomendações
function displayRecommendations(recommendations) {
    if (!recommendations || recomendations.length === 0) {
        elements.recommendationsList.innerHTML = `
            <div class="recommendation-card">
                <p>Nenhuma recomendação disponível no momento.</p>
            </div>
        `;
        return;
    }

    const recommendationsHTML = recomendations.map(rec => `
        <div class="recommendation-card">
            <h3 class="recommendation-specialty">${rec.especialidade}</h3>
            <span class="recommendation-platform">${rec.plataforma}</span>
            <p class="recommendation-reason">${rec.motivo}</p>
            <a href="${rec.link_confiavel}" target="_blank" rel="noopener noreferrer" class="recommendation-link">
                <svg class="link-icon" aria-hidden="true">
                    <use href="assets/icons/external-link.svg#external-link"></use>
                </svg>
                Acessar ${rec.plataforma}
            </a>
            <span class="link-type">Tipo: ${formatLinkType(rec.tipo_link)}</span>
        </div>
    `).join('');

    elements.recommendationsList.innerHTML = recommendationsHTML;
}

// Função para formatar tipo de link
function formatLinkType(type) {
    const types = {
        'busca': 'Busca por especialista',
        'agendamento direto': 'Agendamento direto',
        'informativo': 'Conteúdo informativo'
    };
    return types[type] || type;
}

// Função para exibir erro
function showError() {
    elements.userData.innerHTML = '<p>Erro ao carregar dados do usuário.</p>';
    elements.symptomsList.innerHTML = '<p>Erro ao carregar sintomas.</p>';
    elements.recommendationsList.innerHTML = '<p>Erro ao carregar recomendações.</p>';
}

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    const data = await loadData();
    
    if (data) {
        displayUserData(data.usuario);
        displaySymptoms(data.sintomas);
        displayRecommendations(data.recomendacoes);
    }
});
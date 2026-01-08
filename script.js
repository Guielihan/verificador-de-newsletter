const emailInput = document.getElementById('emailInput');
const submitBtn = document.getElementById('submitBtn');
const helpText = document.getElementById('helpText');
const statusBadge = document.getElementById('statusBadge');
const successMessage = document.getElementById('successMessage');
const form = document.getElementById('newsletterForm');

// validar formato comum de e-mail
// deve aceitar: nome@dominio.com, nome.sobrenome@dominio.com.br, e etc
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// mensagens dinamicas
const MESSAGES = {
    neutral: {
        text: 'Digite seu e-mail para entrar na lista.',
        badgeText: 'AGUARDANDO',
        badgeClass: 'neutral'
    },
    invalid: {
        text: 'Esse e-mail parece incompleto. Ajusta aí.',
        badgeText: 'INVÁLIDO',
        badgeClass: 'invalid'
    },
    valid: {
        text: 'Perfeito! Esse e-mail está pronto.',
        badgeText: 'VÁLIDO',
        badgeClass: 'valid'
    }
};

// situacao do input
let currentState = 'neutral';

/**
 * @param {string} email - validado
 * @returns {boolean} - true se valido, false se invalido
 */
function isValidEmail(email) {
    // remove espaços em branco no início e fim
    const trimmedEmail = email.trim();
    // Verifica se não está vazio e se passa no regex
    return trimmedEmail.length > 0 && EMAIL_REGEX.test(trimmedEmail);
}

/**
 * atualiza a interface com base no estado fornecido
 * @param {string} state - 'neutral', 'invalid', ou 'valid'
 */
function updateUI(state) {
    currentState = state;
    const message = MESSAGES[state];
    
    // atualiza input 
    emailInput.classList.remove('is-valid', 'is-invalid');
    
    if (state === 'valid') {
        emailInput.classList.add('is-valid');
    } else if (state === 'invalid') {
        emailInput.classList.add('is-invalid');
    }
    
    // atualiza texto de ajuda
    helpText.textContent = message.text;
    helpText.classList.remove('error', 'success');
    
    if (state === 'valid') {
        helpText.classList.add('success');
    } else if (state === 'invalid') {
        helpText.classList.add('error');
    }
    
    // atualiza status badge
    statusBadge.textContent = message.badgeText;
    statusBadge.classList.remove('neutral', 'valid', 'invalid');
    statusBadge.classList.add(message.badgeClass);
    
    // atualiza botão
    // botão só fica habilitado se o e-mail for valido
    submitBtn.disabled = state !== 'valid';
}

emailInput.addEventListener('input', function(e) {
    const emailValue = e.target.value;
    
    // se o campo estiver vazio, volta pro estado neutro
    if (emailValue.trim() === '') {
        updateUI('neutral');
        return;
    }
    
    // valida o email e atualiza a UI
    if (isValidEmail(emailValue)) {
        updateUI('valid');
    } else {
        updateUI('invalid');
    }
});

/**
 * simula o envio do formulario com loading
 * @returns {Promise} 
 */
function simulateSubmit() {
    return new Promise((resolve) => {
        const loadingTime = 900 + Math.random() * 300;
        setTimeout(resolve, loadingTime);
    });
}

function showSuccessMessage() {
    successMessage.classList.add('show');
    
    // remove a mensagem apos 4seg
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 4000);
}

// limpa o campo de email e reseta o estado
function resetForm() {
    emailInput.value = '';
    updateUI('neutral');
}

form.addEventListener('submit', async function(e) {
    // previne o comportamento padrão do formulário
    e.preventDefault();
    
    // se o e-mail não for válido, não faz nada
    if (currentState !== 'valid') {
        return;
    }

    // adiciona classe de loading no botão
    submitBtn.classList.add('loading');
    
    // desabilita o botão
    submitBtn.disabled = true;
    
    // muda o texto do botão
    const btnText = submitBtn.querySelector('.btn-text');
    const originalText = btnText.textContent;
    btnText.textContent = 'Enviando...';
    
    try {
        // aguarda o envio ser concluido
        await simulateSubmit();
        
        // remove classe de loading
        submitBtn.classList.remove('loading');
        
        // restaura o texto original do botão
        btnText.textContent = originalText;
        
        // mostra mensagem de sucesso
        showSuccessMessage();
        
        // aguarda 1 segundo e limpa o formulario
        setTimeout(() => {
            resetForm();
        }, 1000);
        
    } catch (error) {
        // em caso de erro, restaura o botão
        submitBtn.classList.remove('loading');
        btnText.textContent = originalText;
        submitBtn.disabled = false;
        
        console.error('Erro ao enviar:', error);
    }
});

// melhora o comportamento do foco p teclado
emailInput.addEventListener('focus', function() {
    this.setAttribute('data-focus-visible', 'true');
});

emailInput.addEventListener('blur', function() {
    this.removeAttribute('data-focus-visible');
});

// garante que o estado inicial esteja correto quando carregar a página
document.addEventListener('DOMContentLoaded', function() {
    updateUI('neutral');
    console.log('Newsletter Validator carregado com sucesso!');
});
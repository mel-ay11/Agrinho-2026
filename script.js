/**
 * AGRINHO 2026 - Script principal
 * Funcionalidades: Validação de formulário, navegação suave e modo escuro
 */

document.addEventListener("DOMContentLoaded", () => {
    inicializarFormulario();
    inicializarNavegacaoSuave();
    inicializarModoEscuro();
});

// ============================================
// 1. VALIDAÇÃO DO FORMULÁRIO DE CONTATO
// ============================================
function inicializarFormulario() {
    const form = document.querySelector("#form-contato");
    if (!form) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const nome = document.querySelector("#nome");
        const email = document.querySelector("#email");
        const mensagem = document.querySelector("#mensagem");

        // Validações
        if (validarCampos(nome, email, mensagem)) {
            enviarMensagem(nome.value);
            form.reset();
            limparErros();
        }
    });

    // Validação em tempo real ao sair do campo (blur)
    [document.querySelector("#nome"), document.querySelector("#email"), document.querySelector("#mensagem")]
        .forEach(campo => {
            if (campo) {
                campo.addEventListener("blur", () => validarCampo(campo));
            }
        });
}

/**
 * Valida se todos os campos estão preenchidos corretamente
 */
function validarCampos(nome, email, mensagem) {
    let valido = true;

    if (!nome.value.trim()) {
        mostrarErro(nome, "O nome é obrigatório.");
        valido = false;
    }

    if (!email.value.trim()) {
        mostrarErro(email, "O e-mail é obrigatório.");
        valido = false;
    } else if (!validarEmail(email.value)) {
        mostrarErro(email, "Digite um e-mail válido.");
        valido = false;
    }

    if (!mensagem || !mensagem.value.trim()) {
        if (mensagem) {
            mostrarErro(mensagem, "A mensagem é obrigatória.");
            valido = false;
        }
    }

    if (!valido) {
        alert("⚠️ Por favor, corrija os erros destacados.");
    }

    return valido;
}

/**
 * Valida o formato do e-mail com regex
 */
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Mostra mensagem de erro abaixo do campo
 */
function mostrarErro(campo, mensagem) {
    limparErro(campo);
    campo.classList.add("erro");
    const span = document.createElement("span");
    span.classList.add("mensagem-erro");
    span.textContent = mensagem;
    campo.parentNode.insertBefore(span, campo.nextSibling);
}

/**
 * Remove erro de um campo específico
 */
function limparErro(campo) {
    campo.classList.remove("erro");
    const erro = campo.parentNode.querySelector(".mensagem-erro");
    if (erro) erro.remove();
}

/**
 * Remove todos os erros do formulário
 */
function limparErros() {
    document.querySelectorAll(".mensagem-erro").forEach(el => el.remove());
    document.querySelectorAll(".erro").forEach(el => el.classList.remove("erro"));
}

/**
 * Valida um único campo (usado no blur)
 */
function validarCampo(campo) {
    if (campo.id === "email" && campo.value.trim()) {
        if (!validarEmail(campo.value)) {
            mostrarErro(campo, "E-mail inválido.");
        } else {
            limparErro(campo);
        }
    } else if (campo.value.trim() === "") {
        mostrarErro(campo, "Campo obrigatório.");
    } else {
        limparErro(campo);
    }
}

/**
 * Exibe mensagem de sucesso
 */
function enviarMensagem(nome) {
    alert(`✅ Obrigado pela mensagem, ${nome}! Em breve retornaremos.`);
}

// ============================================
// 2. NAVEGAÇÃO SUAVE (SMOOTH SCROLL)
// ============================================
function inicializarNavegacaoSuave() {
    const linksMenu = document.querySelectorAll("nav a");
    
    linksMenu.forEach(link => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");
            
            // Só aplica scroll suave se for âncora interna (começa com #)
            if (!href || !href.startsWith("#")) return;
            
            event.preventDefault();
            const elementoAlvo = document.querySelector(href);
            
            if (elementoAlvo) {
                elementoAlvo.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
                
                // Atualiza a URL sem recarregar
                history.pushState(null, null, href);
            }
        });
    });
}

// ============================================
// 3. MODO ESCURO (DARK MODE)
// ============================================
function inicializarModoEscuro() {
    const botaoTema = document.querySelector("#alternar-tema");
    if (!botaoTema) return;

    // Carrega preferência salva no localStorage
    const temaSalvo = localStorage.getItem("tema-agrinho");
    if (temaSalvo === "dark") {
        ativarModoEscuro(botaoTema);
    }

    botaoTema.addEventListener("click", () => {
        const estaEscuro = document.body.classList.toggle("dark-mode");
        
        if (estaEscuro) {
            ativarModoEscuro(botaoTema);
            localStorage.setItem("tema-agrinho", "dark");
        } else {
            desativarModoEscuro(botaoTema);
            localStorage.setItem("tema-agrinho", "light");
        }
    });
}

function ativarModoEscuro(botao) {
    document.body.classList.add("dark-mode");
    botao.textContent = "☀️ Modo Claro";
    botao.setAttribute("aria-pressed", "true");
}

function desativarModoEscuro(botao) {
    document.body.classList.remove("dark-mode");
    botao.textContent = "🌙 Modo Escuro";
    botao.setAttribute("aria-pressed", "false");
}

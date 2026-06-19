// script.js - Projeto Agrinho 2026

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Validação simples de formulário (ex: Formulário de Inscrição/Contato)
    const form = document.querySelector("#form-contato");
    
    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault(); // Evita o recarregamento da página
            
            const nomeInput = document.querySelector("#nome");
            const emailInput = document.querySelector("#email");
            const mensagemInput = document.querySelector("#mensagem");
            
            if (nomeInput.value.trim() === "" || emailInput.value.trim() === "") {
                alert("Por favor, preencha todos os campos obrigatórios!");
            } else {
                alert(`Obrigado pela mensagem, ${nomeInput.value}! Em breve retornaremos.`);
                form.reset(); // Limpa o formulário após envio
            }
        });
    }

    // 2. Animação de rolagem suave (Smooth Scroll para o menu de navegação)
    const linksMenu = document.querySelectorAll("nav a");
    
    linksMenu.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const alvoId = link.getAttribute("href");
            const elementoAlvo = document.querySelector(alvoId);
            
            if (elementoAlvo) {
                elementoAlvo.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    // 3. Funcionalidade de Modo Escuro / Claro (Tema Dinâmico)
    const botaoTema = document.querySelector("#alternar-tema");
    
    if (botaoTema) {
        botaoTema.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            
            if (document.body.classList.contains("dark-mode")) {
                botaoTema.textContent = "☀️ Modo Claro";
            } else {
                botaoTema.textContent = "🌙 Modo Escuro";
            }
        });
    }
});

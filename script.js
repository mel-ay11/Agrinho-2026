/**
 * AGRINHO 2026 - Script Principal (Versão Avançada)
 * 
 * Funcionalidades:
 * ✅ Validação de formulário com debounce
 * ✅ Notificações toast (substitui alertas)
 * ✅ Navegação suave com scroll spy
 * ✅ Modo escuro com detecção automática do sistema
 * ✅ Animações on scroll (Intersection Observer)
 * ✅ Botão "voltar ao topo"
 * ✅ Loading state no envio do formulário
 * ✅ Acessibilidade aprimorada
 */

const AgrinhoApp = (() => {
    'use strict';

    // ============================================
    // CONFIGURAÇÕES
    // ============================================
    const CONFIG = {
        temaStorageKey: 'tema-agrinho',
        scrollOffset: 100,
        debounceDelay: 300,
        notificacaoDuracao: 3500,
        animacaoThreshold: 0.15
    };

    // ============================================
    // UTILITÁRIOS
    // ============================================
    const Utils = {
        debounce(func, wait) {
            let timeout;
            return function (...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        },

        validarEmail(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        }
    };

    // ============================================
    // SISTEMA DE NOTIFICAÇÕES (TOAST)
    // ============================================
    const Notificacao = {
        container: null,

        init() {
            this.container = document.createElement('div');
            this.container.className = 'notificacoes-container';
            document.body.appendChild(this.container);
        },

        mostrar(mensagem, tipo = 'info') {
            const toast = document.createElement('div');
            toast.className = `toast toast-${tipo}`;
            toast.setAttribute('role', 'alert');
            toast.setAttribute('aria-live', 'polite');

            const icones = {
                sucesso: '✅',
                erro: '⚠️',
                info: 'ℹ️',
                aviso: '⚡'
            };

            toast.innerHTML = `
                <span class="toast-icone">${icones[tipo] || '💬'}</span>
                <span class="toast-mensagem">${mensagem}</span>
                <button class="toast-fechar" aria-label="Fechar notificação">&times;</button>
            `;

            const btnFechar = toast.querySelector('.toast-fechar');
            btnFechar.addEventListener('click', () => this.fechar(toast));

            this.container.appendChild(toast);

            // Animação de entrada
            requestAnimationFrame(() => toast.classList.add('toast-visivel'));

            // Fecha automaticamente
            setTimeout(() => this.fechar(toast), CONFIG.notificacaoDuracao);
        },

        fechar(toast) {
            toast.classList.remove('toast-visivel');
            toast.classList.add('toast-fechando');
            setTimeout(() => toast.remove(), 300);
        }
    };

    // ============================================
    // FORMULÁRIO DE CONTATO
    // ============================================
    const Formulario = {
        form: null,

        init() {
            this.form = document.querySelector('#form-contato');
            if (!this.form) return;

            this.form.addEventListener('submit', (e) => this.handleSubmit(e));

            // Validação em tempo real com debounce
            const campos = ['#nome', '#email', '#mensagem'];
            campos.forEach(seletor => {
                const campo = document.querySelector(seletor);
                if (campo) {
                    const validar = Utils.debounce(() => this.validarCampo(campo), CONFIG.debounceDelay);
                    campo.addEventListener('input', validar);
                    campo.addEventListener('blur', () => this.validarCampo(campo));
                }
            });
        },

        async handleSubmit(event) {
            event.preventDefault();

            const nome = document.querySelector('#nome');
            const email = document.querySelector('#email');
            const mensagem = document.querySelector('#mensagem');

            if (!this.validarTodosCampos(nome, email, mensagem)) {
                Notificacao.mostrar('Corrija os campos destacados para continuar.', 'erro');
                return;
            }

            // Simula envio (você pode integrar com Formspree/EmailJS)
            this.setLoading(true);

            await this.simularEnvio();

            Notificacao.mostrar(`Obrigado ${nome.value.split(' ')[0]}! Sua mensagem foi enviada. 🌱`, 'sucesso');
            this.form.reset();
            this.limparErros();
            this.setLoading(false);
        },

        validarCampo(campo) {
            this.limparErroCampo(campo);

            if (campo.id === 'email' && campo.value.trim()) {
                if (!Utils.validarEmail(campo.value)) {
                    this.mostrarErroCampo(campo, 'Digite um e-mail válido (ex: nome@exemplo.com)');
                    return false;
                }
            }

            if (campo.id === 'nome' && campo.value.trim().length < 2) {
                this.mostrarErroCampo(campo, 'Nome deve ter pelo menos 2 caracteres.');
                return false;
            }

            if (campo.id === 'mensagem' && campo.value.trim().length < 10) {
                this.mostrarErroCampo(campo, 'A mensagem deve ter pelo menos 10 caracteres.');
                return false;
            }

            if (!campo.value.trim()) {
                this.mostrarErroCampo(campo, 'Campo obrigatório.');
                return false;
            }

            return true;
        },

        validarTodosCampos(nome, email, mensagem) {
            const validacoes = [
                this.validarCampo(nome),
                this.validarCampo(email),
                this.validarCampo(mensagem)
            ];
            return validacoes.every(v => v);
        },

        mostrarErroCampo(campo, mensagem) {
            campo.classList.add('campo-erro');
            const span = document.createElement('span');
            span.className = 'mensagem-erro';
            span.textContent = mensagem;
            campo.parentNode.insertBefore(span, campo.nextSibling);
        },

        limparErroCampo(campo) {
            campo.classList.remove('campo-erro');
            const erro = campo.parentNode.querySelector('.mensagem-erro');
            if (erro) erro.remove();
        },

        limparErros() {
            document.querySelectorAll('.mensagem-erro').forEach(el => el.remove());
            document.querySelectorAll('.campo-erro').forEach(el => el.classList.remove('campo-erro'));
        },

        setLoading(estado) {
            const btn = this.form.querySelector('button[type="submit"]');
            if (!btn) return;

            if (estado) {
                btn.disabled = true;
                btn.dataset.textoOriginal = btn.textContent;
                btn.innerHTML = '<span class="spinner"></span> Enviando...';
            } else {
                btn.disabled = false;
                btn.textContent = btn.dataset.textoOriginal || 'Enviar Sugestão';
            }
        },

        simularEnvio() {
            return new Promise(resolve => setTimeout(resolve, 1500));
        }
    };

    // ============================================
    // NAVEGAÇÃO SUAVE + SCROLL SPY
    // ============================================
    const Navegacao = {
        init() {
            this.configurarScrollSuave();
            this.configurarScrollSpy();
        },

        configurarScrollSuave() {
            document.querySelectorAll('nav a[href^="#"]').forEach(link => {
                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    const href = link.getAttribute('href');
                    const alvo = document.querySelector(href);

                    if (alvo) {
                        alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        history.pushState(null, null, href);
                    }
                });
            });
        },

        configurarScrollSpy() {
            const secoes = document.querySelectorAll('main section[id]');
            const linksMenu = document.querySelectorAll('nav a[href^="#"]');

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {

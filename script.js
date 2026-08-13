/**
 * AGRINHO 2026 🌸 — Script principal
 */

const AgrinhoApp = (() => {
    'use strict';

    const CONFIG = {
        temaStorageKey: 'tema-agrinho',
        debounceDelay: 300,
        toastDuracao: 3500
    };

    const Utils = {
        debounce(fn, espera) {
            let t;
            return (...args) => {
                clearTimeout(t);
                t = setTimeout(() => fn(...args), espera);
            };
        },
        emailValido(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }
    };

    // ===== NOTIFICAÇÕES TOAST =====
    const Toast = {
        container: null,

        init() {
            this.container = document.createElement('div');
            this.container.className = 'notificacoes-container';
            document.body.appendChild(this.container);
        },

        mostrar(mensagem, tipo = 'sucesso') {
            const toast = document.createElement('div');
            toast.className = `toast toast-${tipo}`;
            toast.setAttribute('role', 'alert');

            const icone = tipo === 'erro' ? '⚠️' : '💌';

            toast.innerHTML = `
                <span class="toast-icone">${icone}</span>
                <span class="toast-mensagem">${mensagem}</span>
                <button class="toast-fechar" aria-label="Fechar">&times;</button>
            `;

            toast.querySelector('.toast-fechar')
                 .addEventListener('click', () => this.fechar(toast));

            this.container.appendChild(toast);
            requestAnimationFrame(() => toast.classList.add('toast-visivel'));

            setTimeout(() => this.fechar(toast), CONFIG.toastDuracao);
        },

        fechar(toast) {
            if (!toast.isConnected) return;
            toast.classList.remove('toast-visivel');
            toast.classList.add('toast-fechando');
            setTimeout(() => toast.remove(), 400);
        }
    };

    // ===== FORMULÁRIO =====
    const Formulario = {
        init() {
            const form = document.querySelector('#form-contato');
            if (!form) return;

            form.addEventListener('submit', (e) => this.enviar(e, form));

            ['#nome', '#email', '#mensagem'].forEach(seletor => {
                const campo = document.querySelector(seletor);
                if (!campo) return;
                campo.addEventListener('blur', () => this.validarCampo(campo));
                campo.addEventListener('input',
                    Utils.debounce(() => this.validarCampo(campo), CONFIG.debounceDelay));
            });
        },

        enviar(event, form) {
            event.preventDefault();

            const nome = document.querySelector('#nome');
            const email = document.querySelector('#email');
            const mensagem = document.querySelector('#mensagem');

            const tudoOk = [nome, email, mensagem]
                .map(c => this.validarCampo(c))
                .every(v => v);

            if (!tudoOk) {
                Toast.mostrar('Ops! Verifique os campos destacados. 🌸', 'erro');
                return;
            }

            this.loading(true, form);

            // Simula envio (troque por Formspree/EmailJS quando quiser envio real)
            setTimeout(() => {
                this.loading(false, form);
                Toast.mostrar(`Obrigado, ${nome.value.split(' ')[0]}! Sua mensagem foi enviada. 💗`);
                form.reset();
            }, 1400);
        },

        validarCampo(campo) {
            this.limparErro(campo);

            if (!campo.value.trim()) {
                this.mostrarErro(campo, 'Este campo é obrigatório.');
                return false;
            }
            if (campo.id === 'email' && !Utils.emailValido(campo.value)) {
                this.mostrarErro(campo, 'Digite um e-mail válido.');
                return false;
            }
            if (campo.id === 'mensagem' && campo.value.trim().length < 10) {
                this.mostrarErro(campo, 'Escreva pelo menos 10 caracteres.');
                return false;
            }
            return true;
        },

        mostrarErro(campo, msg) {
            campo.classList.add('campo-erro');
            const span = document.createElement('span');
            span.className = 'mensagem-erro';
            span.textContent = msg;
            campo.insertAdjacentElement('afterend', span);
        },

        limparErro(campo) {
            campo.classList.remove('campo-erro');
            const erro = campo.parentElement.querySelector('.mensagem-erro');
            if (erro) erro.remove();
        },

        loading(ativo, form) {
            const btn = form.querySelector('button[type="submit"]');
            if (ativo) {
                btn.dataset.original = btn.innerHTML;
                btn.disabled = true;
                btn.innerHTML = '<span class="spinner"></span> Enviando...';
            } else {
                btn.disabled = false;
                btn.innerHTML = btn.dataset.original || 'Enviar com carinho 💌';
            }
        }
    };

    // ===== NAVEGAÇÃO SUAVE + SCROLL SPY =====
    const Navegacao = {
        init() {
            document.querySelectorAll('a[href^="#"]').forEach(link => {
                link.addEventListener('click', (e) => {
                    const alvo = document.querySelector(link.getAttribute('href'));
                    if (!alvo) return;
                    e.preventDefault();
                    alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
            });

            const secoes = document.querySelectorAll('section[id]');
            const links = document.querySelectorAll('.menu a');

            const observer = new IntersectionObserver((entradas) => {
                entradas.forEach(entrada => {
                    if (!entrada.isIntersecting) return;
                    const id = entrada.target.id;
                    links.forEach(link => {
                        link.classList.toggle('link-ativo',
                            link.getAttribute('href') === `#${id}`);
                    });
                });
            }, { rootMargin: '-45% 0px -45% 0px' });

            secoes.forEach(s => observer.observe(s));
        }
    };

    // ===== MODO ESCURO =====
    const Tema = {
        init() {
            const botao = document.querySelector('#alternar-tema');
            if (!botao) return;

            const salvo = localStorage.getItem(CONFIG.temaStorageKey);
            const sistemaEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;

            if (salvo === 'dark' || (!salvo && sistemaEscuro)) {
                this.aplicar(true, botao);
            }

            botao.addEventListener('click', () => {
                const escuro = document.body.classList.toggle('dark-mode');
                this.aplicar(escuro, botao);
                localStorage.setItem(CONFIG.temaStorageKey, escuro ? 'dark' : 'light');
            });
        },

        aplicar(escuro, botao) {
            document.body.classList.toggle('dark-mode', escuro);
            botao.textContent = escuro ? '☀️' : '🌙';
            botao.setAttribute('aria-pressed', String(escuro));
        }
    };

    // ===== ANIMAÇÕES AO ROLAR =====
    const Animacoes = {
        init() {
            const elementos = document.querySelectorAll(
                'section, .numero-card, footer'
            );

            const observer = new IntersectionObserver((entradas) => {
                entradas.forEach(e => {
                    if (e.isIntersecting) {
                        e.target.classList.add('animacao-visivel');
                        observer.unobserve(e.target);
                    }
                });
            }, { threshold: 0.12 });

            elementos.forEach(el => {
                el.classList.add('animacao-entrada');
                observer.observe(el);
            });
        }
    };

    // ===== VOLTAR AO TOPO =====
    const Topo = {
        init() {
            const btn = document.createElement('button');
            btn.className = 'btn-topo';
            btn.setAttribute('aria-label', 'Voltar ao topo');
            btn.textContent = '↑';
            document.body.appendChild(btn);

            window.addEventListener('scroll', Utils.debounce(() => {
                btn.classList.toggle('visivel', window.scrollY > 400);
            }, 100));

            btn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    };

    const init = () => {
        Toast.init();
        Formulario.init();
        Navegacao.init();
        Tema.init();
        Animacoes.init();
        Topo.init();
        console.log('🌸 AGRINHO 2026 carregado com amor!');
    };

    return { init };
})();

document.addEventListener('DOMContentLoaded', AgrinhoApp.init);

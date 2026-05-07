// === Contador de pedido (acessível com aria-live) ===
const botoes = document.querySelectorAll('.btn-add');
const contador = document.getElementById('contador-pedido');
let total = 0;
botoes.forEach((btn) => {
  btn.addEventListener('click', () => {
    total++;
    contador.textContent = String(total);
  });
});

// === Ano dinâmico no rodapé ===
document.getElementById('ano').textContent = new Date().getFullYear();

// === Validação acessível do formulário ===
const form = document.querySelector('.form');
const feedback = document.getElementById('form-feedback');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = form.nome.value.trim();
  const email = form.email.value.trim();
  const mensagem = form.mensagem.value.trim();
  feedback.classList.remove('success', 'error');
  if (!nome || !email || !mensagem) {
    feedback.textContent = 'Por favor, preencha todos os campos.';
    feedback.classList.add('error');
    return;
  }
  if (!email.includes('@')) {
    feedback.textContent = 'Informe um e-mail válido.';
    feedback.classList.add('error');
    return;
  }
  feedback.textContent = `Obrigado, ${nome}! Sua mensagem foi enviada.`;
  feedback.classList.add('success');
  form.reset();
});

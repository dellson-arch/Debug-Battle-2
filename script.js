const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

const balance = $('#total-balance');
const income = $('#total-income');
const expense = $('#total-expense');
const list = $('#transaction-list');
const form = $('#transaction-form');
const description = $('#description');
const amountInput = $('#amount');
const modal = $('#modalOverlay');
const openModalBtn = $('#openModal');
const closeModalBtn = $('#closeModal');
const searchInput = $('#search-input');
const filterBtns = $$('.filter');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let currentFilter = 'all';

function addTransaction(e){
  e.preventDefault();

  const type = $('input[name="transaction-type"]:checked').value;
  const amount = Number(amountInput.value);

  const transaction = {
    id: Date.now(),
    text: description.value,
    amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
    type
  };

  transactions.push(transaction);
  updateLocal();
  init();

  form.reset();
  modal.classList.remove('active');
}

function updateLocal(){
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function removeTransaction(id){
  transactions = transactions.filter(t => t.id !== id);
  updateLocal();
  init();
}

function updateValues(){
  let total = 0, inc = 0, exp = 0;

  transactions.forEach(t => {
    total += t.amount;
    if(t.amount > 0) inc += t.amount;
    else exp += t.amount;
  });

  balance.innerText = `$${total.toFixed(2)}`;
  income.innerText = `$${inc.toFixed(2)}`;
  expense.innerText = `$${Math.abs(exp).toFixed(2)}`;
}

function render(){
  list.innerHTML = '';
  let filtered = transactions;

  if(searchInput.value){
    filtered = filtered.filter(t =>
      t.text.toLowerCase().includes(searchInput.value.toLowerCase())
    );
  }

  if(currentFilter !== 'all'){
    filtered = filtered.filter(t => t.type === currentFilter);
  }

  filtered.forEach(t => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${t.text}</span>
      <span class="${t.amount < 0 ? 'amount-expense' : 'amount-income'}">
        ${t.amount < 0 ? '-' : '+'}$${Math.abs(t.amount)}
      </span>
    `;
    li.onclick = () => removeTransaction(t.id);
    list.appendChild(li);
  });
}

function init(){
  render();
  updateValues();
}

form.addEventListener('submit', addTransaction);
openModalBtn.addEventListener('click', () => modal.classList.add('active'));
closeModalBtn.addEventListener('click', () => modal.classList.remove('active'));

filterBtns.forEach(btn=>{
  btn.addEventListener('click',()=>{
    filterBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

searchInput.addEventListener('input', render);

init();
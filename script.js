// DOM Elements
const tabs = document.querySelectorAll('.tab-btn');
const categories = document.querySelectorAll('.category');
const itemButtons = document.querySelectorAll('.item-btn');
const modal = document.getElementById('modal');
const modalItemName = document.getElementById('modal-item-name');
const quantityInput = document.getElementById('quantity-input');
const unitSelect = document.getElementById('unit-select');
const confirmBtn = document.getElementById('confirm-btn');
const cancelBtn = document.getElementById('cancel-btn');
const selectedItemsDiv = document.getElementById('selected-items');
const countSpan = document.getElementById('count');
const saveBtn = document.getElementById('save-btn');
const printBtn = document.getElementById('print-btn');
const whatsappBtn = document.getElementById('whatsapp-btn');
const clearBtn = document.getElementById('clear-btn');

// State
let selectedItems = JSON.parse(localStorage.getItem('productionItems')) || {};

// Tab Switching
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.getAttribute('data-tab');
    
    tabs.forEach(t => t.classList.remove('active'));
    categories.forEach(c => c.classList.remove('active'));
    
    tab.classList.add('active');
    document.getElementById(tabName).classList.add('active');
  });
});

// Open Modal
let currentItemName = '';

itemButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    currentItemName = btn.getAttribute('data-name');
    modalItemName.textContent = currentItemName;
    quantityInput.value = 1;
    modal.style.display = 'flex';
  });
});

// Close Modal
cancelBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Confirm Selection
confirmBtn.addEventListener('click', () => {
  const quantity = parseInt(quantityInput.value);
  const unit = unitSelect.value;

  if (isNaN(quantity) || quantity < 1) {
    alert('الرجاء إدخال عدد صحيح');
    return;
  }

  selectedItems[currentItemName] = {
    quantity,
    unit
  };

  modal.style.display = 'none';
  updateSelectedItems();
  saveToStorage();
});

// Update Display
function updateSelectedItems() {
  selectedItemsDiv.innerHTML = '';
  const itemsArray = Object.keys(selectedItems);
  countSpan.textContent = itemsArray.length;

  itemsArray.forEach(name => {
    const item = selectedItems[name];
    const div = document.createElement('div');
    div.className = 'item-row';
    div.innerHTML = `
      <span>${name}</span>
      <span>${item.quantity} × ${item.unit}</span>
    `;
    selectedItemsDiv.appendChild(div);
  });
}

// Save to localStorage
function saveToStorage() {
  localStorage.setItem('productionItems', JSON.stringify(selectedItems));
}

// Clear All
clearBtn.addEventListener('click', () => {
  if (confirm('هل أنت متأكد من مسح جميع الأصناف؟')) {
    selectedItems = {};
    updateSelectedItems();
    saveToStorage();
  }
});

// Save Button
saveBtn.addEventListener('click', () => {
  saveToStorage();
  alert('تم حفظ الطلب بنجاح');
});

// Print
printBtn.addEventListener('click', () => {
  const originalContent = document.body.innerHTML;
  const printContent = document.querySelector('.container').innerHTML;

  document.body.innerHTML = `
    <h2>إنتاج - ${new Date().toLocaleDateString('en-GB')}</h2>
    ${printContent}
  `;
  document.body.style.padding = '20px';
  window.print();
  document.body.innerHTML = originalContent;
  window.location.reload();
});

// WhatsApp Share
whatsappBtn.addEventListener('click', () => {
  if (Object.keys(selectedItems).length === 0) {
    alert('لا يوجد أصناف لمشاركتها');
    return;
  }

  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  const gregorianDate = `${day}/${month}/${year}`;

  let message = `إنتاج ${gregorianDate}\n\n`;
  for (const name in selectedItems) {
    const item = selectedItems[name];
    message += `• ${name}: ${item.quantity} × ${item.unit}\n`;
  }

  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
});

// Initial Load
updateSelectedItems();
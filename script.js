// Simple interactive bits: mobile nav toggle + order modal + cart
document.addEventListener('DOMContentLoaded', function () {
  // year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');
  navToggle && navToggle.addEventListener('click', () => {
    const showing = navList.classList.toggle('show');
    navToggle.setAttribute('aria-expanded', showing ? 'true' : 'false');
  });

  // modal
  const orderModal = document.getElementById('order-modal');
  const orderNowBtns = document.querySelectorAll('#order-now, #hero-order, .add-to-order');
  const modalClose = document.querySelector('.modal-close');
  const orderItemsEl = document.getElementById('order-items');
  const orderTotalEl = document.getElementById('order-total');
  const clearBtn = document.getElementById('clear-order');
  const checkoutBtn = document.getElementById('checkout');

  let cart = [];

  function openModal(){
    orderModal.setAttribute('aria-hidden','false');
  }
  function closeModal(){
    orderModal.setAttribute('aria-hidden','true');
  }

  modalClose && modalClose.addEventListener('click', closeModal);
  document.getElementById('order-now').addEventListener('click', openModal);
  document.getElementById('hero-order').addEventListener('click', openModal);

  // add-to-order buttons
  document.querySelectorAll('.add-to-order').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const item = JSON.parse(btn.getAttribute('data-item'));
      addToCart(item);
      openModal();
    });
  });

  function addToCart(item){
    const existing = cart.find(i => i.name === item.name);
    if(existing) existing.qty += 1;
    else cart.push({...item, qty:1});
    renderCart();
  }
  function renderCart(){
    orderItemsEl.innerHTML = '';
    if(cart.length === 0){
      orderItemsEl.innerHTML = '<p class="empty">No items yet — add something from the menu.</p>';
      orderTotalEl.textContent = '$0.00';
      return;
    }
    let total = 0;
    cart.forEach((it, idx) => {
      const row = document.createElement('div');
      row.className = 'order-row';
      row.innerHTML = `
        <div>
          <div><strong>${escapeHtml(it.name)}</strong></div>
          <div style="color:var(--muted);font-size:13px">Qty: ${it.qty}</div>
        </div>
        <div style="text-align:right">
          <div>$${(it.price * it.qty).toFixed(2)}</div>
          <div style="margin-top:6px">
            <button data-idx="${idx}" class="btn btn-outline small reduce">−</button>
            <button data-idx="${idx}" class="btn btn-outline small increase">+</button>
          </div>
        </div>
      `;
      orderItemsEl.appendChild(row);
      total += it.price * it.qty;
    });
    orderTotalEl.textContent = `$${total.toFixed(2)}`;

    // wire +/- buttons
    orderItemsEl.querySelectorAll('.reduce').forEach(b=>{
      b.addEventListener('click', ()=>{
        const i = +b.dataset.idx;
        cart[i].qty = Math.max(0, cart[i].qty - 1);
        if(cart[i].qty === 0) cart.splice(i,1);
        renderCart();
      });
    });
    orderItemsEl.querySelectorAll('.increase').forEach(b=>{
      b.addEventListener('click', ()=>{
        const i = +b.dataset.idx;
        cart[i].qty += 1;
        renderCart();
      });
    });
  }

  clearBtn && clearBtn.addEventListener('click', ()=>{
    cart = [];
    renderCart();
  });

  checkoutBtn && checkoutBtn.addEventListener('click', ()=>{
    if(cart.length === 0){
      alert('Your cart is empty — add something from the menu!');
      return;
    }
    // Placeholder checkout flow
    const summary = cart.map(i => `${i.qty}× ${i.name}`).join(', ');
    alert('Thanks! Your order: ' + summary + '. (This demo doesn\'t actually place orders.)');
    cart = [];
    renderCart();
    closeModal();
  });

  // contact form (demo)
  const contactForm = document.getElementById('contact-form');
  contactForm && contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    alert('Thanks! Message sent (demo).');
    contactForm.reset();
  });

  // util
  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, function (m) {
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]);
    });
  }

  renderCart();
});

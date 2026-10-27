/* UrbanThread storefront.
   One page, several "views". The part of the web address after # decides which view shows:
   #/ (home)  #/shop  #/shop/Hoodies  #/product/4  #/cart  #/checkout  #/confirmation
   To change products, edit the PRODUCTS list below. */
(function () {
  'use strict';

  /* ---------- Data ---------- */
  const CATEGORIES = ['T-Shirts', 'Hoodies', 'Jeans', 'Jackets', 'Accessories'];
  const TOP_SIZES = ['S', 'M', 'L', 'XL'];
  const DENIM_SIZES = ['28', '30', '32', '34'];
  const ONE_SIZE = ['One Size'];
  const photo = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;
  const HERO_IMG = photo('1523398002811-999ca8dec234');

  const PRODUCTS = [
    { id: 1, name: 'Boxy Heavyweight Tee', category: 'T-Shirts', price: 1299, sizes: TOP_SIZES, featured: true, tag: 'Bestseller', img: photo('1521572163474-6864f9cf17ab'), desc: 'A boxy, drop-shoulder tee in 240 GSM combed cotton. Thick enough to hold its shape, soft enough to wear every day.' },
    { id: 2, name: 'Washed Graphic Tee', category: 'T-Shirts', price: 1499, sizes: TOP_SIZES, img: photo('1583743814966-8936f5b7be1a'), desc: 'Garment-washed black cotton with a faded back print. Relaxed fit with a ribbed collar that keeps its shape.' },
    { id: 3, name: 'Everyday Pocket Tee', category: 'T-Shirts', price: 999, sizes: TOP_SIZES, img: photo('1576566588028-4147f3842f27'), desc: 'Your plain white tee, done properly. Mid-weight jersey, a clean chest pocket and a straight hem.' },
    { id: 4, name: 'Classic Pullover Hoodie', category: 'Hoodies', price: 2999, sizes: TOP_SIZES, featured: true, tag: 'Bestseller', img: photo('1556821840-3a63f95609a7'), desc: 'Brushed-back fleece, double-layer hood and a kangaroo pocket. A regular fit that layers under a jacket.' },
    { id: 5, name: 'Zip-Up Fleece Hoodie', category: 'Hoodies', price: 3299, sizes: TOP_SIZES, img: photo('1620799140408-edc6dcb6d633'), desc: 'Full-zip hoodie with a metal zipper, ribbed cuffs and a soft fleece lining for cooler evenings.' },
    { id: 6, name: 'Oversized Washed Hoodie', category: 'Hoodies', price: 3499, sizes: TOP_SIZES, tag: 'New', img: photo('1578768079052-aa76e52ff62e'), desc: 'Cut wide and slightly cropped, then enzyme-washed for a lived-in feel from the first wear.' },
    { id: 7, name: 'Straight Fit Denim', category: 'Jeans', price: 2799, sizes: DENIM_SIZES, img: photo('1542272604-787c3835535d'), desc: '12 oz mid-blue denim with a straight leg and a mid rise. Sturdy, comfortable and made to fade well.' },
    { id: 8, name: 'Baggy Carpenter Jeans', category: 'Jeans', price: 3199, sizes: DENIM_SIZES, featured: true, tag: 'New', img: photo('1541099649105-f69ad21f3246'), desc: 'A wide leg with a hammer loop and utility pockets. Heavy rigid denim that softens with wear.' },
    { id: 9, name: 'Black Slim Jeans', category: 'Jeans', price: 2599, sizes: DENIM_SIZES, img: photo('1604176354204-9268737828e4'), desc: 'Stretch black denim with a slim taper. Stays dark wash after wash and moves with you.' },
    { id: 10, name: 'Bomber Jacket', category: 'Jackets', price: 4999, sizes: TOP_SIZES, featured: true, img: photo('1551028719-00167b16eac5'), desc: 'A water-resistant shell with a quilted lining, ribbed trims and two zip pockets. Light enough for all-day wear.' },
    { id: 11, name: 'Denim Trucker Jacket', category: 'Jackets', price: 4499, sizes: TOP_SIZES, img: photo('1591047139829-d91aecb6caea'), desc: 'The classic trucker shape in stonewashed denim with a slightly boxy body and chest flap pockets.' },
    { id: 12, name: 'Coach Jacket', category: 'Jackets', price: 3999, sizes: TOP_SIZES, img: photo('1544923246-77307dd654cb'), desc: 'Snap-button coach jacket in crisp nylon twill with an unlined body. Pack it, wear it, forget it is there.' },
    { id: 13, name: 'Six-Panel Cap', category: 'Accessories', price: 799, sizes: ONE_SIZE, img: photo('1588850561407-ed78c282e89b'), desc: 'Washed cotton twill cap with an embroidered logo and an adjustable strap at the back.' },
    { id: 14, name: 'Crossbody Bag', category: 'Accessories', price: 1899, sizes: ONE_SIZE, img: photo('1553062407-98eeb64c6a62'), desc: 'Water-repellent canvas bag with an adjustable strap and two zip compartments. Fits a phone, wallet and keys.' },
    { id: 15, name: 'Rib Knit Beanie', category: 'Accessories', price: 699, sizes: ONE_SIZE, img: photo('1576871337632-b9aef4c17ab9'), desc: 'A thick rib knit beanie with a folded cuff. Warm, stretchy and easy to pair with everything.' }
  ];

  /* ---------- Helpers ---------- */
  const CART_KEY = 'urbanthread_cart';
  const ORDER_KEY = 'urbanthread_last_order';
  const $ = (sel, root = document) => root.querySelector(sel);
  const app = $('#app');
  const inr = n => '\u20B9' + n.toLocaleString('en-IN');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const byId = id => PRODUCTS.find(p => p.id === Number(id));

  function load(key, fallback) {
    try { const v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; } catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable: cart works for this visit only */ }
  }

  /* ---------- Cart ---------- */
  let cart = load(CART_KEY, []);
  if (!Array.isArray(cart)) cart = [];
  cart = cart.filter(i => byId(i.id) && i.qty > 0 && typeof i.size === 'string');

  const cartCount = () => cart.reduce((n, i) => n + i.qty, 0);
  const lineTotal = i => byId(i.id).price * i.qty;
  const subtotal = () => cart.reduce((sum, i) => sum + lineTotal(i), 0);

  function saveCart() {
    save(CART_KEY, cart);
    $('#cartCount').textContent = cartCount();
  }
  function addToCart(id, size) {
    const found = cart.find(i => i.id === id && i.size === size);
    if (found) found.qty = Math.min(found.qty + 1, 10);
    else cart.push({ id, size, qty: 1 });
    saveCart();
  }

  function toast(message, withCartLink) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<span>${esc(message)}</span>${withCartLink ? '<a href="#/cart">View cart</a>' : ''}`;
    $('#toasts').appendChild(t);
    setTimeout(() => t.remove(), 3200);
  }

  /* ---------- Images (with a designed fallback if a photo fails to load) ---------- */
  function placeholder(category) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect width="400" height="500" fill="#e6dccb"/><text x="200" y="255" font-family="Impact,Arial Black,sans-serif" font-size="72" text-anchor="middle" fill="#000">UT</text><text x="200" y="295" font-family="Arial,sans-serif" font-size="18" text-anchor="middle" fill="#6b665c">${esc(category)}</text></svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
  document.addEventListener('error', e => {
    const el = e.target;
    if (el.tagName === 'IMG' && !el.dataset.failed) {
      el.dataset.failed = '1';
      el.src = placeholder(el.dataset.cat || 'UrbanThread');
    }
  }, true);

  const img = p => `<img src="${p.img}" alt="${esc(p.name)}" loading="lazy" data-cat="${p.category}">`;
  const card = p => `
    <article class="card">
      <a class="card-img" href="#/product/${p.id}">${img(p)}${p.tag ? `<span class="tag">${p.tag}</span>` : ''}</a>
      <div class="card-body">
        <h3><a href="#/product/${p.id}">${p.name}</a></h3>
        <span class="cat">${p.category}</span>
        <span class="price">${inr(p.price)}</span>
      </div>
    </article>`;

  /* ---------- Views ---------- */
  function viewHome() {
    document.title = 'UrbanThread | Streetwear for the city';
    app.innerHTML = `
      <section class="hero">
        <div class="hero-copy">
          <h1>Wear<br>the city</h1>
          <p>The autumn and winter drop is here. Heavyweight fleece, rigid denim and layers built to be worn hard.</p>
          <div class="hero-actions">
            <a class="btn btn-light" href="#/shop">Shop the collection</a>
            <a class="btn btn-ghost" href="#/shop/Hoodies">Shop hoodies</a>
          </div>
        </div>
        <div class="hero-img" style="background-image:url('${HERO_IMG}')" role="img" aria-label="Model wearing UrbanThread streetwear"></div>
      </section>

      <nav class="cat-strip" aria-label="Shop by category">
        ${CATEGORIES.map(c => `<a href="#/shop/${encodeURIComponent(c)}">${c}</a>`).join('')}
      </nav>

      <section class="section container">
        <div class="section-head">
          <h2 class="section-title">Featured</h2>
          <a class="text-link" href="#/shop">View all products</a>
        </div>
        <div class="grid">${PRODUCTS.filter(p => p.featured).map(card).join('')}</div>
      </section>

      <section class="banner">
        <div class="container banner-inner">
          <div>
            <h2>Built heavy.<br>Made to last.</h2>
            <p>Every piece starts with fabric that has real weight: 240 GSM cotton, brushed fleece and 12 oz denim. We keep the designs simple so the quality shows.</p>
            <a class="btn" href="#/shop">Shop now</a>
          </div>
          <div class="promises">
            <div><strong>Free shipping</strong>On every order across India.</div>
            <div><strong>7-day returns</strong>Wrong size? Send it back.</div>
            <div><strong>Cash on delivery</strong>Pay when your order arrives.</div>
          </div>
        </div>
      </section>`;
  }

  const state = { category: 'All', q: '', sort: 'featured' };

  function viewShop(cat) {
    document.title = 'Shop | UrbanThread';
    state.category = CATEGORIES.includes(cat) ? cat : 'All';
    app.innerHTML = `
      <section class="container page">
        <h1 class="page-title">Shop</h1>
        <div class="toolbar">
          <input type="search" id="q" placeholder="Search products" aria-label="Search products" value="${esc(state.q)}">
          <select id="sort" aria-label="Sort products">
            <option value="featured">Sort: Featured</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>
        <div class="chips">${['All'].concat(CATEGORIES).map(c => `<button class="chip" data-cat="${c}">${c}</button>`).join('')}</div>
        <p id="count" class="muted"></p>
        <div class="grid" id="grid"></div>
      </section>`;
    $('#sort').value = state.sort;

    function update() {
      const q = state.q.trim().toLowerCase();
      const list = PRODUCTS.filter(p =>
        (state.category === 'All' || p.category === state.category) &&
        (p.name + ' ' + p.category).toLowerCase().includes(q));
      if (state.sort === 'low') list.sort((a, b) => a.price - b.price);
      if (state.sort === 'high') list.sort((a, b) => b.price - a.price);
      document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.dataset.cat === state.category));
      $('#count').textContent = `${list.length} ${list.length === 1 ? 'product' : 'products'}`;
      $('#grid').innerHTML = list.length ? list.map(card).join('') :
        `<div class="empty"><h3>No products found</h3><p>Try a different search or category.</p><button class="btn" id="reset">Clear filters</button></div>`;
      const reset = $('#reset');
      if (reset) reset.addEventListener('click', () => { state.q = ''; state.category = 'All'; $('#q').value = ''; update(); });
    }
    $('#q').addEventListener('input', e => { state.q = e.target.value; update(); });
    $('#sort').addEventListener('change', e => { state.sort = e.target.value; update(); });
    document.querySelectorAll('.chip').forEach(chip => chip.addEventListener('click', () => {
      state.category = chip.dataset.cat;
      history.replaceState(null, '', state.category === 'All' ? '#/shop' : '#/shop/' + encodeURIComponent(state.category));
      update();
    }));
    update();
  }

  function viewProduct(id) {
    const p = byId(id);
    if (!p) return viewNotFound();
    document.title = p.name + ' | UrbanThread';
    let size = p.sizes.length === 1 ? p.sizes[0] : null;
    const related = PRODUCTS.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
    app.innerHTML = `
      <section class="container page">
        <p class="crumbs"><a href="#/">Home</a> / <a href="#/shop/${encodeURIComponent(p.category)}">${p.category}</a> / ${p.name}</p>
        <div class="detail">
          <div class="detail-img">${img(p)}</div>
          <div class="detail-info">
            <span class="cat">${p.category}</span>
            <h1>${p.name}</h1>
            <span class="price">${inr(p.price)}</span>
            <p>${p.desc}</p>
            <strong>Size</strong>
            <div class="sizes">${p.sizes.map(s => `<button class="size${s === size ? ' active' : ''}" data-size="${s}">${s}</button>`).join('')}</div>
            <p class="size-msg" id="sizeMsg" role="alert"></p>
            <button class="btn btn-block" id="addBtn">Add to cart</button>
            <ul class="perks">
              <li>Free shipping across India</li>
              <li>Easy 7-day returns</li>
              <li>Cash on delivery available</li>
            </ul>
          </div>
        </div>
        ${related.length ? `<h2 class="section-title" style="margin-bottom:28px">You may also like</h2><div class="grid">${related.map(card).join('')}</div>` : ''}
      </section>`;

    document.querySelectorAll('.size').forEach(btn => btn.addEventListener('click', () => {
      size = btn.dataset.size;
      document.querySelectorAll('.size').forEach(b => b.classList.toggle('active', b === btn));
      $('#sizeMsg').textContent = '';
    }));
    $('#addBtn').addEventListener('click', () => {
      if (!size) { $('#sizeMsg').textContent = 'Please choose a size first.'; return; }
      addToCart(p.id, size);
      toast(`${p.name} (${size}) added to cart`, true);
    });
  }

  function emptyCartView(title) {
    app.innerHTML = `
      <section class="container page">
        <div class="empty">
          <h1>${title}</h1>
          <p class="muted">Add something you like and it will show up here.</p>
          <a class="btn" href="#/shop">Start shopping</a>
        </div>
      </section>`;
  }

  function viewCart() {
    document.title = 'Cart | UrbanThread';
    if (!cart.length) return emptyCartView('Your cart is empty');
    const rows = cart.map((it, i) => {
      const p = byId(it.id);
      return `
        <div class="cart-row">
          <a class="cart-thumb" href="#/product/${p.id}">${img(p)}</a>
          <div class="cart-info">
            <h3><a href="#/product/${p.id}">${p.name}</a></h3>
            <span class="cat">Size ${it.size}</span>
            <span class="muted">${inr(p.price)} each</span>
            <div class="qty" aria-label="Quantity">
              <button data-act="dec" data-i="${i}" aria-label="Decrease quantity">&minus;</button>
              <span>${it.qty}</span>
              <button data-act="inc" data-i="${i}" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <div class="cart-side">
            <strong>${inr(lineTotal(it))}</strong>
            <button class="remove" data-act="remove" data-i="${i}">Remove</button>
          </div>
        </div>`;
    }).join('');
    app.innerHTML = `
      <section class="container page">
        <h1 class="page-title">Your cart</h1>
        <div class="cart-layout">
          <div>${rows}</div>
          <aside class="summary">
            <h2>Order summary</h2>
            <div class="sum-line"><span>Items</span><span>${cartCount()}</span></div>
            <div class="sum-line"><span>Subtotal</span><strong>${inr(subtotal())}</strong></div>
            <div class="sum-line"><span>Shipping</span><span>Free</span></div>
            <a class="btn" href="#/checkout">Go to checkout</a>
            <a class="btn btn-outline" href="#/shop">Continue shopping</a>
          </aside>
        </div>
      </section>`;
  }

  app.addEventListener('click', e => {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const i = Number(btn.dataset.i);
    const item = cart[i];
    if (!item) return;
    if (btn.dataset.act === 'inc') item.qty = Math.min(item.qty + 1, 10);
    if (btn.dataset.act === 'dec') item.qty = Math.max(item.qty - 1, 1);
    if (btn.dataset.act === 'remove') { cart.splice(i, 1); toast('Item removed from cart'); }
    saveCart();
    viewCart();
  });

  function viewCheckout() {
    document.title = 'Checkout | UrbanThread';
    if (!cart.length) return emptyCartView('Your cart is empty');
    app.innerHTML = `
      <section class="container page">
        <h1 class="page-title">Checkout</h1>
        <div class="checkout">
          <form class="form" id="form">
            <label>Full name<input name="name" required autocomplete="name"></label>
            <label>Email<input name="email" type="email" required autocomplete="email"></label>
            <label>Mobile number<input name="phone" type="tel" required pattern="[6-9][0-9]{9}" title="Enter a 10-digit mobile number" autocomplete="tel-national"></label>
            <label>PIN code<input name="pin" required pattern="[1-9][0-9]{5}" title="Enter a 6-digit PIN code" inputmode="numeric" autocomplete="postal-code"></label>
            <label class="full">Address<textarea name="address" required autocomplete="street-address"></textarea></label>
            <label>City<input name="city" required autocomplete="address-level2"></label>
            <label>State<input name="state" required autocomplete="address-level1"></label>
            <p class="note full">This is a demo store. No payment is taken and no real order is placed. Placing the order shows a sample confirmation.</p>
            <button class="btn full" type="submit">Place order</button>
          </form>
          <aside class="summary">
            <h2>Your order</h2>
            ${cart.map(it => `<div class="sum-line"><span>${byId(it.id).name} (${it.size}) x ${it.qty}</span><span>${inr(lineTotal(it))}</span></div>`).join('')}
            <div class="sum-line"><span>Shipping</span><span>Free</span></div>
            <div class="sum-line sum-total"><span>Total</span><span>${inr(subtotal())}</span></div>
            <a class="small" href="#/cart">Edit cart</a>
          </aside>
        </div>
      </section>`;

    $('#form').addEventListener('submit', e => {
      e.preventDefault();
      const f = new FormData(e.target);
      const order = {
        id: 'UT' + Math.floor(10000000 + Math.random() * 89999999),
        name: String(f.get('name')).trim(),
        email: String(f.get('email')).trim(),
        city: String(f.get('city')).trim(),
        total: subtotal(),
        items: cart.map(it => ({ name: byId(it.id).name, size: it.size, qty: it.qty, total: lineTotal(it) }))
      };
      save(ORDER_KEY, order);
      cart = [];
      saveCart();
      location.hash = '#/confirmation';
      toast('Order confirmed');
    });
  }

  function viewConfirmation() {
    document.title = 'Order confirmed | UrbanThread';
    const o = load(ORDER_KEY, null);
    if (!o || !Array.isArray(o.items)) { location.hash = '#/'; return; }
    app.innerHTML = `
      <section class="container page">
        <div class="confirm">
          <h1 class="page-title">Order confirmed</h1>
          <p>Thanks, ${esc(o.name)}. Your order <strong>${esc(o.id)}</strong> is confirmed. A confirmation would be sent to ${esc(o.email)} and your order shipped to ${esc(o.city)}.</p>
          <div class="box">
            ${o.items.map(i => `<div class="sum-line"><span>${esc(i.name)} (${esc(i.size)}) x ${i.qty}</span><span>${inr(i.total)}</span></div>`).join('')}
            <div class="sum-line sum-total"><span>Total, pay on delivery</span><span>${inr(o.total)}</span></div>
          </div>
          <p class="small">This is a demo store, so no real order was placed and no payment was taken.</p>
          <a class="btn" href="#/shop">Continue shopping</a>
        </div>
      </section>`;
  }

  function viewNotFound() {
    document.title = 'Page not found | UrbanThread';
    app.innerHTML = `<section class="container page"><div class="empty"><h1>Page not found</h1><p class="muted">The page you are looking for does not exist.</p><a class="btn" href="#/">Back to home</a></div></section>`;
  }

  /* ---------- Router and menu ---------- */
  const ROUTES = { '': viewHome, shop: viewShop, product: viewProduct, cart: viewCart, checkout: viewCheckout, confirmation: viewConfirmation };

  function route() {
    let parts;
    try { parts = location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent); } catch (e) { parts = ['404']; }
    const page = parts[0] || '';
    (ROUTES[page] || viewNotFound)(parts[1]);
    document.querySelectorAll('[data-page]').forEach(a => {
      if (a.dataset.page === page) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    setMenu(false);
    window.scrollTo(0, 0);
  }

  function setMenu(open) {
    $('#siteHeader').classList.toggle('menu-open', open);
    $('#menuBtn').setAttribute('aria-expanded', String(open));
  }
  $('#menuBtn').addEventListener('click', () => setMenu(!$('#siteHeader').classList.contains('menu-open')));

  window.addEventListener('hashchange', route);
  saveCart();
  route();
})();

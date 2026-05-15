const products = [
  {
    id: "sj-forged-r1",
    name: "SJ Forged R1",
    style: "forged",
    styleLabel: "Forged",
    finish: "gloss-black",
    finishLabel: "Gloss black",
    diameter: 19,
    price: 2650,
    fitment: "BMW M, Audi S/RS, Mercedes AMG",
    spec: "19x9.5 / 19x10.5",
    mediaClass: "media-forged",
  },
  {
    id: "sj-mesh-classic",
    name: "SJ Mesh Classic",
    style: "mesh",
    styleLabel: "Mesh",
    finish: "machined",
    finishLabel: "Machined",
    diameter: 18,
    price: 2180,
    fitment: "VW GTI, Civic Type R, Subaru WRX",
    spec: "18x8.5 / 18x9.5",
    mediaClass: "media-mesh",
  },
  {
    id: "sj-deep-dish-lx",
    name: "SJ Deep Dish LX",
    style: "deep-dish",
    styleLabel: "Deep Dish",
    finish: "brushed-silver",
    finishLabel: "Brushed silver",
    diameter: 20,
    price: 2920,
    fitment: "BMW 3/4 Series, Lexus IS, Infiniti Q50",
    spec: "20x9 / 20x10.5",
    mediaClass: "media-dish",
  },
  {
    id: "sj-track-split",
    name: "SJ Track Split",
    style: "performance",
    styleLabel: "Performance",
    finish: "gloss-black",
    finishLabel: "Gloss black",
    diameter: 18,
    price: 2360,
    fitment: "Porsche 911, Supra, M2, Camaro SS",
    spec: "18x10 / 18x11",
    mediaClass: "media-performance",
  },
  {
    id: "sj-concave-v2",
    name: "SJ Concave V2",
    style: "performance",
    styleLabel: "Performance",
    finish: "bronze",
    finishLabel: "Bronze",
    diameter: 20,
    price: 2480,
    fitment: "Tesla Model 3, BMW M3, Audi S5",
    spec: "20x9 / 20x10",
    mediaClass: "media-concave",
  },
  {
    id: "sj-forged-gt",
    name: "SJ Forged GT",
    style: "forged",
    styleLabel: "Forged",
    finish: "brushed-silver",
    finishLabel: "Brushed silver",
    diameter: 21,
    price: 3360,
    fitment: "RS6, M5, Panamera, E63",
    spec: "21x10 / 21x11",
    mediaClass: "media-forged",
  },
];

const visualizerAssets = {
  base: "assets/generated/visualizer-car.png",
  wheels: {
    forged: "assets/generated/wheel-forged.png",
    concave: "assets/generated/wheel-concave.png",
    mesh: "assets/generated/wheel-mesh.png",
    "deep-dish": "assets/generated/wheel-deep-dish.png",
    performance: "assets/generated/wheel-performance.png",
  },
};

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const styleCards = document.querySelectorAll(".style-card");
const wheelOptions = document.querySelectorAll(".wheel-option");
const productGrid = document.querySelector("#product-grid");
const catalogStatus = document.querySelector("#catalog-status");
const catalogSearch = document.querySelector("#catalog-search");
const diameterFilter = document.querySelector("#diameter-filter");
const finishFilter = document.querySelector("#finish-filter");
const resetFilters = document.querySelector("#reset-filters");
const cartOpen = document.querySelector("#cart-open");
const cartClose = document.querySelector("#cart-close");
const cartDrawer = document.querySelector("#cart-drawer");
const drawerBackdrop = document.querySelector("#drawer-backdrop");
const cartItems = document.querySelector("#cart-items");
const cartSubtotal = document.querySelector("#cart-subtotal");
const cartCounts = document.querySelectorAll("[data-cart-count]");
const quoteCartSummary = document.querySelector("#quote-cart-summary");
const quoteForm = document.querySelector("#quote-form");
const quoteStatus = document.querySelector("#quote-status");
const searchOpen = document.querySelector("#search-open");
const searchOverlay = document.querySelector("#search-overlay");
const searchClose = document.querySelector("[data-close-search]");
const globalSearch = document.querySelector("#global-search");
const searchResults = document.querySelector("#search-results");
const productModal = document.querySelector("#product-modal");
const productModalName = document.querySelector("#modal-product-name");
const productModalBody = document.querySelector("#product-modal-body");
const productClose = document.querySelector("[data-close-product]");
const carUpload = document.querySelector("#car-upload");
const visualizerCanvas = document.querySelector("#visualizer-canvas");
const visualizerContext = visualizerCanvas?.getContext("2d");
const placementButtons = document.querySelectorAll("[data-placement-mode]");
const wheelSize = document.querySelector("#wheel-size");
const wheelSizeOutput = document.querySelector("#wheel-size-output");
const rearWheelScale = document.querySelector("#rear-wheel-scale");
const rearWheelScaleOutput = document.querySelector("#rear-wheel-scale-output");
const wheelRotation = document.querySelector("#wheel-rotation");
const wheelRotationOutput = document.querySelector("#wheel-rotation-output");
const wheelOpacity = document.querySelector("#wheel-opacity");
const wheelOpacityOutput = document.querySelector("#wheel-opacity-output");
const wheelCover = document.querySelector("#wheel-cover");
const wheelCoverOutput = document.querySelector("#wheel-cover-output");
const wheelPerspective = document.querySelector("#wheel-perspective");
const wheelPerspectiveOutput = document.querySelector("#wheel-perspective-output");
const saveVisualizer = document.querySelector("#save-visualizer");
const exportVisualizer = document.querySelector("#export-visualizer");
const visualizerStatus = document.querySelector("#visualizer-status");

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

let activeStyle = "all";
let cart = readCart();
let placementMode = "front";
let activeWheel = "forged";
let baseImage = null;
let wheelImage = null;
let baseImageObjectUrl = "";
let visualizerState = readVisualizerState();

function readCart() {
  try {
    return JSON.parse(localStorage.getItem("sjstance-cart")) || [];
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem("sjstance-cart", JSON.stringify(cart));
}

function readVisualizerState() {
  const defaults = {
    wheel: "forged",
    front: { x: 405, y: 413 },
    rear: { x: 706, y: 413 },
    size: 118,
    rearScale: 0.96,
    rotation: 0,
    opacity: 0.96,
    cover: 0.7,
    perspective: 1,
  };

  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem("sjstance-visualizer") || "{}") };
  } catch {
    return defaults;
  }
}

function getProduct(productId) {
  return products.find((product) => product.id === productId);
}

function getFilteredProducts() {
  const query = catalogSearch?.value.trim().toLowerCase() || "";
  const diameter = diameterFilter?.value || "all";
  const finish = finishFilter?.value || "all";

  return products.filter((product) => {
    const matchesStyle = activeStyle === "all" || product.style === activeStyle;
    const matchesDiameter = diameter === "all" || String(product.diameter) === diameter;
    const matchesFinish = finish === "all" || product.finish === finish;
    const searchable = `${product.name} ${product.styleLabel} ${product.finishLabel} ${product.fitment} ${product.spec}`.toLowerCase();
    const matchesSearch = !query || searchable.includes(query);
    return matchesStyle && matchesDiameter && matchesFinish && matchesSearch;
  });
}

function productCard(product) {
  return `
    <article class="product-card">
      <button class="product-media ${product.mediaClass}" type="button" data-view-product="${product.id}" aria-label="View ${product.name} details"></button>
      <div class="product-card-body">
        <div>
          <p class="product-meta">${product.styleLabel} / ${product.finishLabel}</p>
          <h3>${product.name}</h3>
          <p>${product.spec}</p>
        </div>
        <div class="product-bottom">
          <strong>${currency.format(product.price)}</strong>
          <button class="button button-primary button-small" type="button" data-add-cart="${product.id}">Add</button>
        </div>
      </div>
    </article>
  `;
}

function renderProducts() {
  if (!productGrid) return;

  const filtered = getFilteredProducts();
  productGrid.innerHTML = filtered.map(productCard).join("");
  catalogStatus.textContent = `${filtered.length} wheel package${filtered.length === 1 ? "" : "s"} shown`;
}

function addToCart(productId) {
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart();
  renderCart();
  openCart();
}

function changeQuantity(productId, delta) {
  cart = cart
    .map((item) => {
      if (item.id !== productId) return item;
      return { ...item, quantity: Math.max(0, item.quantity + delta) };
    })
    .filter((item) => item.quantity > 0);

  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  renderCart();
}

function cartTotal() {
  return cart.reduce((total, item) => {
    const product = getProduct(item.id);
    return product ? total + product.price * item.quantity : total;
  }, 0);
}

function renderCart() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  cartCounts.forEach((item) => {
    item.textContent = String(count);
  });

  if (cartSubtotal) {
    cartSubtotal.textContent = currency.format(cartTotal());
  }

  if (quoteCartSummary) {
    quoteCartSummary.textContent = count
      ? `${count} item${count === 1 ? "" : "s"} selected: ${cart.map((item) => {
          const product = getProduct(item.id);
          return product ? `${product.name} x${item.quantity}` : "";
        }).filter(Boolean).join(", ")}`
      : "No cart items selected yet.";
  }

  if (!cartItems) return;

  if (!cart.length) {
    cartItems.innerHTML = `<p class="empty-state">Your cart is empty. Add wheel packages to build a quote.</p>`;
    return;
  }

  cartItems.innerHTML = cart
    .map((item) => {
      const product = getProduct(item.id);
      if (!product) return "";
      return `
        <article class="cart-line">
          <span class="cart-thumb ${product.mediaClass}"></span>
          <div>
            <h3>${product.name}</h3>
            <p>${product.spec} / ${product.finishLabel}</p>
            <strong>${currency.format(product.price * item.quantity)}</strong>
            <div class="quantity-row">
              <button type="button" data-quantity-minus="${product.id}" aria-label="Decrease ${product.name} quantity">-</button>
              <span>${item.quantity}</span>
              <button type="button" data-quantity-plus="${product.id}" aria-label="Increase ${product.name} quantity">+</button>
              <button type="button" data-remove-cart="${product.id}">Remove</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function openCart() {
  cartDrawer?.setAttribute("aria-hidden", "false");
  drawerBackdrop.hidden = false;
  document.body.classList.add("drawer-open");
}

function closeCart() {
  cartDrawer?.setAttribute("aria-hidden", "true");
  drawerBackdrop.hidden = true;
  document.body.classList.remove("drawer-open");
}

function openSearch() {
  searchOverlay.hidden = false;
  document.body.classList.add("modal-open");
  renderSearchResults("");
  requestAnimationFrame(() => globalSearch?.focus());
}

function closeSearch() {
  searchOverlay.hidden = true;
  document.body.classList.remove("modal-open");
}

function renderSearchResults(query) {
  if (!searchResults) return;
  const normalized = query.trim().toLowerCase();
  const pages = [
    { title: "Shop Wheels", text: "Browse forged, mesh, deep dish, and performance wheels.", href: "#shop" },
    { title: "Visualizer", text: "Upload your car and compare wheel styles.", href: "#visualizer" },
    { title: "Gallery", text: "View customer builds and wheel detail shots.", href: "#gallery" },
    { title: "Quote", text: "Send vehicle details and selected products.", href: "#quote-form" },
  ];
  const productMatches = products
    .filter((product) => {
      const haystack = `${product.name} ${product.styleLabel} ${product.finishLabel} ${product.fitment}`.toLowerCase();
      return !normalized || haystack.includes(normalized);
    })
    .map((product) => ({
      title: product.name,
      text: `${product.styleLabel}, ${product.finishLabel}, ${product.spec}`,
      productId: product.id,
    }));
  const pageMatches = pages.filter((page) => {
    const haystack = `${page.title} ${page.text}`.toLowerCase();
    return !normalized || haystack.includes(normalized);
  });
  const results = [...productMatches, ...pageMatches].slice(0, 8);

  searchResults.innerHTML = results.length
    ? results
        .map((result) => {
          if (result.productId) {
            return `<button type="button" data-search-product="${result.productId}"><strong>${result.title}</strong><span>${result.text}</span></button>`;
          }
          return `<a href="${result.href}" data-search-link><strong>${result.title}</strong><span>${result.text}</span></a>`;
        })
        .join("")
    : `<p class="empty-state">No matches found.</p>`;
}

function openProduct(productId) {
  const product = getProduct(productId);
  if (!product || !productModal || !productModalBody || !productModalName) return;

  productModalName.textContent = product.name;
  productModalBody.innerHTML = `
    <div class="modal-product-layout">
      <div class="modal-product-media ${product.mediaClass}" role="img" aria-label="${product.name} wheel image"></div>
      <div>
        <p class="product-meta">${product.styleLabel} / ${product.finishLabel}</p>
        <p>${product.fitment}</p>
        <dl class="spec-list">
          <div><dt>Diameter</dt><dd>${product.diameter} inch</dd></div>
          <div><dt>Spec</dt><dd>${product.spec}</dd></div>
          <div><dt>Finish</dt><dd>${product.finishLabel}</dd></div>
          <div><dt>Starting at</dt><dd>${currency.format(product.price)}</dd></div>
        </dl>
        <button class="button button-primary" type="button" data-add-cart="${product.id}">Add To Quote</button>
      </div>
    </div>
  `;
  productModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeProduct() {
  productModal.hidden = true;
  document.body.classList.remove("modal-open");
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function coverRect(image, canvas) {
  const imageRatio = image.width / image.height;
  const canvasRatio = canvas.width / canvas.height;
  let width = canvas.width;
  let height = canvas.height;
  let x = 0;
  let y = 0;

  if (imageRatio > canvasRatio) {
    height = canvas.height;
    width = height * imageRatio;
    x = (canvas.width - width) / 2;
  } else {
    width = canvas.width;
    height = width / imageRatio;
    y = (canvas.height - height) / 2;
  }

  return { x, y, width, height };
}

function applyVisualizerControlsToState() {
  visualizerState.size = Number(wheelSize?.value || visualizerState.size);
  visualizerState.rearScale = Number(rearWheelScale?.value || visualizerState.rearScale * 100) / 100;
  visualizerState.rotation = Number(wheelRotation?.value || 0);
  visualizerState.opacity = Number(wheelOpacity?.value || visualizerState.opacity * 100) / 100;
  visualizerState.cover = Number(wheelCover?.value || visualizerState.cover * 100) / 100;
  visualizerState.perspective = Number(wheelPerspective?.value || visualizerState.perspective * 100) / 100;
}

function syncVisualizerControls() {
  if (wheelSize) wheelSize.value = String(visualizerState.size);
  if (rearWheelScale) rearWheelScale.value = String(Math.round(visualizerState.rearScale * 100));
  if (wheelRotation) wheelRotation.value = String(visualizerState.rotation);
  if (wheelOpacity) wheelOpacity.value = String(Math.round(visualizerState.opacity * 100));
  if (wheelCover) wheelCover.value = String(Math.round(visualizerState.cover * 100));
  if (wheelPerspective) wheelPerspective.value = String(Math.round(visualizerState.perspective * 100));
  updateVisualizerOutputs();
}

function updateVisualizerOutputs() {
  if (wheelSizeOutput) wheelSizeOutput.textContent = `${visualizerState.size} px`;
  if (rearWheelScaleOutput) rearWheelScaleOutput.textContent = `${Math.round(visualizerState.rearScale * 100)}%`;
  if (wheelRotationOutput) wheelRotationOutput.textContent = `${visualizerState.rotation} deg`;
  if (wheelOpacityOutput) wheelOpacityOutput.textContent = `${Math.round(visualizerState.opacity * 100)}%`;
  if (wheelCoverOutput) wheelCoverOutput.textContent = `${Math.round(visualizerState.cover * 100)}%`;
  if (wheelPerspectiveOutput) wheelPerspectiveOutput.textContent = `${Math.round(visualizerState.perspective * 100)}%`;
}

function drawWheelOverlay(center, size, scaleX) {
  if (!visualizerContext || !wheelImage) return;
  const radius = size / 2;

  visualizerContext.save();
  visualizerContext.globalAlpha = visualizerState.cover;
  visualizerContext.fillStyle = "rgba(0, 0, 0, 0.78)";
  visualizerContext.beginPath();
  visualizerContext.ellipse(center.x, center.y, radius * 1.12 * scaleX, radius * 1.12, 0, 0, Math.PI * 2);
  visualizerContext.fill();
  visualizerContext.restore();

  visualizerContext.save();
  visualizerContext.globalAlpha = visualizerState.opacity;
  visualizerContext.translate(center.x, center.y);
  visualizerContext.rotate((visualizerState.rotation * Math.PI) / 180);
  visualizerContext.scale(scaleX, 1);
  visualizerContext.beginPath();
  visualizerContext.arc(0, 0, radius, 0, Math.PI * 2);
  visualizerContext.clip();
  visualizerContext.drawImage(wheelImage, -radius, -radius, size, size);
  visualizerContext.restore();

  visualizerContext.save();
  visualizerContext.strokeStyle = "rgba(255, 255, 255, 0.16)";
  visualizerContext.lineWidth = Math.max(1, size * 0.025);
  visualizerContext.beginPath();
  visualizerContext.ellipse(center.x, center.y, radius * scaleX, radius, 0, 0, Math.PI * 2);
  visualizerContext.stroke();
  visualizerContext.restore();
}

function drawVisualizer() {
  if (!visualizerCanvas || !visualizerContext || !baseImage) return;

  visualizerContext.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
  visualizerContext.fillStyle = "#050505";
  visualizerContext.fillRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);

  const rect = coverRect(baseImage, visualizerCanvas);
  visualizerContext.drawImage(baseImage, rect.x, rect.y, rect.width, rect.height);

  if (!wheelImage) return;
  drawWheelOverlay(visualizerState.front, visualizerState.size, visualizerState.perspective);
  drawWheelOverlay(
    visualizerState.rear,
    visualizerState.size * visualizerState.rearScale,
    visualizerState.perspective * 0.96,
  );

  visualizerContext.save();
  visualizerContext.fillStyle = "rgba(20, 184, 166, 0.92)";
  visualizerContext.strokeStyle = "rgba(255, 255, 255, 0.8)";
  ["front", "rear"].forEach((key) => {
    const point = visualizerState[key];
    visualizerContext.beginPath();
    visualizerContext.arc(point.x, point.y, 4, 0, Math.PI * 2);
    visualizerContext.fill();
    visualizerContext.beginPath();
    visualizerContext.moveTo(point.x - 10, point.y);
    visualizerContext.lineTo(point.x + 10, point.y);
    visualizerContext.moveTo(point.x, point.y - 10);
    visualizerContext.lineTo(point.x, point.y + 10);
    visualizerContext.stroke();
  });
  visualizerContext.restore();
}

async function setWheelImage(wheelId) {
  activeWheel = wheelId;
  visualizerState.wheel = wheelId;
  wheelImage = await loadImage(visualizerAssets.wheels[wheelId] || visualizerAssets.wheels.forged);
  drawVisualizer();
}

async function initVisualizer() {
  if (!visualizerCanvas || !visualizerContext) return;
  syncVisualizerControls();
  activeWheel = visualizerState.wheel || "forged";
  baseImage = await loadImage(visualizerAssets.base);
  await setWheelImage(activeWheel);
  wheelOptions.forEach((item) => item.classList.toggle("is-active", item.dataset.wheel === activeWheel));
  visualizerStatus.textContent = "Click Set Front or Set Rear, then click the wheel center on the image.";
}

function canvasPoint(event) {
  const rect = visualizerCanvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * visualizerCanvas.width,
    y: ((event.clientY - rect.top) / rect.height) * visualizerCanvas.height,
  };
}

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("nav-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

styleCards.forEach((card) => {
  card.addEventListener("click", () => {
    styleCards.forEach((item) => item.classList.remove("is-active"));
    card.classList.add("is-active");
    activeStyle = card.dataset.styleFilter || "all";
    renderProducts();
  });
});

wheelOptions.forEach((option) => {
  option.addEventListener("click", () => {
    wheelOptions.forEach((item) => item.classList.remove("is-active"));
    option.classList.add("is-active");
    setWheelImage(option.dataset.wheel || "forged").catch(() => {
      visualizerStatus.textContent = "Could not load that wheel image.";
    });
  });
});

[catalogSearch, diameterFilter, finishFilter].forEach((control) => {
  control?.addEventListener("input", renderProducts);
});

resetFilters?.addEventListener("click", () => {
  activeStyle = "all";
  styleCards.forEach((item) => item.classList.toggle("is-active", item.dataset.styleFilter === "all"));
  if (catalogSearch) catalogSearch.value = "";
  if (diameterFilter) diameterFilter.value = "all";
  if (finishFilter) finishFilter.value = "all";
  renderProducts();
});

productGrid?.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-cart]");
  const viewButton = event.target.closest("[data-view-product]");
  if (addButton) addToCart(addButton.dataset.addCart);
  if (viewButton) openProduct(viewButton.dataset.viewProduct);
});

cartItems?.addEventListener("click", (event) => {
  const minus = event.target.closest("[data-quantity-minus]");
  const plus = event.target.closest("[data-quantity-plus]");
  const remove = event.target.closest("[data-remove-cart]");
  if (minus) changeQuantity(minus.dataset.quantityMinus, -1);
  if (plus) changeQuantity(plus.dataset.quantityPlus, 1);
  if (remove) removeFromCart(remove.dataset.removeCart);
});

productModalBody?.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-cart]");
  if (addButton) addToCart(addButton.dataset.addCart);
});

cartOpen?.addEventListener("click", openCart);
cartClose?.addEventListener("click", closeCart);
drawerBackdrop?.addEventListener("click", closeCart);
document.querySelector("#cart-quote-link")?.addEventListener("click", closeCart);

searchOpen?.addEventListener("click", openSearch);
searchClose?.addEventListener("click", closeSearch);
globalSearch?.addEventListener("input", () => renderSearchResults(globalSearch.value));
searchResults?.addEventListener("click", (event) => {
  const productButton = event.target.closest("[data-search-product]");
  const pageLink = event.target.closest("[data-search-link]");
  if (productButton) {
    closeSearch();
    openProduct(productButton.dataset.searchProduct);
  }
  if (pageLink) closeSearch();
});

productClose?.addEventListener("click", closeProduct);
[searchOverlay, productModal].forEach((overlay) => {
  overlay?.addEventListener("click", (event) => {
    if (event.target === searchOverlay) closeSearch();
    if (event.target === productModal) closeProduct();
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!searchOverlay?.hidden) closeSearch();
  if (!productModal?.hidden) closeProduct();
  if (cartDrawer?.getAttribute("aria-hidden") === "false") closeCart();
});

carUpload?.addEventListener("change", () => {
  const file = carUpload.files?.[0];
  if (!file) return;
  if (baseImageObjectUrl) URL.revokeObjectURL(baseImageObjectUrl);
  baseImageObjectUrl = URL.createObjectURL(file);
  loadImage(baseImageObjectUrl)
    .then((image) => {
      baseImage = image;
      drawVisualizer();
      visualizerStatus.textContent = "Car uploaded. Use Set Front and Set Rear to align the wheel centers.";
    })
    .catch(() => {
      visualizerStatus.textContent = "Could not load that image. Try a JPG or PNG file.";
    });
});

[wheelSize, rearWheelScale, wheelRotation, wheelOpacity, wheelCover, wheelPerspective].forEach((control) => {
  control?.addEventListener("input", () => {
    applyVisualizerControlsToState();
    updateVisualizerOutputs();
    drawVisualizer();
  });
});

saveVisualizer?.addEventListener("click", () => {
  localStorage.setItem("sjstance-visualizer", JSON.stringify(visualizerState));
  visualizerStatus.textContent = "Wheel placement and settings saved on this device.";
});

exportVisualizer?.addEventListener("click", () => {
  if (!visualizerCanvas) return;
  const link = document.createElement("a");
  link.href = visualizerCanvas.toDataURL("image/png");
  link.download = "sj-stance-wheel-preview.png";
  link.click();
  visualizerStatus.textContent = "Preview exported as a PNG.";
});

placementButtons.forEach((button) => {
  button.addEventListener("click", () => {
    placementButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    placementMode = button.dataset.placementMode || "front";
    visualizerStatus.textContent = `Click the ${placementMode} wheel center on the image.`;
  });
});

visualizerCanvas?.addEventListener("click", (event) => {
  visualizerState[placementMode] = canvasPoint(event);
  drawVisualizer();
  visualizerStatus.textContent =
    placementMode === "front"
      ? "Front wheel center set. Switch to Set Rear and click the rear wheel center."
      : "Rear wheel center set. Adjust size, scale, rotation, and opacity until it sits cleanly.";
});

quoteForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!quoteForm.checkValidity()) {
    quoteForm.reportValidity();
    return;
  }

  const formData = Object.fromEntries(new FormData(quoteForm).entries());
  const payload = {
    ...formData,
    cart,
    visualizer: JSON.parse(localStorage.getItem("sjstance-visualizer") || "{}"),
    submittedAt: new Date().toISOString(),
  };
  localStorage.setItem("sjstance-latest-quote", JSON.stringify(payload));
  quoteStatus.textContent = "Quote request saved locally. Connect a backend or form provider to send it.";
});

renderProducts();
renderCart();
initVisualizer().catch(() => {
  visualizerStatus.textContent = "Visualizer assets could not load.";
});

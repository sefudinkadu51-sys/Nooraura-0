// Global Variables
let products = []
let cart = JSON.parse(localStorage.getItem("cart")) || []
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || []
let currentFilter = "all"
let currentSort = "default"
let currentView = "grid"
let currentPage = 1
const productsPerPage = 12
let isAdminLoggedIn = false

// Settings with complete website customization
const settings = JSON.parse(localStorage.getItem("settings")) || {
  // Basic Info
  storeName: "AURA FASHION",
  storeTagline: "Premium Collection",
  storeDescription:
    "Premium Kurta Collection celebrating traditional Indian fashion with contemporary elegance. Each piece tells a story of craftsmanship and beauty.",

  // Contact Info
  whatsappNumber: "+918780813692",
  email: "sefudinkadu@gmail.com",
  phone: "+91 8780813692",

  // Social Media Links
  instagramUrl: "https://instagram.com/aurafashion",
  facebookUrl: "https://facebook.com/aurafashion",
  pinterestUrl: "https://pinterest.com/aurafashion",
  twitterUrl: "https://twitter.com/aurafashion",
  whatsappUrl: "https://wa.me/918780813692",

  // Admin Credentials
  adminUsername: "kadusefu4@gmail.com",
  adminPassword: "sajjadkaduu",

  // Website Colors
  primaryColor: "#ff6b6b",
  secondaryColor: "#4ecdc4",
  accentColor: "#45b7d1",

  // About Section
  aboutTitle: "AURA FASHION Story",
  aboutDescription:
    "AURA FASHION represents the perfect fusion of traditional Indian craftsmanship and contemporary fashion. Our carefully curated collection of kurta sets celebrates the timeless elegance of Indian ethnic wear.",

  // Hero Section
  heroTitle: "Discover Your Elegance",
  heroSubtitle: "New Collection 2024",
  heroDescription:
    "Premium handcrafted kurta sets that blend traditional artistry with contemporary fashion. Each piece tells a story of elegance and sophistication.",
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

function initializeApp() {
  // Hide loading screen
  setTimeout(() => {
    document.getElementById("loadingScreen").classList.add("hidden")
  }, 2000)

  if (!localStorage.getItem("products")) {
    products = [] // Start with empty products array
    localStorage.setItem("products", JSON.stringify(products))
  } else {
    products = JSON.parse(localStorage.getItem("products"))
  }

  // Setup event listeners
  setupEventListeners()

  // Initialize UI
  displayProducts()
  updateCartUI()
  updateWishlistUI()
  updateWebsiteContent()
  animateCounters()

  // Setup scroll effects
  setupScrollEffects()
}

// Update website content from settings
function updateWebsiteContent() {
  // Update site name and tagline
  document.getElementById("siteName").textContent = settings.storeName
  document.getElementById("siteTagline").textContent = settings.storeTagline

  // Update header contact info
  document.getElementById("headerPhone").textContent = settings.phone
  document.getElementById("headerEmail").textContent = settings.email

  // Update social media links
  document.getElementById("socialInstagram").href = settings.instagramUrl
  document.getElementById("socialFacebook").href = settings.facebookUrl
  document.getElementById("socialPinterest").href = settings.pinterestUrl
  document.getElementById("socialWhatsapp").href = settings.whatsappUrl

  // Update about section
  document.getElementById("aboutTitle").textContent = settings.aboutTitle
  document.getElementById("aboutDescription").textContent = settings.aboutDescription

  // Update contact section
  document.getElementById("contactAddress").textContent = settings.address
  document.getElementById("contactPhone").textContent = settings.phone
  document.getElementById("contactEmail").textContent = settings.email

  // Update footer
  document.getElementById("footerName").textContent = settings.storeName
  document.getElementById("footerTagline").textContent = settings.storeTagline
  document.getElementById("footerDescription").textContent = settings.storeDescription
  document.getElementById("footerAddress").textContent = settings.address
  document.getElementById("footerPhone").textContent = settings.phone
  document.getElementById("footerEmail").textContent = settings.email
  document.getElementById("copyrightName").textContent = settings.storeName

  // Update footer social links
  document.getElementById("footerInstagram").href = settings.instagramUrl
  document.getElementById("footerFacebook").href = settings.facebookUrl
  document.getElementById("footerPinterest").href = settings.pinterestUrl
  document.getElementById("footerWhatsapp").href = settings.whatsappUrl
  document.getElementById("footerTwitter").href = settings.twitterUrl

  // Update page title
  document.title = `${settings.storeName} - ${settings.storeTagline}`
}

// Event Listeners
function setupEventListeners() {
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById("mobileMenuBtn")
  const navMenu = document.getElementById("navMenu")

  mobileMenuBtn.addEventListener("click", () => {
    mobileMenuBtn.classList.toggle("active")
    navMenu.classList.toggle("active")
    document.getElementById("overlay").classList.toggle("show")
  })

  // Search functionality
  const searchInput = document.getElementById("searchInput")
  searchInput.addEventListener("input", debounce(searchProducts, 300))

  // Navigation links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      if (link.getAttribute("href").startsWith("#")) {
        e.preventDefault()
        const target = document.querySelector(link.getAttribute("href"))
        if (target) {
          target.scrollIntoView({ behavior: "smooth" })

          // Update active nav link
          document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"))
          link.classList.add("active")

          // Close mobile menu
          navMenu.classList.remove("active")
          mobileMenuBtn.classList.remove("active")
          document.getElementById("overlay").classList.remove("show")
        }
      }
    })
  })

  // Close overlays
  document.getElementById("overlay").addEventListener("click", closeAllOverlays)

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllOverlays()
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault()
      searchInput.focus()
    }
  })
}

// Scroll Effects
function setupScrollEffects() {
  const header = document.getElementById("header")
  const backToTop = document.getElementById("backToTop")

  window.addEventListener("scroll", () => {
    // Header scroll effect
    if (window.scrollY > 100) {
      header.classList.add("scrolled")
      backToTop.classList.add("show")
    } else {
      header.classList.remove("scrolled")
      backToTop.classList.remove("show")
    }

    // Update active nav link based on scroll position
    const sections = document.querySelectorAll("section[id]")
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]')

    let current = ""
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id")
      }
    })

    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active")
      }
    })
  })
}

// Utility Functions
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

function showNotification(message, type = "success") {
  const container = document.getElementById("notificationContainer")
  const notification = document.createElement("div")
  notification.className = `notification ${type}`

  const icons = {
    success: "fas fa-check-circle",
    error: "fas fa-exclamation-circle",
    warning: "fas fa-exclamation-triangle",
    info: "fas fa-info-circle",
  }

  notification.innerHTML = `
        <i class="notification-icon ${icons[type]}</i>
        <div>
            <strong>${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
            <p>${message}</p>
        </div>
    `

  container.appendChild(notification)

  setTimeout(() => notification.classList.add("show"), 100)

  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => container.removeChild(notification), 300)
  }, 4000)
}

function animateCounters() {
  const counters = document.querySelectorAll("[data-count]")

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target
        const target = Number.parseInt(counter.getAttribute("data-count"))
        let current = 0
        const increment = target / 100

        const updateCounter = () => {
          if (current < target) {
            current += increment
            counter.textContent = Math.ceil(current)
            requestAnimationFrame(updateCounter)
          } else {
            counter.textContent = target
          }
        }

        updateCounter()
        observer.unobserve(counter)
      }
    })
  })

  counters.forEach((counter) => observer.observe(counter))
}

// Product Functions
function displayProducts() {
  const grid = document.getElementById("productsGrid")
  const filteredProducts = getFilteredProducts()
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const productsToShow = filteredProducts.slice(startIndex, endIndex)

  grid.innerHTML = ""
  grid.className = `products-grid ${currentView === "list" ? "list-view" : ""}`

  if (productsToShow.length === 0) {
    grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem;">
                <i class="fas fa-search" style="font-size: 4rem; color: var(--gray-400); margin-bottom: 1rem;"></i>
                <h3 style="margin-bottom: 1rem; color: var(--gray-600);">No products found</h3>
                <p style="color: var(--gray-500);">Try adjusting your search or filter criteria</p>
            </div>
        `
    return
  }

  productsToShow.forEach((product) => {
    const productCard = createProductCard(product)
    grid.appendChild(productCard)
  })

  updatePagination(filteredProducts.length)
}

function createProductCard(product) {
  const card = document.createElement("div")
  card.className = "product-card"
  card.onclick = () => openProductModal(product.id)

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0

  card.innerHTML = `
        <div class="product-image">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ""}
            <div class="product-actions">
                <button class="product-action-btn" onclick="event.stopPropagation(); toggleWishlistItem(${product.id})" title="Add to Wishlist">
                    <i class="fas fa-heart ${wishlist.find((item) => item.id === product.id) ? "text-red-500" : ""}"></i>
                </button>
                <button class="product-action-btn" onclick="event.stopPropagation(); quickView(${product.id})" title="Quick View">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="product-action-btn" onclick="event.stopPropagation(); shareProduct(${product.id})" title="Share">
                    <i class="fas fa-share-alt"></i>
                </button>
            </div>
            ${
              product.image
                ? `<img src="${product.image}" alt="${product.name}" loading="lazy">`
                : `<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--gray-400);">
                        <i class="fas fa-image" style="font-size: 3rem;"></i>
                    </div>`
            }
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-rating">
                <div class="stars">${generateStars(product.rating)}</div>
                <span class="rating-text">(${product.reviews} reviews)</span>
            </div>
            <div class="product-price">
                <span class="current-price">₹${product.price.toLocaleString()}</span>
                ${product.originalPrice ? `<span class="original-price">₹${product.originalPrice.toLocaleString()}</span>` : ""}
                ${discount > 0 ? `<span class="discount-badge">${discount}% OFF</span>` : ""}
            </div>
            <div class="product-sizes">
                ${product.sizes
                  .map(
                    (size) =>
                      `<button class="size-btn" onclick="event.stopPropagation(); selectSize(this, '${size}')">${size}</button>`,
                  )
                  .join("")}
            </div>
            <div class="product-buttons">
                <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                    <i class="fas fa-shopping-bag"></i> Add to Cart
                </button>
                <button class="whatsapp-order" onclick="event.stopPropagation(); whatsappOrder(${product.id})">
                    <i class="fab fa-whatsapp"></i>
                </button>
            </div>
        </div>
    `

  return card
}

function generateStars(rating) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  let starsHTML = ""

  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>'
  }

  if (hasHalfStar) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>'
  }

  const emptyStars = 5 - Math.ceil(rating)
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>'
  }

  return starsHTML
}

function getFilteredProducts() {
  let filtered = products

  // Apply category filter
  if (currentFilter !== "all") {
    filtered = filtered.filter((product) => product.category === currentFilter)
  }

  // Apply sorting
  switch (currentSort) {
    case "price-low":
      filtered.sort((a, b) => a.price - b.price)
      break
    case "price-high":
      filtered.sort((a, b) => b.price - a.price)
      break
    case "name":
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
    case "rating":
      filtered.sort((a, b) => b.rating - a.rating)
      break
    case "newest":
      filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
      break
    default:
      // Default sorting
      break
  }

  return filtered
}

function filterProducts(category) {
  currentFilter = category
  currentPage = 1

  // Update active filter tab
  document.querySelectorAll(".filter-tab").forEach((tab) => tab.classList.remove("active"))
  event.target.classList.add("active")

  displayProducts()
}

function sortProducts(sortType) {
  currentSort = sortType
  displayProducts()
}

function changeView(viewType) {
  currentView = viewType

  // Update active view button
  document.querySelectorAll(".view-btn").forEach((btn) => btn.classList.remove("active"))
  event.target.classList.add("active")

  displayProducts()
}

function searchProducts() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase().trim()

  if (searchTerm === "") {
    displayProducts()
    return
  }

  const searchResults = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.fabric.toLowerCase().includes(searchTerm),
  )

  displaySearchResults(searchResults)
}

function displaySearchResults(results) {
  const grid = document.getElementById("productsGrid")
  grid.innerHTML = ""

  if (results.length === 0) {
    grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem;">
                <i class="fas fa-search" style="font-size: 4rem; color: var(--gray-400); margin-bottom: 1rem;"></i>
                <h3 style="margin-bottom: 1rem; color: var(--gray-600);">No products found</h3>
                <p style="color: var(--gray-500);">Try different keywords or browse our categories</p>
            </div>
        `
    document.getElementById("pagination").innerHTML = ""
    return
  }

  results.forEach((product) => {
    const productCard = createProductCard(product)
    grid.appendChild(productCard)
  })

  document.getElementById("pagination").innerHTML = ""
}

function updatePagination(totalProducts) {
  const pagination = document.getElementById("pagination")
  const totalPages = Math.ceil(totalProducts / productsPerPage)

  if (totalPages <= 1) {
    pagination.innerHTML = ""
    return
  }

  let paginationHTML = ""

  // Previous button
  if (currentPage > 1) {
    paginationHTML += `
            <button class="page-btn" onclick="changePage(${currentPage - 1})">
                <i class="fas fa-chevron-left"></i> Previous
            </button>
        `
  }

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      paginationHTML += `<button class="page-btn active">${i}</button>`
    } else if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
      paginationHTML += `<button class="page-btn" onclick="changePage(${i})">${i}</button>`
    } else if (i === currentPage - 3 || i === currentPage + 3) {
      paginationHTML += `<span style="padding: 0.8rem;">...</span>`
    }
  }

  // Next button
  if (currentPage < totalPages) {
    paginationHTML += `
            <button class="page-btn" onclick="changePage(${currentPage + 1})">
                Next <i class="fas fa-chevron-right"></i>
            </button>
        `
  }

  pagination.innerHTML = paginationHTML
}

function changePage(page) {
  currentPage = page
  displayProducts()
  scrollToProducts()
}

function scrollToProducts() {
  document.getElementById("products").scrollIntoView({ behavior: "smooth" })
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

// Product Modal
function openProductModal(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  const modal = document.getElementById("productModal")
  const detail = document.getElementById("productDetail")

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0

  detail.innerHTML = `
        <div class="product-detail-grid">
            <div class="product-detail-images">
                <div class="main-image" id="mainImage">
                    ${
                      product.image
                        ? `<img src="${product.image}" alt="${product.name}">`
                        : `<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--gray-400);">
                                <i class="fas fa-image" style="font-size: 4rem;"></i>
                            </div>`
                    }
                </div>
                <div class="thumbnail-images">
                    ${
                      product.images
                        ? product.images
                            .map(
                              (img, index) => `
                                <div class="thumbnail ${index === 0 ? "active" : ""}" onclick="changeMainImage('${img}', this)">
                                    <img src="${img}" alt="Product image ${index + 1}">
                                </div>
                            `,
                            )
                            .join("")
                        : ""
                    }
                </div>
            </div>
            
            <div class="product-detail-info">
                <h1>${product.name}</h1>
                
                <div class="product-detail-rating">
                    <div class="stars">${generateStars(product.rating)}</div>
                    <span class="rating-text">${product.rating}★ (${product.reviews} reviews)</span>
                </div>
                
                <div class="product-detail-price">
                    <span class="detail-current-price">₹${product.price.toLocaleString()}</span>
                    ${product.originalPrice ? `<span class="detail-original-price">₹${product.originalPrice.toLocaleString()}</span>` : ""}
                    ${discount > 0 ? `<span class="discount-badge">${discount}% OFF</span>` : ""}
                </div>
                
                <div class="product-description">
                    <h4>Description</h4>
                    <p>${product.fullDescription || product.description}</p>
                </div>
                
                <div class="product-features">
                    <h4>Key Features</h4>
                    <ul class="features-list">
                        ${
                          product.features
                            ? product.features
                                .map(
                                  (feature) => `
                                    <li><i class="fas fa-check"></i> ${feature}</li>
                                `,
                                )
                                .join("")
                            : ""
                        }
                    </ul>
                </div>
                
                <div class="size-selection">
                    <h4>Select Size</h4>
                    <div class="detail-sizes">
                        ${product.sizes
                          .map(
                            (size) => `
                            <button class="detail-size-btn" onclick="selectDetailSize(this, '${size}')">${size}</button>
                        `,
                          )
                          .join("")}
                    </div>
                </div>
                
                <div class="product-actions-detail">
                    <button class="detail-add-cart" onclick="addToCartFromDetail(${product.id})">
                        <i class="fas fa-shopping-bag"></i> Add to Cart
                    </button>
                    <button class="detail-whatsapp" onclick="whatsappOrderFromDetail(${product.id})">
                        <i class="fab fa-whatsapp"></i> WhatsApp Order
                    </button>
                </div>
            </div>
        </div>
    `

  modal.classList.add("show")
  document.body.style.overflow = "hidden"
}

function closeProductModal() {
  document.getElementById("productModal").classList.remove("show")
  document.body.style.overflow = "auto"
}

function changeMainImage(imageSrc, thumbnail) {
  document.getElementById("mainImage").innerHTML = `<img src="${imageSrc}" alt="Product image">`

  // Update active thumbnail
  document.querySelectorAll(".thumbnail").forEach((thumb) => thumb.classList.remove("active"))
  thumbnail.classList.add("active")
}

function selectSize(button, size) {
  // Remove selected class from siblings
  button.parentNode.querySelectorAll(".size-btn").forEach((btn) => btn.classList.remove("selected"))
  button.classList.add("selected")
}

function selectDetailSize(button, size) {
  document.querySelectorAll(".detail-size-btn").forEach((btn) => btn.classList.remove("selected"))
  button.classList.add("selected")
}

function quickView(productId) {
  openProductModal(productId)
}

function shareProduct(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  if (navigator.share) {
    navigator.share({
      title: product.name,
      text: product.description,
      url: window.location.href,
    })
  } else {
    // Fallback - copy to clipboard
    navigator.clipboard.writeText(`${product.name} - ${window.location.href}`)
    showNotification("Product link copied to clipboard!", "success")
  }
}

// Cart Functions
function addToCart(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  const productCard = event.target.closest(".product-card")
  const selectedSizeBtn = productCard.querySelector(".size-btn.selected")

  if (!selectedSizeBtn) {
    showNotification("Please select a size", "warning")
    return
  }

  const selectedSize = selectedSizeBtn.textContent

  // Check if item already exists in cart
  const existingItem = cart.find((item) => item.id === productId && item.size === selectedSize)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity: 1,
      image: product.image,
    })
  }

  updateCartUI()
  saveCart()
  showNotification(`${product.name} added to cart!`, "success")
}

function addToCartFromDetail(productId) {
  const selectedSizeBtn = document.querySelector(".detail-size-btn.selected")

  if (!selectedSizeBtn) {
    showNotification("Please select a size", "warning")
    return
  }

  const selectedSize = selectedSizeBtn.textContent
  const product = products.find((p) => p.id === productId)

  const existingItem = cart.find((item) => item.id === productId && item.size === selectedSize)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity: 1,
      image: product.image,
    })
  }

  updateCartUI()
  saveCart()
  showNotification(`${product.name} added to cart!`, "success")
  closeProductModal()
}

function updateCartUI() {
  const cartCount = document.getElementById("cartCount")
  const cartContent = document.getElementById("cartContent")
  const cartTotal = document.getElementById("cartTotal")

  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  cartCount.textContent = totalItems
  cartCount.style.display = totalItems > 0 ? "flex" : "none"

  // Update cart content
  if (cart.length === 0) {
    cartContent.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--gray-500);">
                <i class="fas fa-shopping-bag" style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                <h3 style="margin-bottom: 1rem;">Your cart is empty</h3>
                <p style="margin-bottom: 2rem;">Add some beautiful kurtas to get started</p>
                <button class="btn btn-primary" onclick="toggleCart(); scrollToProducts();">Continue Shopping</button>
            </div>
        `
    cartTotal.textContent = "0"
  } else {
    cartContent.innerHTML = cart
      .map(
        (item) => `
            <div class="cart-item">
                <div class="cart-item-image">
                    ${item.image ? `<img src="${item.image}" alt="${item.name}">` : '<i class="fas fa-image"></i>'}
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
                    <div class="cart-item-size">Size: ${item.size}</div>
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, '${item.size}', ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, '${item.size}', ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="remove-item" onclick="removeFromCart(${item.id}, '${item.size}')" title="Remove item">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `,
      )
      .join("")

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    cartTotal.textContent = total.toLocaleString()
  }
}

function updateQuantity(productId, size, newQuantity) {
  if (newQuantity <= 0) {
    removeFromCart(productId, size)
    return
  }

  const item = cart.find((item) => item.id === productId && item.size === size)
  if (item) {
    item.quantity = newQuantity
    updateCartUI()
    saveCart()
  }
}

function removeFromCart(productId, size) {
  cart = cart.filter((item) => !(item.id === productId && item.size === size))
  updateCartUI()
  saveCart()
  showNotification("Item removed from cart", "info")
}

function clearCart() {
  if (cart.length === 0) return

  if (confirm("Are you sure you want to clear your cart?")) {
    cart = []
    updateCartUI()
    saveCart()
    showNotification("Cart cleared", "info")
  }
}

function toggleCart() {
  const cartSidebar = document.getElementById("cartSidebar")
  const overlay = document.getElementById("overlay")

  cartSidebar.classList.toggle("open")
  overlay.classList.toggle("show")
  document.body.style.overflow = cartSidebar.classList.contains("open") ? "hidden" : "auto"
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart))
}

function checkout() {
  if (cart.length === 0) {
    showNotification("Your cart is empty", "warning")
    return
  }

  // Simulate checkout process
  showNotification("Order placed successfully! Thank you for shopping with us.", "success")
  cart = []
  updateCartUI()
  saveCart()
  toggleCart()
}

// Wishlist Functions
function toggleWishlistItem(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  const existingIndex = wishlist.findIndex((item) => item.id === productId)

  if (existingIndex > -1) {
    wishlist.splice(existingIndex, 1)
    showNotification("Removed from wishlist", "info")
  } else {
    wishlist.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
    showNotification("Added to wishlist!", "success")
  }

  updateWishlistUI()
  saveWishlist()
  displayProducts() // Refresh to update heart icons
}

function updateWishlistUI() {
  const wishlistCount = document.getElementById("wishlistCount")
  const wishlistContent = document.getElementById("wishlistContent")

  // Update wishlist count
  wishlistCount.textContent = wishlist.length
  wishlistCount.style.display = wishlist.length > 0 ? "flex" : "none"

  // Update wishlist content
  if (wishlist.length === 0) {
    wishlistContent.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--gray-500);">
                <i class="fas fa-heart" style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                <h3 style="margin-bottom: 1rem;">Your wishlist is empty</h3>
                <p style="margin-bottom: 2rem;">Save your favorite items here</p>
                <button class="btn btn-primary" onclick="toggleWishlist(); scrollToProducts();">Browse Products</button>
            </div>
        `
  } else {
    wishlistContent.innerHTML = wishlist
      .map(
        (item) => `
            <div class="wishlist-item">
                <div class="wishlist-item-image">
                    ${item.image ? `<img src="${item.image}" alt="${item.name}">` : '<i class="fas fa-image"></i>'}
                </div>
                <div class="wishlist-item-info">
                    <div class="wishlist-item-title">${item.name}</div>
                    <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
                    <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                        <button class="btn btn-primary" style="flex: 1; padding: 0.5rem;" onclick="moveToCart(${item.id})">
                            Add to Cart
                        </button>
                        <button class="remove-item" onclick="toggleWishlistItem(${item.id})" title="Remove from wishlist">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `,
      )
      .join("")
  }
}

function moveToCart(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  // Add to cart with default size (first available size)
  const defaultSize = product.sizes[0]

  const existingItem = cart.find((item) => item.id === productId && item.size === defaultSize)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      size: defaultSize,
      quantity: 1,
      image: product.image,
    })
  }

  // Remove from wishlist
  toggleWishlistItem(productId)

  updateCartUI()
  saveCart()
  showNotification(`${product.name} moved to cart!`, "success")
}

function toggleWishlist() {
  const wishlistSidebar = document.getElementById("wishlistSidebar")
  const overlay = document.getElementById("overlay")

  wishlistSidebar.classList.toggle("open")
  overlay.classList.toggle("show")
  document.body.style.overflow = wishlistSidebar.classList.contains("open") ? "hidden" : "auto"
}

function saveWishlist() {
  localStorage.setItem("wishlist", JSON.stringify(wishlist))
}

// WhatsApp Functions
function whatsappOrder(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  const productCard = event.target.closest(".product-card")
  const selectedSizeBtn = productCard.querySelector(".size-btn.selected")

  if (!selectedSizeBtn) {
    showNotification("Please select a size", "warning")
    return
  }

  const selectedSize = selectedSizeBtn.textContent
  const message = `Hi! I want to order:

📦 ${product.name}
📏 Size: ${selectedSize}
💰 Price: ₹${product.price.toLocaleString()}

Please confirm availability and delivery details.`

  window.open(`https://wa.me/${settings.whatsappNumber.replace("+", "")}?text=${encodeURIComponent(message)}`, "_blank")
}

function whatsappOrderFromDetail(productId) {
  const selectedSizeBtn = document.querySelector(".detail-size-btn.selected")

  if (!selectedSizeBtn) {
    showNotification("Please select a size", "warning")
    return
  }

  const selectedSize = selectedSizeBtn.textContent
  const product = products.find((p) => p.id === productId)

  const message = `Hi! I want to order:

📦 ${product.name}
📏 Size: ${selectedSize}
💰 Price: ₹${product.price.toLocaleString()}

Please confirm availability and delivery details.`

  window.open(`https://wa.me/${settings.whatsappNumber.replace("+", "")}?text=${encodeURIComponent(message)}`, "_blank")
}

function whatsappCheckout() {
  if (cart.length === 0) {
    showNotification("Your cart is empty", "warning")
    return
  }

  let message = `🛍️ *New Order from ${settings.storeName}*

`
  let total = 0

  cart.forEach((item, index) => {
    message += `${index + 1}. *${item.name}*
`
    message += `   📏 Size: ${item.size}
`
    message += `   📦 Quantity: ${item.quantity}
`
    message += `   💰 Price: ₹${(item.price * item.quantity).toLocaleString()}

`
    total += item.price * item.quantity
  })

  message += `💳 *Total: ₹${total.toLocaleString()}*

`
  message += `📍 Please confirm the order and provide delivery address.
`
  message += `🚚 We'll arrange delivery within 2-3 business days.`

  window.open(`https://wa.me/${settings.whatsappNumber.replace("+", "")}?text=${encodeURIComponent(message)}`, "_blank")
}

function openWhatsApp() {
  const message = `Hi! I'm interested in your kurta collection from ${settings.storeName}. Please share more details about your latest designs and offers.`
  window.open(`https://wa.me/${settings.whatsappNumber.replace("+", "")}?text=${encodeURIComponent(message)}`, "_blank")
}

// Form Functions
function subscribeNewsletter(event) {
  event.preventDefault()
  const email = event.target.querySelector('input[type="email"]').value

  // Simulate newsletter subscription
  showNotification("Thank you for subscribing to our newsletter!", "success")
  event.target.reset()
}

function submitContactForm(event) {
  event.preventDefault()

  // Simulate form submission
  showNotification("Thank you for your message! We'll get back to you soon.", "success")
  event.target.reset()
}

// Admin Functions
function toggleUserMenu() {
  // Simple user menu toggle - can be expanded
  showNotification("User menu feature coming soon!", "info")
}

function openAdmin() {
  document.getElementById("adminModal").classList.add("show")
  document.body.style.overflow = "hidden"
}

function closeAdmin() {
  document.getElementById("adminModal").classList.remove("show")
  document.getElementById("adminLogin").style.display = "block"
  document.getElementById("adminDashboard").style.display = "none"
  document.body.style.overflow = "auto"
  isAdminLoggedIn = false
}

function adminLogin(event) {
  event.preventDefault()
  const username = document.getElementById("adminUsername").value
  const password = document.getElementById("adminPassword").value

  if (username === settings.adminUsername && password === settings.adminPassword) {
    document.getElementById("adminLogin").style.display = "none"
    document.getElementById("adminDashboard").style.display = "block"
    isAdminLoggedIn = true
    loadAdminDashboard()
    showNotification("Welcome to Admin Dashboard!", "success")
  } else {
    showNotification("Invalid credentials! Please try again.", "error")
  }
}

function adminLogout() {
  closeAdmin()
  showNotification("Admin logged out successfully", "info")
}

function switchAdminTab(tabName) {
  // Remove active class from all tabs
  document.querySelectorAll(".admin-tab").forEach((tab) => tab.classList.remove("active"))
  event.target.classList.add("active")

  loadAdminContent(tabName)
}

function loadAdminDashboard() {
  loadAdminContent("dashboard")
}

function loadAdminContent(tabName) {
  const content = document.getElementById("adminContent")

  switch (tabName) {
    case "dashboard":
      content.innerHTML = `
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">${products.length}</div>
                        <div class="stat-label">Total Products</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${Math.floor(Math.random() * 200) + 100}</div>
                        <div class="stat-label">Total Orders</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">₹${(Math.floor(Math.random() * 500000) + 200000).toLocaleString()}</div>
                        <div class="stat-label">Total Revenue</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${Math.floor(Math.random() * 150) + 50}</div>
                        <div class="stat-label">Happy Customers</div>
                    </div>
                </div>
                
                <div style="background: var(--white); padding: 2rem; border-radius: var(--radius-xl); box-shadow: var(--shadow-md); margin-top: 2rem;">
                    <h3 style="margin-bottom: 1.5rem;">Quick Actions</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                        <button class="btn btn-primary" onclick="switchAdminTab('products')">
                            <i class="fas fa-box"></i> Manage Products
                        </button>
                        <button class="btn btn-primary" onclick="addNewProduct()">
                            <i class="fas fa-plus"></i> Add New Product
                        </button>
                        <button class="btn btn-primary" onclick="exportData()">
                            <i class="fas fa-download"></i> Export Data
                        </button>
                        <button class="btn btn-primary" onclick="switchAdminTab('website')">
                            <i class="fas fa-globe"></i> Website Settings
                        </button>
                    </div>
                </div>
            `
      break

    case "products":
      content.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h3>Manage Products</h3>
                    <div>
                        <input type="text" id="adminProductSearch" placeholder="Search products..." style="padding: 0.5rem; border: 2px solid var(--gray-300); border-radius: var(--radius-md); margin-right: 1rem;">
                        <button class="btn btn-primary" onclick="addNewProduct()">
                            <i class="fas fa-plus"></i> Add Product
                        </button>
                    </div>
                </div>
                <div style="background: var(--white); border-radius: var(--radius-xl); box-shadow: var(--shadow-md); max-height: 500px; overflow-y: auto;">
                    ${products
                      .map(
                        (product) => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid var(--gray-200);">
                            <div style="flex: 1;">
                                <div style="font-weight: 600; margin-bottom: 0.3rem;">${product.name}</div>
                                <div style="color: var(--gray-600); font-size: 0.9rem;">
                                    ₹${product.price.toLocaleString()} • ${product.category} • ${product.sizes.join(", ")}
                                    ${product.badge ? ` • ${product.badge}` : ""}
                                </div>
                            </div>
                            <div style="display: flex; gap: 0.5rem;">
                                <button class="btn btn-outline" onclick="editProduct(${product.id})" style="padding: 0.5rem 1rem;">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="btn" onclick="deleteProduct(${product.id})" style="background: #dc3545; color: white; padding: 0.5rem 1rem;">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </div>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            `

      // Add search functionality
      document.getElementById("adminProductSearch").addEventListener("input", function () {
        filterAdminProducts(this.value)
      })
      break

    case "orders":
      content.innerHTML = `
                <h3 style="margin-bottom: 2rem;">Order Management</h3>
                <div style="background: var(--white); padding: 2rem; border-radius: var(--radius-xl); box-shadow: var(--shadow-md); text-align: center;">
                    <i class="fas fa-shopping-cart" style="font-size: 4rem; color: var(--gray-400); margin-bottom: 1rem;"></i>
                    <h4 style="margin-bottom: 1rem;">Order Management System</h4>
                    <p style="color: var(--gray-600); margin-bottom: 2rem;">Advanced order management features coming soon!</p>
                    <button class="btn btn-primary">
                        <i class="fas fa-plus"></i> Add Order Management
                    </button>
                </div>
            `
      break

    case "website":
      content.innerHTML = `
                <h3 style="margin-bottom: 2rem;">Website Settings</h3>
                <div style="background: var(--white); padding: 2rem; border-radius: var(--radius-xl); box-shadow: var(--shadow-md);">
                    <form onsubmit="updateWebsiteSettings(event)">
                        <div class="form-grid">
                            <div>
                                <h4 style="margin-bottom: 1rem;">Basic Information</h4>
                                <div class="form-group">
                                    <label>Store Name</label>
                                    <input type="text" id="websiteStoreName" value="${settings.storeName}" required>
                                </div>
                                <div class="form-group">
                                    <label>Store Tagline</label>
                                    <input type="text" id="websiteTagline" value="${settings.storeTagline}" required>
                                </div>
                                <div class="form-group">
                                    <label>Store Description</label>
                                    <textarea id="websiteDescription" rows="3" required>${settings.storeDescription}</textarea>
                                </div>
                                <div class="form-group">
                                    <label>About Title</label>
                                    <input type="text" id="websiteAboutTitle" value="${settings.aboutTitle}" required>
                                </div>
                                <div class="form-group">
                                    <label>About Description</label>
                                    <textarea id="websiteAboutDescription" rows="4" required>${settings.aboutDescription}</textarea>
                                </div>
                            </div>
                            <div>
                                <h4 style="margin-bottom: 1rem;">Contact Information</h4>
                                <div class="form-group">
                                    <label>WhatsApp Number</label>
                                    <input type="text" id="websiteWhatsapp" value="${settings.whatsappNumber}" required>
                                </div>
                                <div class="form-group">
                                    <label>Email Address</label>
                                    <input type="email" id="websiteEmail" value="${settings.email}" required>
                                </div>
                                <div class="form-group">
                                    <label>Phone Number</label>
                                    <input type="text" id="websitePhone" value="${settings.phone}" required>
                                </div>
                                <div class="form-group">
                                    <label>Store Address</label>
                                    <textarea id="websiteAddress" rows="3" required>${settings.address}</textarea>
                                </div>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 2rem;">
                            <i class="fas fa-save"></i> Save Website Settings
                        </button>
                    </form>
                </div>
            `
      break

    case "social":
      content.innerHTML = `
                <h3 style="margin-bottom: 2rem;">Social Media Settings</h3>
                <div style="background: var(--white); padding: 2rem; border-radius: var(--radius-xl); box-shadow: var(--shadow-md);">
                    <form onsubmit="updateSocialSettings(event)">
                        <div class="form-grid">
                            <div>
                                <h4 style="margin-bottom: 1rem;">Social Media Links</h4>
                                <div class="form-group">
                                    <label><i class="fab fa-instagram"></i> Instagram URL</label>
                                    <input type="url" id="socialInstagramUrl" value="${settings.instagramUrl}" placeholder="https://instagram.com/yourusername">
                                </div>
                                <div class="form-group">
                                    <label><i class="fab fa-facebook"></i> Facebook URL</label>
                                    <input type="url" id="socialFacebookUrl" value="${settings.facebookUrl}" placeholder="https://facebook.com/yourpage">
                                </div>
                                <div class="form-group">
                                    <label><i class="fab fa-pinterest"></i> Pinterest URL</label>
                                    <input type="url" id="socialPinterestUrl" value="${settings.pinterestUrl}" placeholder="https://pinterest.com/yourusername">
                                </div>
                            </div>
                            <div>
                                <h4 style="margin-bottom: 1rem;">Additional Links</h4>
                                <div class="form-group">
                                    <label><i class="fab fa-twitter"></i> Twitter URL</label>
                                    <input type="url" id="socialTwitterUrl" value="${settings.twitterUrl}" placeholder="https://twitter.com/yourusername">
                                </div>
                                <div class="form-group">
                                    <label><i class="fab fa-whatsapp"></i> WhatsApp URL</label>
                                    <input type="url" id="socialWhatsappUrl" value="${settings.whatsappUrl}" placeholder="https://wa.me/yourphonenumber">
                                </div>
                                <div class="form-group">
                                    <label>Social Media Bio</label>
                                    <textarea rows="3" placeholder="Short description for social media profiles">${settings.socialBio || ""}</textarea>
                                </div>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 2rem;">
                            <i class="fas fa-save"></i> Save Social Media Settings
                        </button>
                    </form>
                </div>
            `
      break

    case "settings":
      content.innerHTML = `
                <h3 style="margin-bottom: 2rem;">Admin Settings</h3>
                <div style="background: var(--white); padding: 2rem; border-radius: var(--radius-xl); box-shadow: var(--shadow-md);">
                    <form onsubmit="updateAdminSettings(event)">
                        <div class="form-grid">
                            <div>
                                <h4 style="margin-bottom: 1rem;">Admin Credentials</h4>
                                <div class="form-group">
                                    <label>Admin Username</label>
                                    <input type="text" id="settingsUsername" value="${settings.adminUsername}" required>
                                </div>
                                <div class="form-group">
                                    <label>New Password (leave blank to keep current)</label>
                                    <input type="password" id="settingsPassword" placeholder="Enter new password">
                                </div>
                                <div class="form-group">
                                    <label>Confirm New Password</label>
                                    <input type="password" id="settingsPasswordConfirm" placeholder="Confirm new password">
                                </div>
                            </div>
                            <div>
                                <h4 style="margin-bottom: 1rem;">Website Colors</h4>
                                <div class="form-group">
                                    <label>Primary Color</label>
                                    <input type="color" id="settingsPrimaryColor" value="${settings.primaryColor}">
                                </div>
                                <div class="form-group">
                                    <label>Secondary Color</label>
                                    <input type="color" id="settingsSecondaryColor" value="${settings.secondaryColor}">
                                </div>
                                <div class="form-group">
                                    <label>Accent Color</label>
                                    <input type="color" id="settingsAccentColor" value="${settings.accentColor}">
                                </div>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 2rem;">
                            <i class="fas fa-save"></i> Save Admin Settings
                        </button>
                    </form>
                </div>
            `
      break
  }
}

function addNewProduct() {
  const content = document.getElementById("adminContent")
  content.innerHTML = `
        <h3 style="margin-bottom: 2rem;">Add New Product</h3>
        <div style="background: var(--white); padding: 2rem; border-radius: var(--radius-xl); box-shadow: var(--shadow-md);">
            <form onsubmit="saveNewProduct(event)">
                <div class="form-grid">
                    <div>
                        <div class="form-group">
                            <label>Product Name</label>
                            <input type="text" id="newProductName" required placeholder="Enter product name">
                        </div>
                        <div class="form-group">
                            <label>Price (₹)</label>
                            <input type="number" id="newProductPrice" required placeholder="Enter price">
                        </div>
                        <div class="form-group">
                            <label>Original Price (₹)</label>
                            <input type="number" id="newProductOriginalPrice" placeholder="Enter original price (optional)">
                        </div>
                        <div class="form-group">
                            <label>Category</label>
                            <select id="newProductCategory" required>
                                <option value="">Select Category</option>
                                <option value="festive">Festive</option>
                                <option value="casual">Casual</option>
                                <option value="party">Party</option>
                                <option value="wedding">Wedding</option>
                                <option value="traditional">Traditional</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Badge</label>
                            <input type="text" id="newProductBadge" placeholder="New, Sale, Bestseller, etc.">
                        </div>
                    </div>
                    <div>
                        <div class="form-group">
                            <label>Sizes (comma separated)</label>
                            <input type="text" id="newProductSizes" placeholder="S,M,L,XL,XXL" required>
                        </div>
                        <div class="form-group">
                            <label>Fabric</label>
                            <input type="text" id="newProductFabric" placeholder="Cotton, Silk, etc.">
                        </div>
                        <div class="form-group">
                            <label>Product Images</label>
                            <div style="margin-bottom: 1rem;">
                                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                                    <h5 style="margin-bottom: 0.5rem; color: #28a745;">✅ Image Upload Options:</h5>
                                    <p style="margin-bottom: 0.5rem; font-size: 0.9rem;">1. <strong>Upload from device:</strong> Click "Choose Files" below</p>
                                    <p style="margin-bottom: 0.5rem; font-size: 0.9rem;">2. <strong>Use image URL:</strong> Paste direct image links in the text area</p>
                                    <p style="font-size: 0.8rem; color: #6c757d;">Note: For public websites, image URLs work best (like from Google Drive, Dropbox, or image hosting sites)</p>
                                </div>
                            </div>
                            <div class="image-upload-area" onclick="document.getElementById('productImages').click()">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <p>Click to upload images from device</p>
                                <small>You can upload multiple images (JPG, PNG, WebP)</small>
                            </div>
                            <input type="file" id="productImages" multiple accept="image/*" style="display: none;" onchange="handleImageUpload(this)">
                            
                            <div style="margin-top: 1rem;">
                                <label>Or paste image URLs (one per line):</label>
                                <textarea id="imageUrls" rows="4" placeholder="https://example.com/image1.jpg
https://example.com/image2.jpg
https://example.com/image3.jpg" style="width: 100%; padding: 0.5rem; border: 2px solid #e0e0e0; border-radius: 8px; font-family: monospace; font-size: 0.9rem;"></textarea>
                                <small style="color: #6c757d;">Tip: Use image hosting services like ImgBB, Imgur, or Google Drive public links</small>
                            </div>
                            
                            <div class="image-preview" id="imagePreview"></div>
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <textarea id="newProductDescription" rows="3" placeholder="Enter product description"></textarea>
                        </div>
                    </div>
                </div>
                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button type="submit" class="btn btn-primary" style="flex: 1;">
                        <i class="fas fa-save"></i> Save Product
                    </button>
                    <button type="button" class="btn btn-outline" onclick="switchAdminTab('products')" style="flex: 1;">
                        <i class="fas fa-arrow-left"></i> Back to Products
                    </button>
                </div>
            </form>
        </div>
    `
}

// Enhanced Image upload handler for public websites
function handleImageUpload(input) {
  const files = Array.from(input.files)
  const preview = document.getElementById("imagePreview")

  files.forEach((file, index) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const previewItem = document.createElement("div")
        previewItem.className = "image-preview-item"
        previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="Product image">
                    <button type="button" class="image-preview-remove" onclick="removeImagePreview(this)">
                        <i class="fas fa-times"></i>
                    </button>
                `
        preview.appendChild(previewItem)
      }
      reader.readAsDataURL(file)
    }
  })

  // Clear the input so same file can be selected again
  input.value = ""
}

function removeImagePreview(button) {
  button.parentElement.remove()
}

function saveNewProduct(event) {
  event.preventDefault()

  // Get uploaded images from file input
  const imageElements = document.querySelectorAll("#imagePreview img")
  const uploadedImages = Array.from(imageElements).map((img) => img.src)

  // Get images from URL textarea
  const imageUrls = document
    .getElementById("imageUrls")
    .value.split("\n")
    .map((url) => url.trim())
    .filter((url) => url.length > 0 && (url.startsWith("http://") || url.startsWith("https://")))

  // Combine both sources
  const allImages = [...uploadedImages, ...imageUrls]

  // Use placeholder if no images provided
  const finalImages = allImages.length > 0 ? allImages : [`https://picsum.photos/400/500?random=${Date.now()}`]

  const newProduct = {
    id: Math.max(...products.map((p) => p.id)) + 1,
    name: document.getElementById("newProductName").value,
    description: document.getElementById("newProductDescription").value || "Premium quality kurta set",
    fullDescription:
      document.getElementById("newProductDescription").value ||
      "This beautiful kurta set represents the perfect fusion of traditional Indian craftsmanship and contemporary fashion.",
    price: Number.parseInt(document.getElementById("newProductPrice").value),
    originalPrice: Number.parseInt(document.getElementById("newProductOriginalPrice").value) || null,
    category: document.getElementById("newProductCategory").value,
    sizes: document
      .getElementById("newProductSizes")
      .value.split(",")
      .map((s) => s.trim()),
    badge: document.getElementById("newProductBadge").value || null,
    rating: (Math.random() * 2 + 3).toFixed(1),
    reviews: Math.floor(Math.random() * 200) + 10,
    image: finalImages[0],
    images: finalImages,
    features: ["Premium Quality Fabric", "Comfortable Fit", "Easy Care", "Durable Construction"],
    fabric: document.getElementById("newProductFabric").value || "Premium Cotton",
    care: "Machine wash cold",
    featured: false,
    dateAdded: new Date(),
  }

  products.push(newProduct)
  localStorage.setItem("products", JSON.stringify(products))

  showNotification("Product added successfully! 🎉", "success")
  switchAdminTab("products")
  displayProducts() // Refresh main product display
}

function editProduct(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  const content = document.getElementById("adminContent")
  content.innerHTML = `
        <h3 style="margin-bottom: 2rem;">Edit Product</h3>
        <div style="background: var(--white); padding: 2rem; border-radius: var(--radius-xl); box-shadow: var(--shadow-md);">
            <form onsubmit="updateProduct(event, ${productId})">
                <div class="form-grid">
                    <div>
                        <div class="form-group">
                            <label>Product Name</label>
                            <input type="text" id="editProductName" value="${product.name}" required>
                        </div>
                        <div class="form-group">
                            <label>Price (₹)</label>
                            <input type="number" id="editProductPrice" value="${product.price}" required>
                        </div>
                        <div class="form-group">
                            <label>Original Price (₹)</label>
                            <input type="number" id="editProductOriginalPrice" value="${product.originalPrice || ""}">
                        </div>
                        <div class="form-group">
                            <label>Category</label>
                            <select id="editProductCategory" required>
                                <option value="festive" ${product.category === "festive" ? "selected" : ""}>Festive</option>
                                <option value="casual" ${product.category === "casual" ? "selected" : ""}>Casual</option>
                                <option value="party" ${product.category === "party" ? "selected" : ""}>Party</option>
                                <option value="wedding" ${product.category === "wedding" ? "selected" : ""}>Wedding</option>
                                <option value="traditional" ${product.category === "traditional" ? "selected" : ""}>Traditional</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Badge</label>
                            <input type="text" id="editProductBadge" value="${product.badge || ""}">
                        </div>
                    </div>
                    <div>
                        <div class="form-group">
                            <label>Sizes (comma separated)</label>
                            <input type="text" id="editProductSizes" value="${product.sizes.join(", ")}" required>
                        </div>
                        <div class="form-group">
                            <label>Fabric</label>
                            <input type="text" id="editProductFabric" value="${product.fabric || ""}">
                        </div>
                        <div class="form-group">
                            <label>Product Images</label>
                            <div style="margin-bottom: 1rem;">
                                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                                    <h5 style="margin-bottom: 0.5rem; color: #28a745;">✅ Current Images:</h5>
                                    <p style="font-size: 0.9rem; margin-bottom: 0.5rem;">You can remove existing images and add new ones</p>
                                    <p style="font-size: 0.8rem; color: #6c757d;">For public websites, image URLs work best</p>
                                </div>
                            </div>
                            <div class="image-preview" id="imagePreview">
                                ${
                                  product.images && product.images.length > 0
                                    ? product.images
                                        .map(
                                          (img, index) => `
                                    <div class="image-preview-item">
                                        <img src="${img}" alt="Product image ${index + 1}">
                                        <button type="button" class="image-preview-remove" onclick="removeImagePreview(this)">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </div>
                                `,
                                        )
                                        .join("")
                                    : product.image
                                      ? `
                                    <div class="image-preview-item">
                                        <img src="${product.image}" alt="Product image">
                                        <button type="button" class="image-preview-remove" onclick="removeImagePreview(this)">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </div>
                                `
                                      : ""
                                }
                            </div>
                            <div class="image-upload-area" onclick="document.getElementById('editProductImages').click()" style="margin-top: 1rem;">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <p>Click to upload new images from device</p>
                                <small>You can add more images or replace existing ones</small>
                            </div>
                            <input type="file" id="editProductImages" multiple accept="image/*" style="display: none;" onchange="handleImageUpload(this)">
                            
                            <div style="margin-top: 1rem;">
                                <label>Or add image URLs (one per line):</label>
                                <textarea id="editImageUrls" rows="4" placeholder="https://example.com/image1.jpg
https://example.com/image2.jpg" style="width: 100%; padding: 0.5rem; border: 2px solid #e0e0e0; border-radius: 8px; font-family: monospace; font-size: 0.9rem;"></textarea>
                                <small style="color: #6c757d;">Add new image URLs here - they will be added to existing images</small>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <textarea id="editProductDescription" rows="3">${product.description || ""}</textarea>
                        </div>
                    </div>
                </div>
                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button type="submit" class="btn btn-primary" style="flex: 1;">
                        <i class="fas fa-save"></i> Update Product
                    </button>
                    <button type="button" class="btn btn-outline" onclick="switchAdminTab('products')" style="flex: 1;">
                        <i class="fas fa-arrow-left"></i> Back to Products
                    </button>
                </div>
            </form>
        </div>
    `
}

function updateProduct(event, productId) {
  event.preventDefault()

  const productIndex = products.findIndex((p) => p.id === productId)
  if (productIndex === -1) return

  // Get current images from preview
  const imageElements = document.querySelectorAll(".image-preview img")
  const currentImages = Array.from(imageElements).map((img) => img.src)

  // Get new images from URL textarea
  const newImageUrls = document
    .getElementById("editImageUrls")
    .value.split("\n")
    .map((url) => url.trim())
    .filter((url) => url.length > 0 && (url.startsWith("http://") || url.startsWith("https://")))

  // Combine current and new images
  const allImages = [...currentImages, ...newImageUrls]

  // Keep original images if no images provided
  const finalImages = allImages.length > 0 ? allImages : products[productIndex].images
  const finalMainImage = allImages.length > 0 ? allImages[0] : products[productIndex].image

  products[productIndex] = {
    ...products[productIndex],
    name: document.getElementById("editProductName").value,
    description: document.getElementById("editProductDescription").value || products[productIndex].description,
    price: Number.parseInt(document.getElementById("editProductPrice").value),
    originalPrice: Number.parseInt(document.getElementById("editProductOriginalPrice").value) || null,
    category: document.getElementById("editProductCategory").value,
    sizes: document
      .getElementById("editProductSizes")
      .value.split(",")
      .map((s) => s.trim()),
    badge: document.getElementById("editProductBadge").value || null,
    fabric: document.getElementById("editProductFabric").value || products[productIndex].fabric,
    image: finalMainImage,
    images: finalImages,
  }

  localStorage.setItem("products", JSON.stringify(products))

  showNotification("Product updated successfully! 🎉", "success")
  switchAdminTab("products")
  displayProducts() // Refresh main product display
}

function deleteProduct(productId) {
  if (confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
    products = products.filter((p) => p.id !== productId)
    localStorage.setItem("products", JSON.stringify(products))
    showNotification("Product deleted successfully!", "success")
    switchAdminTab("products")
    displayProducts() // Refresh main product display
  }
}

function filterAdminProducts(searchTerm) {
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const container = document.querySelector("#adminContent > div:last-child")
  container.innerHTML = filteredProducts
    .map(
      (product) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid var(--gray-200);">
            <div style="flex: 1;">
                <div style="font-weight: 600; margin-bottom: 0.3rem;">${product.name}</div>
                <div style="color: var(--gray-600); font-size: 0.9rem;">
                    ₹${product.price.toLocaleString()} • ${product.category} • ${product.sizes.join(", ")}
                    ${product.badge ? ` • ${product.badge}` : ""}
                </div>
            </div>
            <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-outline" onclick="editProduct(${product.id})" style="padding: 0.5rem 1rem;">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn" onclick="deleteProduct(${product.id})" style="background: #dc3545; color: white; padding: 0.5rem 1rem;">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `,
    )
    .join("")
}

function updateWebsiteSettings(event) {
  event.preventDefault()

  settings.storeName = document.getElementById("websiteStoreName").value
  settings.storeTagline = document.getElementById("websiteTagline").value
  settings.storeDescription = document.getElementById("websiteDescription").value
  settings.aboutTitle = document.getElementById("websiteAboutTitle").value
  settings.aboutDescription = document.getElementById("websiteAboutDescription").value
  settings.whatsappNumber = document.getElementById("websiteWhatsapp").value
  settings.email = document.getElementById("websiteEmail").value
  settings.phone = document.getElementById("websitePhone").value
  settings.address = document.getElementById("websiteAddress").value

  localStorage.setItem("settings", JSON.stringify(settings))
  updateWebsiteContent()
  showNotification("Website settings updated successfully!", "success")
}

function updateSocialSettings(event) {
  event.preventDefault()

  settings.instagramUrl = document.getElementById("socialInstagramUrl").value
  settings.facebookUrl = document.getElementById("socialFacebookUrl").value
  settings.pinterestUrl = document.getElementById("socialPinterestUrl").value
  settings.twitterUrl = document.getElementById("socialTwitterUrl").value
  settings.whatsappUrl = document.getElementById("socialWhatsappUrl").value

  localStorage.setItem("settings", JSON.stringify(settings))
  updateWebsiteContent()
  showNotification("Social media settings updated successfully!", "success")
}

function updateAdminSettings(event) {
  event.preventDefault()

  const newPassword = document.getElementById("settingsPassword").value
  const confirmPassword = document.getElementById("settingsPasswordConfirm").value

  if (newPassword && newPassword !== confirmPassword) {
    showNotification("Passwords do not match!", "error")
    return
  }

  settings.adminUsername = document.getElementById("settingsUsername").value
  settings.primaryColor = document.getElementById("settingsPrimaryColor").value
  settings.secondaryColor = document.getElementById("settingsSecondaryColor").value
  settings.accentColor = document.getElementById("settingsAccentColor").value

  if (newPassword) {
    settings.adminPassword = newPassword
  }

  localStorage.setItem("settings", JSON.stringify(settings))
  showNotification("Admin settings updated successfully!", "success")
}

function exportData() {
  const data = {
    products: products,
    settings: settings,
    exportDate: new Date().toISOString(),
  }

  const dataStr = JSON.stringify(data, null, 2)
  const dataBlob = new Blob([dataStr], { type: "application/json" })

  const link = document.createElement("a")
  link.href = URL.createObjectURL(dataBlob)
  link.download = `${settings.storeName.toLowerCase().replace(/\s+/g, "-")}-data-${new Date().toISOString().split("T")[0]}.json`
  link.click()

  showNotification("Data exported successfully!", "success")
}

// Utility Functions
function closeAllOverlays() {
  document.getElementById("cartSidebar").classList.remove("open")
  document.getElementById("wishlistSidebar").classList.remove("open")
  document.getElementById("productModal").classList.remove("show")
  document.getElementById("adminModal").classList.remove("show")
  document.getElementById("overlay").classList.remove("show")
  document.getElementById("navMenu").classList.remove("active")
  document.getElementById("mobileMenuBtn").classList.remove("active")
  document.body.style.overflow = "auto"
}

// Initialize wishlist from localStorage
wishlist = JSON.parse(localStorage.getItem("wishlist")) || []

/**
 * IIFE (Immediately Invoked Function Expression)
 * Encapsula toda la lógica de la aplicación para evitar contaminar el scope global.
 */
(function () {

    // =====================
    // STATE VARIABLES
    // =====================
    let cart = JSON.parse(localStorage.getItem('caritesCart')) || [];
    let services = []; // Se llenará con la llamada a la API
    let paypalRendered = false;
    let currentServiceId = null;
    let currentPromoId = null;

    // =====================
    // DOM ELEMENT REFERENCES
    // =====================
    let hamburger, navMenu, cartIcon, floatingCart, cartModal, closeCart,
        servicesGrid, esteticaGrid, cartCount, floatingCartCount, cartItems,
        cartTotal, totalAmount, stripeBtn, paypalContainer, infoModal,
        promoModal, navbar;

    // =====================
    // INITIALIZATION
    // =====================

    /**
     * Punto de entrada principal. Espera a que el DOM esté cargado para iniciar la app.
     */
    document.addEventListener('DOMContentLoaded', initializeApp);

    /**
     * Función principal de inicialización.
     * 1. Cacha las referencias del DOM.
     * 2. Inicia todos los módulos de la aplicación.
     */
    function initializeApp() {
        // Cachear elementos del DOM
        navbar = document.getElementById('navbar');
        hamburger = document.getElementById('hamburger');
        navMenu = document.getElementById('nav-menu');
        cartIcon = document.getElementById('cart-icon');
        floatingCart = document.getElementById('floating-cart');
        cartModal = document.getElementById('cart-modal');
        closeCart = document.getElementById('close-cart');
        servicesGrid = document.getElementById('services-grid');
        esteticaGrid = document.getElementById('estetica-services');
        cartCount = document.getElementById('cart-count');
        floatingCartCount = document.getElementById('floating-cart-count');
        cartItems = document.getElementById('cart-items');
        cartTotal = document.getElementById('cart-total');
        totalAmount = document.getElementById('total-amount');
        stripeBtn = document.getElementById("stripe-btn");
        paypalContainer = document.getElementById("paypal-button-container");
        infoModal = document.getElementById("info-modal");
        promoModal = document.getElementById("promo-modal");

        // Inicializar módulos
        initMobileMenu();
        initSmoothScroll();
        initCartFunctionality();
        initPromoCarousel();
        initObservers();
        initGlobalListeners();

        // Cargar datos y UI inicial
        renderServices();
        updateCartUI();
    }

    // =====================
    // MODULE INITIALIZERS
    // =====================

    /**
     * Configura el menú de navegación móvil (hamburguesa).
     */
    function initMobileMenu() {
        if (!hamburger || !navMenu) return;

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    /**
     * Configura el desplazamiento suave para los enlaces de anclaje.
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Ajuste para el navbar fijo
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Configura los eventos para abrir/cerrar el modal del carrito.
     */
    function initCartFunctionality() {
        if (!cartIcon || !floatingCart || !closeCart || !cartModal) return;

        cartIcon.addEventListener('click', openCart);
        floatingCart.addEventListener('click', openCart);
        closeCart.addEventListener('click', closeCartModal);

        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                closeCartModal();
            }
        });

        // Asignar evento al botón de Stripe (definido en el HTML)
        // El evento onclick="checkoutStripe()" se mantiene en el HTML,
        // pero para mayor limpieza, lo asignamos aquí:
        stripeBtn.addEventListener('click', checkoutStripe);
        
        // Hacer públicas las funciones de los modales para el HTML
        window.openInfo = openInfo;
        window.closeInfo = closeInfo;
        window.openPromoModal = openPromoModal;
        window.closePromoModal = closePromoModal;
        
        // Hacer públicas las funciones del carrito para el HTML
        window.addToCart = addToCart;
        window.removeFromCart = removeFromCart;
        window.updateQuantity = updateQuantity;
        window.checkoutStripe = checkoutStripe;
    }

    /**
     * Configura el carrusel de promociones.
     */
    function initPromoCarousel() {
        const track = document.getElementById("promo-track");
        if (!track) return; // Salir si el carrusel no está en la página

        const slides = Array.from(track.children);
        const nextButton = document.getElementById("promo-next");
        const prevButton = document.getElementById("promo-prev");
        
        if (slides.length === 0) return;

        const slideWidth = slides[0].getBoundingClientRect().width;
        let currentIndex = 0;

        const moveToSlide = (targetIndex) => {
            const newSlideWidth = slides[0].getBoundingClientRect().width; // Recalcular en caso de resize
            track.style.transform = 'translateX(-' + newSlideWidth * targetIndex + 'px)';
            currentIndex = targetIndex;
        }

        nextButton.addEventListener('click', () => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= slides.length) {
                nextIndex = 0; // Vuelve al inicio
            }
            moveToSlide(nextIndex);
        });

        prevButton.addEventListener('click', () => {
            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) {
                prevIndex = slides.length - 1; // Va al final
            }
            moveToSlide(prevIndex);
        });

        window.addEventListener('resize', () => moveToSlide(currentIndex));
    }

    /**
     * Configura el Intersection Observer para animaciones de scroll.
     */
    function initObservers() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target); // Dejar de observar una vez animado
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll('.service-card, .promo-card, .contact-item');
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    /**
     * Configura listeners globales (scroll, teclado, etc.).
     */
    function initGlobalListeners() {
        // Efecto de sombra en Navbar al hacer scroll
        window.addEventListener('scroll', () => {
            if (!navbar) return;
            if (window.scrollY > 100) {
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                navbar.style.backgroundColor = '#ffffff';
                navbar.style.backdropFilter = 'none';
            }
        });

        // Cerrar modales con la tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (cartModal.classList.contains('active')) closeCartModal();
                if (infoModal.classList.contains('active')) closeInfo();
                if (promoModal.classList.contains('active')) closePromoModal();
            }
        });
        
        // Listeners para botones y overlays de modales
        document.getElementById("modal-add-cart").addEventListener("click", () => {
            if (currentServiceId) {
                addToCart(currentServiceId);
                closeInfo();
            }
        });
        
        infoModal.addEventListener("click", (e) => {
            if (e.target === infoModal) closeInfo();
        });

        document.getElementById("promo-modal-add-cart").addEventListener("click", () => {
            if (currentPromoId) {
                addToCart(currentPromoId);
                closePromoModal();
            }
        });
        
        promoModal.addEventListener("click", (e) => {
            if (e.target === promoModal) closePromoModal();
        });
    }

    // =====================
    // CORE LOGIC (SERVICES)
    // =====================

    /**
     * Obtiene los servicios desde la API y los renderiza en el DOM.
     */
    async function renderServices() {
        if (!servicesGrid || !esteticaGrid) return;

        try {
            // ¡ACTUALIZADO! Esta ruta ahora apunta a /api/services.js
            const response = await fetch("/api/services");
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            services = await response.json(); // Asigna a la variable de estado
        } catch (err) {
            console.error("No se pudieron cargar los servicios", err);
            servicesGrid.innerHTML = "<p>Error al cargar los servicios. Intente más tarde.</p>";
            return;
        }

        // Limpiar grids
        servicesGrid.innerHTML = '';
        esteticaGrid.innerHTML = '';

        // Renderizar cada servicio
        services.forEach(service => {
            const card = createServiceCard(service);
            if (service.category === "estetica") {
                esteticaGrid.appendChild(card);
            } else if (service.category === "massaggi") {
                servicesGrid.appendChild(card);
            }
        });
    }

    /**
     * Crea el elemento HTML para una tarjeta de servicio.
     * @param {object} service - El objeto del servicio
     * @returns {HTMLElement} El elemento div de la tarjeta
     */
    function createServiceCard(service) {
        const card = document.createElement('div');
        card.className = `service-card ${service.isPromo ? 'promo' : ''}`;
        card.setAttribute('onclick', `openInfo(${service.id})`);

        const highlightString = "Disponibile in locale o a domicilio";
        let descriptionHTML = `<p class="service-description">${service.description}</p>`;

        if (service.description.includes(highlightString)) {
            const mainDesc = service.description.replace(highlightString, "").trim().replace("..", ".");
            descriptionHTML = `
                <p class="service-description">${mainDesc}</p>
                <p class="service-availability">📍 ${highlightString}</p>
            `;
        }

        card.innerHTML = `
            <h3 class="service-title">${service.title}</h3>
            ${descriptionHTML}
            <div class="service-details">
                <span class="service-duration">${service.duration}</span>
                <span class="service-price">€${service.price}</span>
            </div>
            <div class="service-buttons">
                <button class="btn btn-primary" onclick="event.stopPropagation(); addToCart(${service.id})">Aggiungi al Carrello</button>
            </div>
        `;
        return card;
    }

    // =====================
    // CORE LOGIC (CART)
    // =====================

    /**
     * Añade un servicio al carrito o incrementa su cantidad.
     * @param {number} serviceId - ID del servicio a añadir.
     */
    function addToCart(serviceId) {
        const service = services.find(s => s.id === serviceId);
        if (!service) return;

        const existingItem = cart.find(item => item.id === serviceId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: service.id,
                title: service.title,
                price: service.price,
                quantity: 1
            });
        }

        saveCart();
        updateCartUI();
        showAddToCartFeedback();
    }

    /**
     * Elimina un item completamente del carrito.
     * @param {number} serviceId - ID del servicio a eliminar.
     */
    function removeFromCart(serviceId) {
        cart = cart.filter(item => item.id !== serviceId);
        saveCart();
        updateCartUI();
    }

    /**
     * Actualiza la cantidad de un item en el carrito.
     * @param {number} serviceId - ID del servicio.
     * @param {number} newQuantity - La nueva cantidad.
     */
    function updateQuantity(serviceId, newQuantity) {
        if (newQuantity <= 0) {
            removeFromCart(serviceId);
            return;
        }

        const item = cart.find(item => item.id === serviceId);
        if (item) {
            item.quantity = newQuantity;
            saveCart();
            updateCartUI();
        }
    }

    /**
     * Guarda el estado actual del carrito en localStorage.
     */
    function saveCart() {
        localStorage.setItem('caritesCart', JSON.stringify(cart));
    }

    /**
     * Actualiza todos los componentes de la UI del carrito.
     */
    function updateCartUI() {
        updateCartCount();
        renderCartItems();
        updateCartTotal();
    }

    /**
     * Actualiza el contador numérico del ícono del carrito.
     */
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        floatingCartCount.textContent = totalItems;

        const hiddenClass = 'hidden';
        if (totalItems > 0) {
            cartCount.classList.remove(hiddenClass);
            floatingCartCount.classList.remove(hiddenClass);
        } else {
            cartCount.classList.add(hiddenClass);
            floatingCartCount.classList.add(hiddenClass);
        }
    }

    /**
     * Renderiza los items dentro del modal del carrito.
     */
    function renderCartItems() {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Il carrello è vuoto</p>';
            return;
        }

        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <div class="cart-item-price">€${item.price}</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">Rimuovi</button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Calcula y muestra el total del carrito y maneja la visibilidad de los botones de pago.
     */
    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalAmount.textContent = total.toFixed(0);

        if (cart.length > 0) {
            cartTotal.style.display = 'block';
            stripeBtn.style.display = 'block';
            paypalContainer.style.display = 'block';

            // Renderiza PayPal SOLO la primera vez
            if (!paypalRendered && typeof paypal !== "undefined") {
                initPayPalButtons();
                paypalRendered = true;
            }
        } else {
            cartTotal.style.display = 'none';
            stripeBtn.style.display = 'none';
            paypalContainer.style.display = 'none';
        }
    }

    /**
     * Muestra una notificación temporal "Aggiunto al carrello!".
     */
    function showAddToCartFeedback() {
        const feedback = document.createElement('div');
        feedback.textContent = 'Aggiunto al carrello!';
        feedback.className = 'add-to-cart-feedback';
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--primary-pink);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            font-weight: 600;
            z-index: 3000;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
            animation: fadeInOut 2s ease;
        `;
        
        // Asegurar que la animación esté disponible
        const styleId = 'feedback-animation';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(feedback);

        setTimeout(() => {
            document.body.removeChild(feedback);
        }, 2000);
    }


    // =====================
    // CORE LOGIC (MODALS)
    // =====================

    /**
     * Abre el modal de información del servicio.
     * @param {number} serviceId - ID del servicio.
     */
    function openInfo(serviceId) {
        const service = services.find(s => s.id === serviceId);
        if (!service) return;

        currentServiceId = service.id;

        // Poblar datos del modal
        document.getElementById("modal-title").textContent = service.title;
        document.getElementById("modal-prezzo").textContent = "€" + service.price;
        document.getElementById("modal-desc").textContent = service.description.replace("Disponibile in locale o a domicilio.", "");
        
        const durataP = document.getElementById("modal-durata").parentNode;
        const detailsP = document.getElementById("modal-details");
        const modalImg = document.getElementById("modal-img");

        if (service.category === 'promo') {
            durataP.style.display = "none";
            detailsP.style.display = "none";
            document.getElementById("modal-desc").textContent = service.description;
        } else {
            durataP.style.display = "block";
            detailsP.style.display = "block";
            document.getElementById("modal-durata").textContent = service.duration;
            
            // Mostrar detalles (beneficios)
            detailsP.innerHTML = "";
            if (service.details && service.details.length > 0) {
                const ul = document.createElement("ul");
                service.details.forEach(detail => {
                    const li = document.createElement("li");
                    li.textContent = detail;
                    ul.appendChild(li);
                });
                detailsP.appendChild(ul);
            }
        }

        if (service.image) {
            modalImg.src = service.image; // La ruta ya viene de la API (ej: "img/promo/mi-promo.jpg")
            modalImg.alt = service.title;
            modalImg.style.display = "block";
        } else {
            modalImg.style.display = "none";
        }

        infoModal.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    /**
     * Cierra el modal de información del servicio.
     */
    function closeInfo() {
        infoModal.classList.remove("active");
        document.body.style.overflow = "auto";
        currentServiceId = null;
    }

    /**
     * Abre el modal de promoción horizontal.
     * @param {number} promoId - ID de la promoción.
     */
    function openPromoModal(promoId) {
        const promo = services.find(s => s.id === promoId);
        if (!promo) return;

        currentPromoId = promo.id;

        document.getElementById("promo-modal-title").textContent = promo.title;
        document.getElementById("promo-modal-desc").textContent = promo.description;
        document.getElementById("promo-modal-prezzo").textContent = "€" + promo.price;
        document.getElementById("promo-modal-img").src = promo.image; // La ruta ya viene de la API
        document.getElementById("promo-modal-img").alt = promo.title;

        promoModal.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    /**
     * Cierra el modal de promoción.
     */
    function closePromoModal() {
        promoModal.classList.remove("active");
        document.body.style.overflow = "auto";
        currentPromoId = null;
    }
    
    /**
     * Abre el modal del carrito.
     */
    function openCart() {
        cartModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Cierra el modal del carrito.
     */
    function closeCartModal() {
        cartModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // =====================
    // CORE LOGIC (PAYMENTS)
    // =====================

    /**
     * Inicializa los botones de PayPal.
     */
    function initPayPalButtons() {
        if (typeof paypal === "undefined" || !paypalContainer) return;

        // Limpia el contenedor antes de renderizar
        paypalContainer.innerHTML = "";

        paypal.Buttons({
            createOrder: async (data, actions) => {
                // ¡ACTUALIZADO! Apunta a la nueva función serverless
                const res = await fetch("/api/create-paypal-order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ items: cart })
                });
                const order = await res.json();
                return order.id;
            },
            onApprove: async (data, actions) => {
                // ¡ACTUALIZADO! Apunta a la nueva función serverless
                const res = await fetch(`/api/capture-paypal-order?orderID=${data.orderID}`, {
                    method: "POST"
                });
                const paymentData = await res.json();

                // Guardar datos y limpiar carrito
                localStorage.setItem("paymentData", JSON.stringify(paymentData));
                cart = [];
                saveCart();

                // Redirigir a la página de agradecimiento
                window.location.href = "thank-you.html";
            }
        }).render("#paypal-button-container");
    }

    /**
     * Redirige al checkout de Stripe.
     */
    async function checkoutStripe() {
        if (cart.length === 0) return;

        try {
            // ¡ACTUALIZADO! Apunta a la nueva función serverless
            const response = await fetch("/api/create-stripe-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: cart }),
            });

            if (!response.ok) throw new Error('Error al crear la sesión de Stripe');

            const data = await response.json();

            // Guardar datos previos al checkout (para thank-you.html)
            const paymentData = {
                orderId: data.id || "STRIPE_SESSION",
                status: "pending",
                paymentMethod: "Stripe",
                email: null,
                date: new Date(),
                total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                items: cart
            };

            localStorage.setItem("paymentData", JSON.stringify(paymentData));

            // Redirige al checkout de Stripe
            window.location.href = data.url;

        } catch (error) {
            console.error("Error en checkoutStripe:", error);
            // Aquí podrías mostrar un error al usuario
        }
    }

})(); // Fin de la IIFE
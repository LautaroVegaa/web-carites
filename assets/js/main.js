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
    // let pendingPaymentMethod = null; // ¡ELIMINADO! Ya no es necesario

    // =====================
    // DOM ELEMENT REFERENCES
    // =====================
    let hamburger, navMenu, cartIcon, floatingCart, cartModal, closeCart,
        servicesGrid, esteticaGrid, cartCount, floatingCartCount, cartItems,
        cartTotal, totalAmount, paypalContainer, infoModal,
        promoModal, navbar,
        // --- Nuevos elementos del formulario ---
        goToCheckoutBtn, customerFormModal, closeCustomerForm, customerForm,
        stripeBtn, modalityGroup,
        // --- Campos del formulario ---
        customerName, customerEmail, customerPhone;


    // =====================
    // INITIALIZATION
    // =====================

    document.addEventListener('DOMContentLoaded', initializeApp);

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
        paypalContainer = document.getElementById("paypal-button-container");
        infoModal = document.getElementById("info-modal");
        promoModal = document.getElementById("promo-modal");

        // --- Nuevos elementos cacheados ---
        goToCheckoutBtn = document.getElementById("go-to-checkout-btn");
        customerFormModal = document.getElementById("customer-form-modal");
        closeCustomerForm = document.getElementById("close-customer-form");
        customerForm = document.getElementById("customer-form");
        stripeBtn = document.getElementById("stripe-btn");
        modalityGroup = document.getElementById("modality-group");
        customerName = document.getElementById("customer-name");
        customerEmail = document.getElementById("customer-email");
        customerPhone = document.getElementById("customer-phone");

        // Inicializar módulos
        initMobileMenu();
        initSmoothScroll();
        initCartFunctionality();
        initCustomerForm(); // ¡NUEVO!
        initPromoCarousel();
        initObservers();
        initGlobalListeners();
        initPayPalButtons(); // ¡NUEVO! Se inicializa aquí

        // Cargar datos y UI inicial
        renderServices();
        updateCartUI();
    }

    // =====================
    // MODULE INITIALIZERS
    // =====================
    
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

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    function initPromoCarousel() {
        const track = document.getElementById("promo-track");
        if (!track) return; 
        const slides = Array.from(track.children);
        const nextButton = document.getElementById("promo-next");
        const prevButton = document.getElementById("promo-prev");
        if (slides.length === 0) return;
        const slideWidth = slides[0].getBoundingClientRect().width;
        let currentIndex = 0;
        const moveToSlide = (targetIndex) => {
            const newSlideWidth = slides[0].getBoundingClientRect().width; 
            track.style.transform = 'translateX(-' + newSlideWidth * targetIndex + 'px)';
            currentIndex = targetIndex;
        }
        nextButton.addEventListener('click', () => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= slides.length) {
                nextIndex = 0;
            }
            moveToSlide(nextIndex);
        });
        prevButton.addEventListener('click', () => {
            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) {
                prevIndex = slides.length - 1;
            }
            moveToSlide(prevIndex);
        });
        window.addEventListener('resize', () => moveToSlide(currentIndex));
    }

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
                    observer.unobserve(entry.target); 
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
        
        goToCheckoutBtn.addEventListener('click', openCustomerForm);

        window.openInfo = openInfo;
        window.closeInfo = closeInfo;
        window.openPromoModal = openPromoModal;
        window.closePromoModal = closePromoModal;
        window.addToCart = addToCart;
        window.removeFromCart = removeFromCart;
        window.updateQuantity = updateQuantity;
        window.checkoutStripe = checkoutStripe;
    }

    function initCustomerForm() {
        if (!customerFormModal || !closeCustomerForm || !stripeBtn) return;

        closeCustomerForm.addEventListener('click', closeCustomerFormModal);

        customerFormModal.addEventListener('click', (e) => {
            if (e.target === customerFormModal) {
                closeCustomerFormModal();
            }
        });

        stripeBtn.addEventListener('click', () => {
            if (validateCustomerForm()) {
                saveCustomerDataToLocalStorage();
                setLoadingState(stripeBtn, true);
                checkoutStripe(); 
            }
        });
    }

    function initGlobalListeners() {
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
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (cartModal.classList.contains('active')) closeCartModal();
                if (infoModal.classList.contains('active')) closeInfo();
                if (promoModal.classList.contains('active')) closePromoModal();
                if (customerFormModal.classList.contains('active')) closeCustomerFormModal();
            }
        });
        
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
    
    async function renderServices() {
        if (!servicesGrid || !esteticaGrid) return;

        try {
            const response = await fetch("/api/services");
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            services = await response.json(); 
        } catch (err) {
            console.error("No se pudieron cargar los servicios", err);
            servicesGrid.innerHTML = "<p>Error al cargar los servicios. Intente más tarde.</p>";
            return;
        }

        servicesGrid.innerHTML = '';
        esteticaGrid.innerHTML = '';

        services.forEach(service => {
            const card = createServiceCard(service);
            if (service.category === "estetica") {
                esteticaGrid.appendChild(card);
            } else if (service.category === "massaggi") {
                servicesGrid.appendChild(card);
            }
        });
    }

function createServiceCard(service) {
        const card = document.createElement('div');
        card.className = `service-card ${service.isPromo ? 'promo' : ''}`;
        
        card.addEventListener('click', () => {
            openInfo(service.id);
        });

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
                <button class="btn btn-primary">Aggiungi al Carrello</button>
            </div>
        `;

        const button = card.querySelector('.btn-primary');
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(service.id);
        });

        return card;
    }

    // =====================
    // CORE LOGIC (CART)
    // =====================
    
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

    function removeFromCart(serviceId) {
        cart = cart.filter(item => item.id !== serviceId);
        saveCart();
        updateCartUI();
    }

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

    function saveCart() {
        localStorage.setItem('caritesCart', JSON.stringify(cart));
    }
    
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

    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalAmount.textContent = total.toFixed(0);

        if (cart.length > 0) {
            cartTotal.style.display = 'block';
            goToCheckoutBtn.style.display = 'block';
        } else {
            cartTotal.style.display = 'none';
            goToCheckoutBtn.style.display = 'none';
        }
    }

    function updateCartUI() {
        renderCartItems();
        updateCartTotal();
        updateCartCount();
    }

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

    function openCart() {
        cartModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCartModal() {
        cartModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function openCustomerForm() {
        const hasDomicilioOption = cart.some(item => {
            const service = services.find(s => s.id === item.id);
            return service && service.description && service.description.includes("Disponibile in locale o a domicilio");
        });

        const hasLocaleOnlyItem = cart.some(item => {
            const service = services.find(s => s.id === item.id);
            return !service || !service.description || !service.description.includes("Disponibile in locale o a domicilio");
        });

        const radioLocale = document.getElementById('modality-local');
        const radioDomicilio = document.getElementById('modality-domicilio');
        const warningMessage = document.getElementById('modality-forced-warning');

        if (hasDomicilioOption && !hasLocaleOnlyItem) {
            modalityGroup.style.display = 'block';
            radioDomicilio.disabled = false;
            radioLocale.checked = true; 
            warningMessage.style.display = 'none';

        } else if (!hasDomicilioOption && hasLocaleOnlyItem) {
            modalityGroup.style.display = 'none';
            warningMessage.style.display = 'none';

        } else if (hasDomicilioOption && hasLocaleOnlyItem) {
            modalityGroup.style.display = 'none';
            warningMessage.style.display = 'block';
            radioLocale.checked = true;

        } else {
            modalityGroup.style.display = 'none';
            warningMessage.style.display = 'none';
        }

        customerFormModal.classList.add('active');
        closeCartModal();
        document.body.style.overflow = 'hidden';
    }

    function closeCustomerFormModal() {
        customerFormModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        setLoadingState(stripeBtn, false);
    }
    
    function validateCustomerForm() {
        let isValid = true;
        
        if (!customerName.value.trim()) {
            customerName.parentElement.classList.add('invalid');
            isValid = false;
        } else {
            customerName.parentElement.classList.remove('invalid');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!customerEmail.value.trim() || !emailRegex.test(customerEmail.value)) {
            customerEmail.parentElement.classList.add('invalid');
            isValid = false;
        } else {
            customerEmail.parentElement.classList.remove('invalid');
        }
        
        if (!customerPhone.value.trim()) {
            customerPhone.parentElement.classList.add('invalid');
            isValid = false;
        } else {
            customerPhone.parentElement.classList.remove('invalid');
        }

        return isValid;
    }
    
    function saveCustomerDataToLocalStorage() {
        const formData = new FormData(customerForm);
        const modalityValue = customerForm.querySelector('input[name="modality"]:checked').value;
        const customerData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            modality: modalityValue || 'locale',
            availability: formData.get('availability') || 'Nessuna preferenza'
        };
        localStorage.setItem('customerDetails', JSON.stringify(customerData));
    }
    
    function setLoadingState(buttonElement, isLoading) {
        if (isLoading) {
            buttonElement.classList.add('btn-loading');
            buttonElement.disabled = true;
        } else {
            buttonElement.classList.remove('btn-loading');
            buttonElement.disabled = false;
        }
    }

    function initPayPalButtons() {
        if (typeof paypal === "undefined" || !paypalContainer) return;

        paypalContainer.innerHTML = "";

        paypal.Buttons({
            onClick: (data, actions) => {
                if (!validateCustomerForm()) {
                    console.log("Formulario inválido. No se puede continuar con PayPal.");
                    return actions.reject();
                }
                saveCustomerDataToLocalStorage();
                return actions.resolve();
            },
            
            createOrder: async (data, actions) => {
                try {
                    const res = await fetch("/api/create-paypal-order", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ items: cart })
                    });
                    
                    if (!res.ok) {
                        throw new Error("Error al crear la orden de PayPal");
                    }
                    
                    const order = await res.json();
                    return order.id;
                } catch (err) {
                    console.error("Error en createOrder:", err);
                }
            },
            
            onApprove: async (data, actions) => {
                try {
                    const res = await fetch(`/api/capture-paypal-order?orderID=${data.orderID}`, {
                        method: "POST"
                    });

                    if (!res.ok) {
                        throw new Error("Error al capturar la orden de PayPal");
                    }
                    
                    const paymentData = await res.json();
                    paymentData.items = [...cart];

                    try {
                        localStorage.removeItem("emailSent");
                        localStorage.setItem("paymentData", JSON.stringify(paymentData));
                    } catch (storageError) {
                        console.error("ERRORE FATALE: Impossibile salvare paymentData in localStorage.", storageError);
                        return;
                    }
                    
                    cart = [];
                    saveCart();
                    window.location.href = "thank-you.html";

                } catch (err) {
                    console.error("Error en onApprove:", err);
                }
            },

            onError: (err) => {
                console.error("Error de PayPal SDK:", err);
            }

        }).render("#paypal-button-container");
    }

    async function checkoutStripe() {
        if (cart.length === 0) {
            setLoadingState(stripeBtn, false);
            return;
        }

        try {
            const response = await fetch("/api/create-stripe-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: cart }),
            });

            if (!response.ok) throw new Error('Error al crear la sesión de Stripe');

            const data = await response.json();

            const paymentData = {
                orderId: data.id || "STRIPE_SESSION",
                // ✅ Único cambio: usar mismo formato que PayPal
                status: "In attesa",
                paymentMethod: "Stripe",
                email: customerEmail.value,
                date: new Date(),
                total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                items: cart
            };

            try {
                localStorage.removeItem("emailSent");
                localStorage.setItem("paymentData", JSON.stringify(paymentData));
            } catch (storageError) {
                console.error("ERRORE FATALE: Impossibile salvare paymentData in localStorage.", storageError);
                setLoadingState(stripeBtn, false);
                return; 
            }

            window.location.href = data.url;

        } catch (error) {
            console.error("Error en checkoutStripe:", error);
            setLoadingState(stripeBtn, false);
        }
    }

})(); // Fin de la IIFE

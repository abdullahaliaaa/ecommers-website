/* =========================================
   1. NAVIGATION & HAMBURGER MENU
   ========================================= */
const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) {
    bar.addEventListener('click', () => { nav.classList.add('active'); });
}
if (close) {
    close.addEventListener('click', () => { nav.classList.remove('active'); });
}

/* =========================================
   2. CART & BADGE SYSTEM
   ========================================= */
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartBadge() {
    let totalItems = 0;
    cart.forEach(item => { totalItems += parseInt(item.quantity); });
    
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
        badge.innerText = totalItems;
        badge.style.display = totalItems === 0 ? 'none' : 'inline-block';
    });
}
updateCartBadge();

/* =========================================
   3. PRODUCT LOGIC (HOME, SHOP, SPRODUCT)
   ========================================= */
document.querySelectorAll('.cart').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const product = e.target.closest('.pro');
        const img = product.querySelector('img').src;
        const name = product.querySelector('.des h5').innerText;
        const price = product.querySelector('.des h4').innerText;

        const existingItem = cart.find(item => item.name === name);
        if(existingItem) { existingItem.quantity += 1; } 
        else { cart.push({ img, name, price, quantity: 1 }); }

        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = 'cart.html';
    });
});

document.querySelectorAll('.pro').forEach(card => {
    card.addEventListener('click', (e) => {
        if(e.target.classList.contains('cart') || e.target.closest('.cart')) return;
        e.preventDefault();
        const selectedProduct = {
            img: card.querySelector('img').src,
            name: card.querySelector('.des h5').innerText,
            price: card.querySelector('.des h4').innerText
        };
        localStorage.setItem('selectedProduct', JSON.stringify(selectedProduct));
        window.location.href = 'sproduct.html';
    });
});

const mainImg = document.getElementById('MainImg');
if (mainImg) {
    const product = JSON.parse(localStorage.getItem('selectedProduct'));
    if (product) {
        mainImg.src = product.img;
        document.getElementById('pro-title').innerText = product.name;
        document.getElementById('pro-price').innerText = product.price;
        const smallImgs = document.getElementsByClassName('small-img');
        for(let i = 0; i < smallImgs.length; i++){ smallImgs[i].src = product.img; }
    }
}

const singleProductBtn = document.getElementById("add-btn");
if (singleProductBtn) {
    singleProductBtn.addEventListener("click", () => {
        const name = document.querySelector(".single-pro-details h4").innerText;
        const existingItem = cart.find(item => item.name === name);
        const qty = parseInt(document.getElementById("pro-qty").value);
        
        if(existingItem) { existingItem.quantity += qty; } 
        else {
            cart.push({
                img: document.getElementById("MainImg").src,
                name: name,
                price: document.querySelector(".single-pro-details h2").innerText,
                quantity: qty
            });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = 'cart.html';
    });
}

/* =========================================
   4. CART PAGE DISPLAY & TOTALS
   ========================================= */
const cartTableBody = document.getElementById('cart-items-body');
function displayCart() {
    if(!cartTableBody) return;
    cartTableBody.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        let numericPrice = parseInt(item.price.replace('$', ''));
        let subtotal = numericPrice * item.quantity;
        total += subtotal;
        cartTableBody.innerHTML += `
            <tr>
                <td><a href="#" onclick="removeItem(${index})"><i class="far fa-times-circle"></i></a></td>
                <td><img src="${item.img}" alt=""></td>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td><input type="number" value="${item.quantity}" onchange="updateQuantity(${index}, this.value)" min="1"></td>
                <td>$${subtotal}</td>
            </tr>`;
    });
    if(document.getElementById('cart-subtotal')) document.getElementById('cart-subtotal').innerText = `$${total}`;
    if(document.getElementById('cart-total')) document.getElementById('cart-total').innerText = `$${total}`;
}

window.removeItem = (index) => {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartBadge();
};

window.updateQuantity = (index, value) => {
    cart[index].quantity = parseInt(value < 1 ? 1 : value);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartBadge();
};
displayCart();

/* =========================================
   5. TOAST, CHECKOUT & CONTACT
   ========================================= */
function showToast(message) {
    const toast = document.getElementById("toast");
    if(toast) {
        toast.innerText = message;
        toast.classList.add("show");
        setTimeout(() => { toast.classList.remove("show"); }, 3000);
    }
}

const placeOrderBtn = document.getElementById('place-order-btn');
if (placeOrderBtn) {
    let finalBill = 0;
    cart.forEach(item => { finalBill += parseInt(item.price.replace('$', '')) * item.quantity; });
    document.getElementById('checkout-total').innerHTML = `<strong>$${finalBill}</strong>`;

    placeOrderBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (cart.length === 0) {
            showToast("⚠️ Your cart is empty!");
            return;
        }
        showToast("🎉 Order Placed Successfully!");
        localStorage.removeItem('cart');
        updateCartBadge();
        setTimeout(() => { window.location.href = 'home.html'; }, 3000);
    });
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('c-email').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast("⚠️ Invalid Email!");
            return;
        }
        showToast("✅ Message Sent!");
        contactForm.reset();
    });
}

/* =========================================
   6. LOGIN & SIGNUP
   ========================================= */
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');

if (signupForm) {
    const tempEmail = localStorage.getItem('tempEmail');
    if (tempEmail) {
        document.getElementById('user-email').value = tempEmail;
        localStorage.removeItem('tempEmail'); 
    }

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userData = {
            name: document.getElementById('user-name').value,
            email: document.getElementById('user-email').value,
            pass: document.getElementById('user-pass').value
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        showToast("✅ Account Created! Login Now.");
        setTimeout(() => { window.location.href = 'login.html'; }, 2000);
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-pass').value;
        const savedData = JSON.parse(localStorage.getItem('userData'));

        if (savedData && savedData.email === email && savedData.pass === pass) {
            localStorage.setItem('isLoggedIn', 'true');
            showToast("🔓 Login Successful!");
            setTimeout(() => { window.location.href = 'home.html'; }, 2000);
        } else {
            showToast("❌ Invalid Credentials!");
        }
    });
}

/* =========================================
   7. AUTH GUARD, NAVBAR TOGGLE & ANIMATIONS
   ========================================= */
(function init() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const authLink = document.getElementById('auth-link');
    const path = window.location.pathname;

    if (isLoggedIn && authLink) {
        authLink.innerText = "Logout";
        authLink.href = "#"; 
        authLink.style.color = "#088178"; 
        authLink.addEventListener('click', (e) => {
            e.preventDefault();
            logoutUser(); 
        });
    }

    const protectedPages = ['shop.html', 'cart.html', 'checkout.html', 'sproduct.html'];
    const isProtected = protectedPages.some(page => path.includes(page));

    if (!isLoggedIn && isProtected) {
        alert("🔒 Please login first to access this page!");
        window.location.href = 'login.html';
    }

    const reveal = () => {
        document.querySelectorAll(".reveal").forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 100) {
                el.classList.add("active");
            }
        });
    };
    window.addEventListener("scroll", reveal);
    reveal(); 
})(); 

function logoutUser() {
    localStorage.removeItem('isLoggedIn'); 
    showToast("👋 Logged out! See you soon.");
    setTimeout(() => { window.location.href = 'login.html'; }, 2000);
}

/* =========================================
   8. PROFESSIONAL SCROLL EFFECTS (HERO & LOGO)
   ========================================= */
window.addEventListener("scroll", () => {
    const header = document.getElementById('header');
    const hero = document.getElementById('hero');
    const scrollVal = window.scrollY;

    if (header) {
        header.classList.toggle("sticky", scrollVal > 0);
    }

    if (hero && scrollVal < 600) {
        hero.style.backgroundPosition = `right 0 top ${25 + (scrollVal / 20)}%`;
    }
});

/* =========================================
   9. NEWSLETTER & HERO BUTTON REDIRECTS
   ========================================= */
const newsBtn = document.getElementById('news-btn');
if (newsBtn) {
    newsBtn.addEventListener('click', () => {
        const email = document.getElementById('news-email').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !emailRegex.test(email)) {
            showToast("⚠️ Please enter a valid email address!");
            return;
        }
        localStorage.setItem('tempEmail', email);
        showToast("📧 Thank you! Redirecting to Create Account...");
        setTimeout(() => { window.location.href = 'signup.html'; }, 2000);
    });
}

const heroBtn = document.getElementById('hero-btn');
if (heroBtn) {
    heroBtn.addEventListener('click', () => {
        window.location.href = 'shop.html';
    });
}
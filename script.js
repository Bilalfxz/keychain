// Loading Screen Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create loading screen element
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loading-yarn">
            <div class="yarn-ball-loading"></div>
            <div class="hook-loading"></div>
        </div>
        <div class="loading-text">CrochetByRook</div>
    `;
    
    // Add loading screen to body
    document.body.appendChild(loadingScreen);
    
    // Show loading screen for 1.5 seconds, then fade out
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        
        // Remove loading screen from DOM after fade out
        setTimeout(() => {
            if (loadingScreen.parentNode) {
                document.body.removeChild(loadingScreen);
            }
        }, 500);
    }, 1500);
    
    // Initialize other functionality after loading
    setTimeout(() => {
        initializeWebsite();
    }, 1500);
});

// Initialize all website functionality
function initializeWebsite() {
    // DOM Elements
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const buyNowButtons = document.querySelectorAll('.buy-now-btn');
    const buyModal = document.querySelector('.buy-modal');
    const closeBuyModalBtn = document.querySelector('.close-buy-modal');
    const productDetailsElement = document.querySelector('#productDetails strong');
    const productPriceElement = document.querySelector('#productPrice');
    const instagramBuyBtn = document.querySelector('#instagramBuy');
    const whatsappBuyBtn = document.querySelector('#whatsappBuy');
    const enquiryForm = document.querySelector('#enquiryForm');
    
    // Product information for modal
    let currentProduct = '';
    let currentPrice = '';
    
    // Mobile Menu Toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickOnMenuBtn = mobileMenuBtn.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnMenuBtn && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                navMenu.classList.remove('active');
                
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Buy Now Button Click Handler
    if (buyNowButtons.length > 0) {
        buyNowButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
                
                currentProduct = this.getAttribute('data-product');
                currentPrice = this.getAttribute('data-price');
                
                // Update modal content
                productDetailsElement.textContent = currentProduct;
                productPriceElement.textContent = `Rs. ${currentPrice}`;
                
                // Update Instagram link with product info
                const instagramURL = `https://instagram.com/crochetbyrook?utm_source=website&utm_medium=product_page&utm_campaign=${encodeURIComponent(currentProduct)}`;
                instagramBuyBtn.href = instagramURL;
                
                // Update WhatsApp link with product info
                const whatsappMessage = `Hi! I'm interested in purchasing: ${currentProduct} (Rs. ${currentPrice}) from your website.`;
                const whatsappURL = `https://wa.me/919876543210?text=${encodeURIComponent(whatsappMessage)}`;
                whatsappBuyBtn.href = whatsappURL;
                
                // Show modal
                buyModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
    }
    
    // Close Buy Modal
    if (closeBuyModalBtn) {
        closeBuyModalBtn.addEventListener('click', function() {
            buyModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close modal when clicking outside
    if (buyModal) {
        buyModal.addEventListener('click', function(e) {
            if (e.target === buyModal) {
                buyModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && buyModal && buyModal.classList.contains('active')) {
            buyModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Enquiry Form Submission
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            const interest = this.querySelector('select').value;
            
            // Create WhatsApp message
            let whatsappMessage = `New Enquiry from Website:\n\n`;
            whatsappMessage += `Name: ${name}\n`;
            whatsappMessage += `Email: ${email}\n`;
            if (message) whatsappMessage += `Message: ${message}\n`;
            if (interest) whatsappMessage += `Interested in: ${interest}\n`;
            whatsappMessage += `\nPlease contact them back!`;
            
            // Open WhatsApp with pre-filled message
            const whatsappURL = `https://wa.me/919876543210?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappURL, '_blank');
            
            // Show success message
            showNotification('Opening WhatsApp to send your enquiry!');
            
            // Reset form
            this.reset();
        });
    }
    
    // Add product hover animations
    addProductAnimations();
    
    // Update social links with actual information
    updateSocialLinks();
}

// Add product hover animations
function addProductAnimations() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click animation
        const buyButton = card.querySelector('.buy-now-btn');
        if (buyButton) {
            buyButton.addEventListener('mousedown', function() {
                this.style.transform = 'scale(0.95)';
            });
            
            buyButton.addEventListener('mouseup', function() {
                this.style.transform = '';
            });
            
            buyButton.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        }
    });
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ff85a2, #ff6b95);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        z-index: 1001;
        transform: translateX(100%);
        opacity: 0;
        transition: transform 0.3s, opacity 0.3s;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Update Instagram and WhatsApp links with your actual information
function updateSocialLinks() {
    // Replace these with your actual social media links
    const instagramLinks = document.querySelectorAll('a[href*="instagram.com/yourusername"]');
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me/yourphonenumber"]');
    const emailLinks = document.querySelectorAll('a[href*="mailto:crochetbyrook@gmail.com"]');
    
    // Update Instagram links
    instagramLinks.forEach(link => {
        link.href = link.href.replace('yourusername', 'crochetbyrook');
    });
    
    // Update WhatsApp links (replace with your actual number)
    whatsappLinks.forEach(link => {
        link.href = link.href.replace('yourphonenumber', '919876543210');
    });
    
    // Update email links
    emailLinks.forEach(link => {
        link.href = 'mailto:crochetbyrook@gmail.com';
    });
}

// Add CSS for notification (injected dynamically)
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ff85a2, #ff6b95);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        z-index: 1001;
        transform: translateX(100%);
        opacity: 0;
        transition: transform 0.3s, opacity 0.3s;
        max-width: 300px;
    }
`;
document.head.appendChild(notificationStyles);
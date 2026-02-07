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
            // Initialize website AFTER loading screen is removed
            initializeWebsite();
        }, 500);
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
                if (navMenu) navMenu.classList.remove('active');
                
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Buy Now Button Click Handler - FIXED INSTAGRAM LINK
    if (buyNowButtons.length > 0) {
        buyNowButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
                
                currentProduct = this.getAttribute('data-product');
                currentPrice = this.getAttribute('data-price');
                
                // Update modal content
                if (productDetailsElement) productDetailsElement.textContent = currentProduct;
                if (productPriceElement) productPriceElement.textContent = `Rs. ${currentPrice}`;
                
                // FIXED: Create proper Instagram message link
                if (instagramBuyBtn) {
                    // Instagram doesn't support direct message links with pre-filled text via URL parameters
                    // So we'll open their profile and users will need to send message manually
                    // Alternative: Use a "Contact" button instead of direct message link
                    const instagramProfileURL = `https://instagram.com/crochetbyrook`;
                    
                    // Create a fallback message for clipboard
                    const instagramMessage = `Hi! I'm interested in purchasing: ${currentProduct} for Rs. ${currentPrice} from your website.`;
                    
                    // Store the message in a data attribute for the modal instructions
                    instagramBuyBtn.setAttribute('data-message', instagramMessage);
                    instagramBuyBtn.href = instagramProfileURL;
                    
                    // Update modal instructions with product-specific message
                    updateModalInstructions(currentProduct, currentPrice);
                }
                
                // Update WhatsApp link with product info - THIS ONE WORKS
                if (whatsappBuyBtn) {
                    const whatsappMessage = `Hi! I'm interested in purchasing: ${currentProduct} (Rs. ${currentPrice}) from CrochetByRook website.`;
                    const whatsappURL = `https://wa.me/919876543210?text=${encodeURIComponent(whatsappMessage)}`;
                    whatsappBuyBtn.href = whatsappURL;
                }
                
                // Show modal
                if (buyModal) {
                    buyModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
    }
    
    // Function to update modal instructions with product info
    function updateModalInstructions(productName, price) {
        const instructionsList = document.querySelector('.buy-instructions ol');
        if (instructionsList) {
            // Update the second instruction with the product name
            const listItems = instructionsList.querySelectorAll('li');
            if (listItems.length > 1) {
                listItems[1].innerHTML = `Send us a message with: "<strong>${productName} (Rs. ${price})</strong>"`;
            }
        }
    }
    
    // Handle Instagram button click - show alert with copy message option
    if (instagramBuyBtn) {
        instagramBuyBtn.addEventListener('click', function(e) {
            const message = this.getAttribute('data-message');
            if (message) {
                // Option 1: Copy message to clipboard
                navigator.clipboard.writeText(message).then(() => {
                    showNotification('Product message copied! Paste it in your Instagram DM to @crochetbyrook');
                }).catch(err => {
                    // Option 2: Show alert with message if clipboard fails
                    alert(`Please send this message to @crochetbyrook on Instagram:\n\n"${message}"`);
                });
                
                // Still open Instagram profile
                // Continue with the default link behavior
            }
        });
    }
    
    // Close Buy Modal
    if (closeBuyModalBtn) {
        closeBuyModalBtn.addEventListener('click', function() {
            if (buyModal) {
                buyModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
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
            const name = this.querySelector('#name').value;
            const email = this.querySelector('#email').value;
            const message = this.querySelector('#message').value;
            const interest = this.querySelector('#interest').value;
            
            // Create WhatsApp message
            let whatsappMessage = `New Enquiry from CrochetByRook Website:\n\n`;
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
    
    // Add styles if not already in CSS
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #25D366;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 9999;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
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
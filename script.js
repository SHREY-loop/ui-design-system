// UI Design System JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add active state to navigation links on scroll
    const sections = document.querySelectorAll('.section');
    const navMenu = document.querySelector('.nav-menu');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Button click animations
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Form validation and interaction
    const formInputs = document.querySelectorAll('input, select, textarea');
    
    formInputs.forEach(input => {
        // Add focus effects
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            
            // Basic validation
            if (this.value.trim() === '') {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
            }
        });
        
        // Real-time validation for text inputs
        if (input.type === 'text' || input.tagName === 'TEXTAREA') {
            input.addEventListener('input', function() {
                if (this.value.trim() !== '') {
                    this.classList.remove('error');
                }
            });
        }
    });

    // Progress bar animation
    const progressBars = document.querySelectorAll('.progress-bar');
    
    const animateProgressBars = () => {
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    };

    // Animate progress bars when they come into view
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgressBars();
                progressObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const progressSection = document.querySelector('#components');
    if (progressSection) {
        progressObserver.observe(progressSection);
    }

    // Color swatch interaction
    const colorSwatches = document.querySelectorAll('.color-swatch');
    
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', function() {
            const color = getComputedStyle(this).backgroundColor;
            const colorInfo = this.nextElementSibling.querySelector('p').textContent;
            
            // Create a temporary notification
            showNotification(`Copied ${colorInfo} to clipboard!`, 'success');
            
            // Copy color to clipboard (if supported)
            if (navigator.clipboard) {
                navigator.clipboard.writeText(colorInfo);
            }
        });
        
        // Add hover effect
        swatch.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.cursor = 'pointer';
        });
        
        swatch.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Add CSS for notifications
    const notificationStyles = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 8px;
            padding: 1rem 1.5rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 1000;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-success {
            border-left: 4px solid #10b981;
        }
        
        .notification-info {
            border-left: 4px solid #3b82f6;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255,255,255,0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .focused {
            transform: translateY(-2px);
        }
        
        .error {
            border-color: #ef4444 !important;
        }
        
        .nav-link.active {
            color: var(--primary);
            font-weight: 600;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = notificationStyles;
    document.head.appendChild(styleSheet);

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any open modals or notifications
            const notifications = document.querySelectorAll('.notification');
            notifications.forEach(notification => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            });
        }
    });

    // Accessibility improvements
    const interactiveElements = document.querySelectorAll('button, input, select, textarea, .color-swatch');
    
    interactiveElements.forEach(element => {
        if (!element.getAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
        }
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    console.log('UI Design System loaded successfully! 🎨');
}); 
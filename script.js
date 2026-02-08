/* ============================================
   YEARBOOK 2026 - ANIMATION SCRIPT
   Using GSAP for high-quality animations
   ============================================ */

// ============================================
// DOM ELEMENTS
// ============================================
const intro = document.getElementById('intro');
const introLine1 = document.getElementById('introLine1');
const introLine2 = document.getElementById('introLine2');
const cameraFlash = document.getElementById('cameraFlash');
const mainContent = document.getElementById('mainContent');
const invitationCard = document.getElementById('invitationCard');
const ctaButton = document.getElementById('ctaButton');
const cursor = document.querySelector('.cursor');

// Thank You Modal Elements
const thankYouOverlay = document.getElementById('thankYouOverlay');
const thankYouModal = document.getElementById('thankYouModal');
const rippleEffect = document.getElementById('rippleEffect');
const modalClose = document.getElementById('modalClose');

// ============================================
// CONFIGURATION
// ============================================
const config = {
    typewriterSpeed: 0.06,      // Speed per character
    pauseDuration: 1,           // Pause between lines (seconds)
    flashDuration: 0.1,         // Flash peak duration
    flashFadeDuration: 0.5,     // Flash fade out duration
    introFadeDuration: 0.8,     // Intro fade out duration
    cardEntranceDuration: 1.2,  // Card float up duration
    parallaxIntensity: 15,      // Max rotation degrees for parallax
    mobileBreakpoint: 768       // Disable parallax below this width
};

// Text content for typewriter
const textLines = {
    line1: "Thanh xuân không phải là thời gian...",
    line2: "...Thanh xuân là cảm xúc."
};

// ============================================
// AUDIO PLACEHOLDER
// Uncomment when you have audio files ready
// ============================================
/*
const notificationSound = document.getElementById('notificationSound');

function playNotificationSound() {
    if (notificationSound) {
        notificationSound.currentTime = 0;
        notificationSound.play().catch(e => console.log('Audio play failed:', e));
    }
}
*/

// ============================================
// GSAP PLUGINS REGISTRATION
// ============================================
gsap.registerPlugin(TextPlugin);

// ============================================
// PHASE 1: INTRO ANIMATION TIMELINE
// ============================================
function createIntroTimeline() {
    const tl = gsap.timeline({
        onComplete: showMainContent
    });

    // Show cursor
    tl.to(cursor, {
        opacity: 1,
        duration: 0.1,
        onStart: () => cursor.classList.add('active')
    });

    // Typewriter effect for line 1
    tl.to(introLine1, {
        duration: textLines.line1.length * config.typewriterSpeed,
        text: textLines.line1,
        ease: "none"
    });

    // Pause between lines
    tl.to({}, { duration: config.pauseDuration });

    // Typewriter effect for line 2
    tl.to(introLine2, {
        duration: textLines.line2.length * config.typewriterSpeed,
        text: textLines.line2,
        ease: "none"
    });

    // Small pause before flash
    tl.to({}, { duration: 0.5 });

    // Hide cursor before flash
    tl.to(cursor, {
        opacity: 0,
        duration: 0.1,
        onComplete: () => cursor.classList.remove('active')
    });

    // Camera flash effect (instant white)
    tl.to(cameraFlash, {
        opacity: 1,
        duration: config.flashDuration,
        ease: "power4.in"
    });

    // Flash fade out
    tl.to(cameraFlash, {
        opacity: 0,
        duration: config.flashFadeDuration,
        ease: "power2.out"
    });

    // Fade out intro section
    tl.to(intro, {
        opacity: 0,
        duration: config.introFadeDuration,
        ease: "power2.inOut"
    });

    return tl;
}

// ============================================
// PHASE 2: MAIN CONTENT REVEAL
// ============================================
function showMainContent() {
    // Hide intro completely
    intro.style.display = 'none';

    // Show main content using GSAP to override inline styles
    gsap.to(mainContent, {
        opacity: 1,
        visibility: 'visible',
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
            animateCardEntrance();
            initParallax();
        }
    });
}

function animateCardEntrance() {
    gsap.set(invitationCard, {
        opacity: 0,
        y: 80,
        scale: 0.95
    });

    gsap.to(invitationCard, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: config.cardEntranceDuration,
        ease: "power3.out"
    });

    const cardElements = invitationCard.querySelectorAll(
        '.senior-badge, .card-header, .card-title, .school-name, .class-name, .ornamental-divider, .card-intro, .divider, .card-action, .detail-item, .cta-button'
    );

    gsap.from(cardElements, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.08,
        delay: 0.3,
        ease: "power2.out"
    });
}

// ============================================
// PARALLAX EFFECT
// ============================================
function initParallax() {
    if (window.innerWidth < config.mobileBreakpoint) return;
    document.addEventListener('mousemove', handleMouseMove);
}

function handleMouseMove(e) {
    if (window.innerWidth < config.mobileBreakpoint) return;

    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    const xPos = (clientX - innerWidth / 2) / (innerWidth / 2);
    const yPos = (clientY - innerHeight / 2) / (innerHeight / 2);

    const rotateY = xPos * config.parallaxIntensity;
    const rotateX = -yPos * config.parallaxIntensity;

    gsap.to(invitationCard, {
        rotateY: rotateY,
        rotateX: rotateX,
        transformPerspective: 1000,
        duration: 0.5,
        ease: "power2.out"
    });
}

document.addEventListener('mouseleave', () => {
    gsap.to(invitationCard, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5,
        ease: "power2.out"
    });
});

// ============================================
// PHASE 3: THANK YOU MODAL INTERACTION
// ============================================

// Button click handler - opens Thank You Modal
ctaButton.addEventListener('click', (e) => {
    // Disable button to prevent multiple clicks
    ctaButton.disabled = true;
    ctaButton.style.opacity = '0.5';
    ctaButton.style.cursor = 'default';

    // Get button position for ripple effect
    const buttonRect = ctaButton.getBoundingClientRect();
    const rippleX = buttonRect.left + buttonRect.width / 2;
    const rippleY = buttonRect.top + buttonRect.height / 2;

    // Create ripple effect from button position
    createRippleEffect(rippleX, rippleY);

    // Play notification sound (uncomment when audio is ready)
    // playNotificationSound();

    // Show overlay with blur after ripple starts
    setTimeout(() => {
        thankYouOverlay.classList.add('active');
    }, 200);

    // Show modal after overlay
    setTimeout(() => {
        thankYouModal.classList.add('active');
    }, 600);
});

// Create ripple effect at specified position
function createRippleEffect(x, y) {
    const size = Math.max(window.innerWidth, window.innerHeight) * 0.5;
    rippleEffect.style.width = size + 'px';
    rippleEffect.style.height = size + 'px';
    rippleEffect.style.left = (x - size / 2) + 'px';
    rippleEffect.style.top = (y - size / 2) + 'px';

    rippleEffect.classList.add('animate');

    setTimeout(() => {
        rippleEffect.classList.remove('animate');
    }, 1000);
}

// Close modal function
function closeThankYouModal() {
    thankYouModal.classList.remove('active');

    setTimeout(() => {
        thankYouOverlay.classList.remove('active');
    }, 300);

    setTimeout(() => {
        ctaButton.disabled = false;
        ctaButton.style.opacity = '1';
        ctaButton.style.cursor = 'pointer';
    }, 600);
}

// Close button click handler
if (modalClose) {
    modalClose.addEventListener('click', closeThankYouModal);
}

// Close modal when clicking overlay (outside the card)
if (thankYouOverlay) {
    thankYouOverlay.addEventListener('click', (e) => {
        if (e.target === thankYouOverlay) {
            closeThankYouModal();
        }
    });
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && thankYouModal.classList.contains('active')) {
        closeThankYouModal();
    }
});

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    gsap.set(mainContent, { opacity: 0, visibility: 'hidden' });
    gsap.set(introLine1, { text: '' });
    gsap.set(introLine2, { text: '' });

    setTimeout(() => {
        createIntroTimeline();
    }, 500);
});

// ============================================
// HANDLE RESIZE
// ============================================
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (window.innerWidth < config.mobileBreakpoint) {
            gsap.set(invitationCard, {
                rotateX: 0,
                rotateY: 0
            });
        }
    }, 250);
});

// Game-like features for poetry collection
let poemsRead = 0;
const totalPoems = 12;
let readPoems = new Set();
const achievements = {
    first: { unlocked: false, message: "First Poem Read!" },
    quarter: { unlocked: false, message: "25% Complete - Poetry Enthusiast!" },
    half: { unlocked: false, message: "50% Complete - Poetry Lover!" },
    threeQuarter: { unlocked: false, message: "75% Complete - Poetry Master!" },
    all: { unlocked: false, message: "100% Complete - Poetry Legend!" },
    nature: { unlocked: false, message: "Nature Theme Complete!" },
    love: { unlocked: false, message: "Love Theme Complete!" },
    reflection: { unlocked: false, message: "Reflection Theme Complete!" },
    dreams: { unlocked: false, message: "Dreams Theme Complete!" }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Clear localStorage to reset progress
    localStorage.removeItem('poemsRead');
    localStorage.removeItem('achievements');
    
    // Reset progress counters
    poemsRead = 0;
    readPoems = new Set();
    
    initializeCards();
    updateProgress();
});

// Flip card functionality
function initializeCards() {
    const cards = document.querySelectorAll('.poem-card');
    
    cards.forEach(card => {
        const front = card.querySelector('.card-front');
        
        // Flip on click
        front.addEventListener('click', () => {
            if (!card.classList.contains('flipped')) {
                flipCard(card);
            } else {
                unflipCard(card);
            }
        });
        
        // Also allow clicking card-back to flip back
        const back = card.querySelector('.card-back');
        if (back) {
            back.addEventListener('click', () => {
                if (card.classList.contains('flipped')) {
                    unflipCard(card);
                }
            });
        }
    });
}

function flipCard(card) {
    card.classList.add('flipped');
    const poemId = card.getAttribute('data-poem-id');
    
    // Mark as read when flipped
    if (!readPoems.has(poemId)) {
        readPoems.add(poemId);
        poemsRead++;
        card.classList.add('read');
        updateProgress();
        saveProgress();
        checkAchievements();
    }
}

function unflipCard(card) {
    card.classList.remove('flipped');
}

// Progress tracking
function updateProgress() {
    const progress = (poemsRead / totalPoems) * 100;
    const progressFill = document.getElementById('progressFill');
    const poemsReadEl = document.getElementById('poemsRead');
    
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
    
    if (poemsReadEl) {
        poemsReadEl.textContent = poemsRead;
    }
}

// Achievement system
function checkAchievements() {
    const progress = (poemsRead / totalPoems) * 100;
    
    // Progress achievements
    if (poemsRead === 1 && !achievements.first.unlocked) {
        unlockAchievement('first');
    }
    if (progress >= 25 && !achievements.quarter.unlocked) {
        unlockAchievement('quarter');
    }
    if (progress >= 50 && !achievements.half.unlocked) {
        unlockAchievement('half');
    }
    if (progress >= 75 && !achievements.threeQuarter.unlocked) {
        unlockAchievement('threeQuarter');
    }
    if (progress >= 100 && !achievements.all.unlocked) {
        unlockAchievement('all');
    }
    
    // Theme achievements
    checkThemeAchievements();
}

function checkThemeAchievements() {
    const themes = ['nature', 'love', 'reflection', 'dreams'];
    
    themes.forEach(theme => {
        const themeCards = document.querySelectorAll(`[data-theme="${theme}"]`);
        let themeRead = 0;
        
        themeCards.forEach(card => {
            const poemId = card.getAttribute('data-poem-id');
            if (readPoems.has(poemId)) {
                themeRead++;
            }
        });
        
        if (themeRead === themeCards.length && !achievements[theme].unlocked) {
            unlockAchievement(theme);
        }
    });
}

function unlockAchievement(key) {
    achievements[key].unlocked = true;
    showAchievement(achievements[key].message);
}

function showAchievement(message) {
    const toast = document.getElementById('achievementToast');
    const desc = document.getElementById('achievementDesc');
    
    if (toast && desc) {
        desc.textContent = message;
        toast.classList.add('show');
        
        // Hide after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
}

// Particle effects
function initializeParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    // Create initial particles
    for (let i = 0; i < 30; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.2
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 0, 0, ${particle.opacity})`;
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function createParticles(element) {
    // Only create particles if card is not flipped (to avoid particles on full-screen)
    if (element.classList.contains('flipped')) return;
    
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.width = '6px';
        particle.style.height = '6px';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        
        const theme = element.getAttribute('data-theme');
        const colors = {
            nature: '#4a7c2a',
            love: '#c41e3a',
            reflection: '#2e5984',
            dreams: '#6a1b9a'
        };
        
        particle.style.background = colors[theme] || '#666';
        particle.style.boxShadow = `0 0 10px ${colors[theme] || '#666'}`;
        
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / 20;
        const velocity = 100 + Math.random() * 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${vx}px, ${vy}px) scale(0)`, opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => particle.remove();
    }
}

// Save/Load progress (disabled - progress resets on reload)
function saveProgress() {
    // Progress is not saved - resets on page reload
    // localStorage.setItem('poemsRead', JSON.stringify(Array.from(readPoems)));
    // localStorage.setItem('achievements', JSON.stringify(achievements));
}

function loadProgress() {
    // Progress loading disabled - always starts fresh
    // This ensures progress resets on page reload
}

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Smooth scroll for navigation links
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

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe poem cards
document.addEventListener('DOMContentLoaded', () => {
    const poemCards = document.querySelectorAll('.poem-card');
    poemCards.forEach(card => {
        const front = card.querySelector('.card-front');
        if (front) {
            front.style.opacity = '0';
            front.style.transform = 'translateY(30px)';
            front.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(front);
        }
    });
    
    // Observe theme headers
    const themeHeaders = document.querySelectorAll('.theme-header');
    themeHeaders.forEach(header => {
        observer.observe(header);
    });
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Add active class styling
const style = document.createElement('style');
style.textContent = `
    .nav-menu a.active {
        color: var(--text-primary);
    }
    .nav-menu a.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// Smooth page load
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Console message
console.log('%c📖 Poetry Collection', 'color: #1a1a1a; font-size: 20px; font-weight: bold;');
console.log('%c🎮 Game-like interactive poetry experience', 'color: #666; font-size: 14px;');
console.log('%cClick on poem cards to reveal and collect them!', 'color: #999; font-size: 12px;');

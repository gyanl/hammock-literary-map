class Slideshow {
    constructor(element) {
        // Only initialize on mobile
        if (window.innerWidth > 768) return;

        this.element = element;
        this.slides = element.getElementsByClassName("tutorial-card");
        this.currentIndex = 1; // Middle card is always index 1
        
        // Create indicator dots
        this.indicator = document.createElement("div");
        this.indicator.className = "slideshow-indicator";
        this.element.parentNode.insertBefore(this.indicator, this.element.nextSibling);
        
        for (let i = 0; i < 3; i++) {
            this.indicator.innerHTML += "<div class='dot'></div>";
        }
        this.dots = this.indicator.getElementsByClassName("dot");
        
        // Set initial state
        this.updateDots();
        this.positionSlides();

        // Add click listeners to first and last cards
        this.slides[0].addEventListener('click', () => this.moveRight());
        this.slides[2].addEventListener('click', () => this.moveLeft());

        // Touch events
        this.element.addEventListener("touchstart", this.startTouch.bind(this));
        this.element.addEventListener("touchmove", this.moveTouch.bind(this));
        this.initialX = null;
    }

    moveLeft() {
        // Animate slides left
        Array.from(this.slides).forEach(slide => {
            slide.style.transition = 'transform 0.3s ease-out';
            slide.style.transform = 'translateX(calc(-70vw - 16px))';
        });

        // After animation, reset positions
        setTimeout(() => {
            // Remove transition for instant reorder
            Array.from(this.slides).forEach(slide => {
                slide.style.transition = 'none';
            });

            // Reorder DOM elements
            this.element.appendChild(this.slides[0]);
            
            // Reset positions without animation
            this.positionSlides();

            // Update dots
            this.currentIndex = (this.currentIndex + 1) % 3;
            this.updateDots();

            // Re-enable transitions
            setTimeout(() => {
                Array.from(this.slides).forEach(slide => {
                    slide.style.transition = 'transform 0.3s ease-out';
                });
            }, 50);
        }, 300);
    }

    moveRight() {
        // Animate slides right
        Array.from(this.slides).forEach(slide => {
            slide.style.transition = 'transform 0.3s ease-out';
            slide.style.transform = 'translateX(calc(70vw + 16px))';
        });

        // After animation, reset positions
        setTimeout(() => {
            // Remove transition for instant reorder
            Array.from(this.slides).forEach(slide => {
                slide.style.transition = 'none';
            });

            // Reorder DOM elements
            this.element.insertBefore(this.slides[2], this.slides[0]);
            
            // Reset positions without animation
            this.positionSlides();

            // Update dots
            this.currentIndex = (this.currentIndex - 1 + 3) % 3;
            this.updateDots();

            // Re-enable transitions
            setTimeout(() => {
                Array.from(this.slides).forEach(slide => {
                    slide.style.transition = 'transform 0.3s ease-out';
                });
            }, 50);
        }, 300);
    }

    positionSlides() {
        // Position slides: left, center, right
        this.slides[0].style.transform = 'translateX(calc(-70vw - 16px))';
        this.slides[1].style.transform = 'translateX(0)';
        this.slides[2].style.transform = 'translateX(calc(70vw + 16px))';
    }

    updateDots() {
        Array.from(this.dots).forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    startTouch(e) {
        this.initialX = e.touches[0].clientX;
    }

    moveTouch(e) {
        if (!this.initialX) return;

        const currentX = e.touches[0].clientX;
        const diffX = this.initialX - currentX;

        // Add threshold to prevent accidental swipes
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                this.moveLeft();
            } else {
                this.moveRight();
            }
            this.initialX = null;
        }
        e.preventDefault();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    const tutorialContainer = document.getElementById('slideshow-container');
    if (tutorialContainer) {
        new Slideshow(tutorialContainer);
    }
});
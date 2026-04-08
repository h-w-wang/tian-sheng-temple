class MobileMenu {
    constructor() {
        this.isOpen = false;
        this.menu = document.getElementById('mobile-menu');
        this.overlay = document.getElementById('mobile-overlay');
    }

    toggle() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.overlay.classList.remove('hidden');
            setTimeout(() => this.overlay.classList.remove('opacity-0'), 10); 
            this.menu.classList.remove('translate-x-full'); 
        } else {
            this.overlay.classList.add('opacity-0');
            this.menu.classList.add('translate-x-full'); 
            setTimeout(() => this.overlay.classList.add('hidden'), 500); 
        }
    }

    navigate(type, target) {
        this.toggle();
        setTimeout(() => {
            if (type === 'section') window.appRouter.goToSection(target);
            if (type === 'view') window.appRouter.switchView(target);
        }, 300);
    }
}
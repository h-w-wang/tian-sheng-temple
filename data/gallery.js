class GalleryController {
    constructor() {
        this.slider = document.getElementById('gallery-slider');
        this.btnPrev = document.getElementById('btn-prev');
        this.btnNext = document.getElementById('btn-next');
        this.items = document.querySelectorAll('.gallery-item');
        
        if (this.slider) {
            this.slider.addEventListener('scroll', () => this.updateState());
            window.addEventListener('resize', () => {
                this.updatePadding();
                this.updateState();
            });
        }
    }

    updatePadding() {
        if (!this.slider || this.items.length === 0) return;
        const itemWidth = this.items[0].offsetWidth;
        const padding = (window.innerWidth - itemWidth) / 2;
        this.slider.style.paddingLeft = `${padding}px`;
        this.slider.style.paddingRight = `${padding}px`;
    }

    updateState() {
        if (!this.slider) return;
        const homeView = document.getElementById('view-home');
        if (homeView && homeView.classList.contains('hide-section')) return;

        if (this.btnPrev && this.btnNext) {
            if (this.slider.scrollLeft <= 5) { this.btnPrev.style.opacity = '0'; this.btnPrev.style.pointerEvents = 'none'; }
            else { this.btnPrev.style.opacity = '1'; this.btnPrev.style.pointerEvents = 'auto'; }
            if (this.slider.scrollLeft + this.slider.clientWidth >= this.slider.scrollWidth - 5) { this.btnNext.style.opacity = '0'; this.btnNext.style.pointerEvents = 'none'; }
            else { this.btnNext.style.opacity = '1'; this.btnNext.style.pointerEvents = 'auto'; }
        }

        const containerCenter = window.innerWidth / 2;
        let minDistance = Infinity;
        let activeIndex = 0;

        this.items.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            if (rect.width === 0) return;
            const itemCenter = rect.left + rect.width / 2;
            const distance = Math.abs(containerCenter - itemCenter);
            if (distance < minDistance) { minDistance = distance; activeIndex = index; }
        });

        this.items.forEach((item, index) => {
            const diff = Math.abs(index - activeIndex);
            item.classList.remove('scale-110', 'opacity-100', 'blur-0', 'z-20', 'scale-90', 'opacity-40', 'blur-[2px]', 'z-10', 'opacity-0');
            if (diff === 0) item.classList.add('scale-110', 'opacity-100', 'blur-0', 'z-20');
            else if (diff === 1) item.classList.add('scale-90', 'opacity-40', 'blur-[2px]', 'z-10');
            else item.classList.add('scale-90', 'opacity-0', 'z-0');
        });
    }

    slide(direction) {
        if(this.items.length === 0) return;
        const style = window.getComputedStyle(this.slider);
        const gap = parseFloat(style.gap) || 0;
        const scrollAmount = this.items[0].offsetWidth + gap; 
        this.slider.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
    updateButtons() {
        if (!this.slider || !this.btnPrev || !this.btnNext) return;

        // 計算是否在最左邊 (加上 5px 的容錯率，避免小數點運算誤差)
        const isAtStart = this.slider.scrollLeft <= 5;
        
        // 計算是否在最右邊：目前捲出的隱藏距離 + 容器本身的寬度 >= 內容的總寬度
        const isAtEnd = this.slider.scrollLeft + this.slider.clientWidth >= this.slider.scrollWidth - 5;

        // 控制左邊按鈕 (btn-prev)
        if (isAtStart) {
            // 如果在最左邊，加上隱藏標籤
            this.btnPrev.classList.add('opacity-0', 'pointer-events-none');
        } else {
            // 如果不在最左邊，拔掉隱藏標籤，讓它顯示
            this.btnPrev.classList.remove('opacity-0', 'pointer-events-none');
        }

        // 控制右邊按鈕 (btn-next)
        if (isAtEnd) {
            // 如果到底了，加上隱藏標籤
            this.btnNext.classList.add('opacity-0', 'pointer-events-none');
        } else {
            // 如果還沒到底，拔掉隱藏標籤
            this.btnNext.classList.remove('opacity-0', 'pointer-events-none');
        }
    }
}
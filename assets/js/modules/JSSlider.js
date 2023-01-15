const JSSlider = class {

    constructor(imagesSelector) {
        this.imagesSelector = imagesSelector
        this.sliderRootSelector = '.js-slider'
    }
    run() {
        this.imagesList = document.querySelectorAll(this.imagesSelector)
        this.sliderRootElement = document.querySelector(this.sliderRootSelector)

        this.initEvents();
        this.initCustomEvents();
    }


    fireCustomEvent(element, name) {
        console.log(element.className, '=>', name);
        const event = new CustomEvent(name, {
            bubbles: true,
        });
        element.dispatchEvent(event);
    }

    initEvents() {
        this.imagesList.forEach((item) => {
            item.addEventListener('click', (e) => {
                this.fireCustomEvent(e.currentTarget, 'js-slider-img-click');
            });

        });

        const navNext = this.sliderRootElement.querySelector('.js-slider__nav--next');
        if (navNext) {
            navNext.addEventListener('click', (e) => {
                this.fireCustomEvent(this.sliderRootElement, 'js-slider-img-next')
            });
        }

        const navPrev = this.sliderRootElement.querySelector('.js-slider__nav--prev');
        if (navPrev) {
            navPrev.addEventListener('click', (e) => {
                this.fireCustomEvent(this.sliderRootElement, 'js-slider-img-prev')
            });
        }

        const zoom = this.sliderRootElement.querySelector('.js-slider__zoom');
        if (zoom) {
            zoom.addEventListener('click', (e) => {
                if (e.target === e.currentTarget) {
                    this.fireCustomEvent(this.sliderRootElement, 'js-slider-close');
                }
            })
        }
    }

    initCustomEvents() {
        this.imagesList.forEach((img) => {
            img.addEventListener('js-slider-img-click', event => {
                this.onImageClick(event, this.sliderRootElement, this.imagesSelector);
            });
        });

        this.sliderRootElement.addEventListener('js-slider-img-next', this.onImageNext);
        this.sliderRootElement.addEventListener('js-slider-img-prev', this.onImagePrev);
        this.sliderRootElement.addEventListener('js-slider-close', this.onClose);
    }


    onImageClick(event) {
        this.sliderRootElement.classList.add('js-slider--active');

        const src = event.currentTarget.querySelector('img').src;
        this.sliderRootElement.querySelector('.js-slider__image').src = src;

        const groupName = event.currentTarget.dataset.sliderGroupName;
        const thumbsList = document.querySelectorAll(this.imagesSelector + '[data-slider-group-name=' + groupName + ']');
        const prototype = document.querySelector('.js-slider__thumbs-item--prototype');
        thumbsList.forEach((item) => {
            const thumbElement = prototype.cloneNode(true);
            thumbElement.classList.remove('js-slider__thumbs-item--prototype');
            const thumbImg = thumbElement.querySelector('img');
            thumbImg.src = item.querySelector('img').src;
            if (thumbImg.src === src) {
                thumbImg.classList.add('js-slider__thumbs-image--current');
            }
            document.querySelector('.js-slider__thumbs').appendChild(thumbElement);
        })
    }


    onImageNext(event) {
        console.log(this, 'onImageNext');

        const currentClassName = 'js-slider__thumbs-image--current';
        const current = this.querySelector('.' + currentClassName);

        const parentCurrent = current.parentElement;
        const nextElement = parentCurrent.nextElementSibling;
        if (nextElement && !nextElement.className.includes('js-slider__thumbs-item--prototype')) {
            const img = nextElement.querySelector('img')
            img.classList.add(currentClassName);

            this.querySelector('.js-slider__image').src = img.src;
            current.classList.remove(currentClassName);
        }
    }
    onImagePrev(event) {
        console.log(this, 'onImagePrev');

        const currentClassName = 'js-slider__thumbs-image--current';
        const current = this.querySelector('.' + currentClassName);

        const parentCurrent = current.parentElement;
        const prevElement = parentCurrent.previousElementSibling;
        if (prevElement && !prevElement.className.includes('js-slider__thumbs-item--prototype')) {
            const img = prevElement.querySelector('img')
            img.classList.add(currentClassName);

            this.querySelector('.js-slider__image').src = img.src;
            current.classList.remove(currentClassName);
        }
    }
    onClose(event) {

        event.currentTarget.classList.remove('js-slider--active');
        const thumbsList = this.querySelectorAll('.js-slider__thumbs-item:not(.js-slider__thumbs-item--prototype)');
        thumbsList.forEach(item => item.parentElement.removeChild(item));
    }
}
export default JSSlider

class Select {
   constructor(options) {
      this.options = options;
      this.$el = document.querySelector(options.selector);
      this.dataURL = options.url;

      this.#createSelect();
   }

   async #createSelect() {
      await this.#render();
      this.#setup();
   }

   async #render() {
      this.$el.innerHTML = `
      <div class="select__backdrop" data-type="backdrop"></div>
      <div class="select__input" data-type="input">
         <span class="select__input-label">${this.options.label}</span>
         <i class="fa fa-chevron-down" aria-hidden="true" data-type="arrow"></i>
      </div>
      <div class="select__items"></div>
      `;
      this.$el.classList.add('select');
   }

   #setup() {
      this.$input = this.$el.querySelector('[data-type="input"]');
      this.$backdrop = this.$el.querySelector('.select__backdrop');
      this.$items = this.$el.querySelector('.select__items');

      this.$input.addEventListener('click', this.#clickHandler.bind(this));
      this.$backdrop.addEventListener('click', this.#clickHandler.bind(this));
      this.$items.addEventListener('click', this.#clickHandler.bind(this));
   }

   async #getData(url) {
      const response = await fetch(url);
      const data = await response.json();
      return data;
   }

   #getTemplate(data) {
      const template = data.map(item => {
         return `<li class="select__item" data-type="item" data-id="${item.id}">${item.name}</li>`
      });

      this.$items.innerHTML = `<ul>${template.join('')}</ul>`;
      return;
   }

   async #clickHandler(event) {
      const { type } = event.target.dataset;
      const parentDataType = event.target.parentElement.dataset.type;

      if (type == 'input' || parentDataType == "input") {
         this.toggle();

         if (!this.$items.children[0]) {
            this.$items.innerHTML = `<img src="img/spinner.gif" style="margin-left: 40%;" width="60px" height="60px">`;
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.options.data = await this.#getData(this.dataURL);
            this.#getTemplate(this.options.data);
         }
      } else if (type == 'item') {
         const itemId = event.target.dataset.id
         const $item = this.$el.querySelector(`[data-id="${itemId}"]`);
         const $inputLabel = this.$input.querySelector('.select__input-label');
         $inputLabel.classList.add('active');

         //bgColor = bisque у выбранного элемента
         for (let item of this.$items.children[0].children) {
            item.style.backgroundColor = '';
         }
         $item.style.backgroundColor = "bisque";

         //Замена значения выбранного элемента
         if (!this.newValue) {
            this.newValue = document.createElement('span');
            this.newValue.style.cssText = "position: absolute";
         }
         this.newValue.innerHTML = $item.innerHTML;
         this.$input.appendChild(this.newValue);
         $inputLabel.style.color = "blue";

         this.close();
      } else if (type == "backdrop") {
         this.close();
      }
   }

   toggle() {
      if (this.$el.classList.contains('active')) {
         this.close();
      } else {
         this.open();
      }
   }

   open() {
      this.$el.classList.add('active');
   }

   close() {
      this.$el.classList.remove('active');
   }

   destroy() {
      this.$el.innerHTML = '';

      this.$input.removeEventListener('click', this.#clickHandler);
      this.$items.removeEventListener('click', this.#clickHandler);
      this.$backdrop.removeEventListener('click', this.#clickHandler);
      console.log('destroyed');
   }
}

const select = new Select({
   selector: '#select',
   label: 'Выберите технологию',
   url: 'https://jsonplaceholder.typicode.com/users',
   onSelect(selectedItem) { }
})

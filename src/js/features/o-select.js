const keys = {
    ENTER: 13,
    ESC: 27,
    ARROW_UP: 38,
    ARROW_DOWN: 40,
};

export default class OSelect{
    constructor({ selector, data, fxPopulate, onInputSet, onSelected = () => {}, idActive, hasImage, accessors = {
        id: "id",
        name: "name"
    } }){
        //order important
        this.accessors = accessors;
        this.hasImage = !!hasImage;

        this.selector = selector;
        this.$selector = $(selector);
        this.prepare();

        this.$img = this.$selector.find('i.o-select-img');
        this.$input = this.$selector.find('input.form-control');
        this.$placeholder = this.$selector.find('span.placeholder');
        this.$ul = this.$selector.find('ul');

        this.populate = fxPopulate;
        this.onInputSet = onInputSet;

        this.onSelected = onSelected;

        this.data = data;
        this.filtered = [...data];

        this.setSelectedItem(idActive);
        this.updateList(data);

        this.setInput();
        this.setInputListeners();
        this.setItemsListeners();
        
        this.cursor = -1;
        this.inputActive = false;

        $("body").click(e => {
            if(this.inputActive) {
                this.$placeholder.text('');
                setTimeout(() => {
                    this.setInput();
                    this.$ul.slideUp(100);
                    this.updateList(this.data);
                    e.stopPropagation();
                }, 100);
            }
        });
    }
    setData(data){
        this.data = data;
        this.filtered = [...data];
    }
    updateList(data){
        let html = [];
        html = data.map(item => {
            return this.populate(item);
        });
        this.$ul.html(html.join(''));
        // this.setItemsListeners();
    }
    setItemsListeners(){
        let self = this;
        $(document).on("click", `${this.selector} ul li`, function() {
            console.log("click");
            if($(this).hasClass('divider')) return;
            let id = $(this).data('id');
            console.log(id);
            self.setSelectedItem(id);
            self.setInput();
            self.onSelected(id); 
        });
    }
    setSelectedItem(idActive){
        this.selectedItem = this.data.filter(item => item[this.accessors.id] == idActive)[0];
        return this;
    }
    setCursor(key){
        if(key == keys.ARROW_DOWN){
            this.cursor = this.cursor != this.filtered.length ? this.cursor + 1 : this.cursor;
        }else{
            this.cursor = this.cursor != -1 ? this.cursor - 1 : this.cursor;
        }
        this.setSelectedClass();
    }
    setSelectedClass(){
        let lis = this.$ul.find('li');
        $(lis).removeClass('selected');
        if(this.cursor != -1){
            let self = this;
            $(lis[self.cursor]).addClass('selected');
            let id = $(lis[self.cursor]).data('id') || this.filtered[0][this.accessors.id];
            let item = this.data.filter(item => item[this.accessors.id] == id)[0]
            self.$placeholder.text(item[this.accessors.name]);
            self.setInput(item, true);
        }
    }
    setInputListeners() {
        this.$input.click(e => {
            if(!this.inputActive) {
                this.inputActive = true;
                this.$input.val('');
                this.$placeholder.text(this.selectedItem[this.accessors.name]);
                this.$ul.slideDown(200);
            }
            e.stopPropagation();
        });
        this.$input.keyup(e => {
            let value = e.target.value;
            if(e.which == keys.ESC){
                this.cursor = -1;
                this.$input.blur();
            }
            if(e.which == keys.ENTER){
                this.cursor = -1;
                let li = this.$ul.find('li.selected');
                if(li){
                    let id = $(li).data('id') || this.filtered[0][this.accessors.id];
                    this.setSelectedItem(id);
                    this.$input.blur();
                    setTimeout(() => {
                        this.updateList(this.data);
                        this.onSelected(id);
                    }, 300);
                }
            }
            else if(e.which == keys.ARROW_UP || e.which == keys.ARROW_DOWN){
                this.setCursor(e.which);
                this.$input.val(value);
            }else{

                if(value.trim() != ''){
                    this.cursor = 0;
                    let filtered = this.data.filter(c => c[this.accessors.name] && c[this.accessors.name].toLowerCase().startsWith(value.toLowerCase()));
                    this.filtered = filtered.length > 0 ? filtered : this.filtered;
                    this.updateList([...filtered]);
                    this.setSelectedClass(this.filtered[0]);
                    let temp = this.filtered.length > 0 ? this.filtered[0] : this.selectedItem;
                    this.$placeholder.text(temp[this.accessors.name]);
                    this.$input.val(temp[this.accessors.name].substring(0, value.length));
                    this.setInput(temp, true);
                }
                else{
                    this.cursor = -1;
                    this.updateList(this.data);
                    this.$placeholder.text(this.selectedItem[this.accessors.name]);
                    this.setInput(this.selectedItem, true);
                }

            }
            
        });
    }
    setInput(item = this.selectedItem, dontSetVal = false){
        if(!dontSetVal){
            this.$input.val(item[this.accessors.name]);
        }
        if(this.onInputSet) {
            this.onInputSet(this.$img, item[this.accessors.id]);
        }
    }
    prepare(){
        let html = this.hasImage ? '<i class="o-select-img"></i>' : '';
        html +=
            `<input type="text" class="form-control">
            <span class='placeholder'></span>
            <ul></ul>`;
        this.$selector.html(html);
    }

}
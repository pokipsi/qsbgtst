export default class FullScreenSelector {
    constructor({ $selector, data, fxPopulate, title, name, onSelected = () => {}, onCaptionSet,  hasImage, idActive, hasTop, accessors = {
        id: "id",
        name: "name",
        count: "count"
    } }) {

        this.defaultUrl = window.location.href;

        this.listOpen = false;
        this.name = name;
        // console.log(this.name, title);

        this.accessors = accessors;
        this.hasImage = hasImage;
        this.hasTop = hasTop;

        this.$selector = $selector;
        
        this.prepare();

        this.$img = $selector.find('i.fs-img');
        this.$caption = $selector.find('.fs-caption');
        this.$list = $selector.find('.fs-list');
        this.$ul = this.$list.find('ul');
        this.$close = $selector.find('.fs-close');
        this.$title = $selector.find('.fs-title');
        this.$input = $selector.find('input');

        this.populate = fxPopulate;
        this.onCaptionSet = onCaptionSet;

        this.onSelected = onSelected;
        this.data = data;
        this.filtered = this.hasTop ? { ...this.data } : [...this.data];

        this.setSelectedItem(idActive);
        this.updateList(data);

        this.setTitle(title);
        this.setCaption();
        this.addEventHandlers();
        
    }
    setSelectedItem(idActive) {
        this.idActive = idActive;
        const data = this.hasTop ? [ ...this.data.all, ...this.data.top ] : this.data;
        this.selectedItem = data.filter(item => item[this.accessors.id] == idActive)[0];
        return this;
    }
    setCaption() {
        const count = this.idActive == -1 ? '' : `(${this.selectedItem[this.accessors.count]})`;
        this.$caption.html(`${this.selectedItem[this.accessors.name]} ${count}`);
        this.onCaptionSet(this.$img, this.selectedItem[this.accessors.id]);
    }
    setTitle(title) {
        this.$title.html(title);
    }
    updateList(data) {
        this.data = data;
        let html = [];
        const all = this.hasTop ? this.data.all : this.data;
        let allItems = all.map(item => {
            return this.populate(item);
        });
        if(this.hasTop) {
            let topItems = this.data.top.map(item => {
                return this.populate(item);
            });
            html = [...topItems, ...allItems];
        }else{
            html = [...allItems];
        }
        this.$ul.html(html.join(''));
        this.setItemsListeners();
    }
    filterList(text) {
        if(text.trim()) {
            const data = this.hasTop ? this.data.all : this.data;
            let html = data
                .filter(item => item[this.accessors.name].toLowerCase().startsWith(text.toLowerCase()))
                .map(item => {
                    return this.populate(item);
                });
            this.$ul.html(html.join(''));
            this.setItemsListeners();
        } 
        else {
            this.updateList(this.data);
        }
    }
    setItemsListeners() {
        let self = this;
        this.$ul.find('li').each(function() {
            $(this).click(e => {
                if($(this).hasClass('divider')) return;
                let id = $(this).data('id');
                self.setSelectedItem(id);
                self.setCaption();
                self.closeList();
                self.onSelected(id);
                e.stopPropagation();
            });
        });;
    }
    prepare() {
        let html = this.hasImage ? '<i class="o-select-img"></i>' : '';
        html += `
            <i class="fs-img"></i>
            <div class="fs-caption"></div>
            <div class="fs-list">
                <div class="fs-header">
                    <div class="fs-title"></div>
                    <span class="fs-close">&times;</span>
                </div>
                <div class="fs-filter">
                    <input class="form-control" type="text" placeholder="Filter" />
                </div>
                <ul></ul>
            </div>
        `;
        this.$selector.html(html);
    }
    addEventHandlers() {
        this.$selector.click(e => {
            this.showList();
        });
        this.$close.click(e => {
            this.closeList();
            e.stopPropagation();
        });
        this.$input.keyup(e => {
            const text = e.target.value;
            this.filterList(text);
        });
        window.addEventListener('popstate', e => {
            const lastChunk = window.location.href.split("/").pop();
            const isFeature = lastChunk.startsWith("#feature");
            if(!isFeature) {
                this.closeList();
            } 
            else {
                const featureType = lastChunk.split(":")[1];
                if(featureType == "full-screen-selector") {
                    const name = lastChunk.split(":")[2];
                    if(name == this.name) {
                        this.showList();
                    }
                    else {
                        this.closeList(true);
                    }
                }
            }
        });
    }
    showList() {
        this.$list.fadeIn();
        $("header").addClass('d-none');
        this.$input.focus();
        this.listOpen = true;
        history.pushState(null, null, `#feature:full-screen-selector:${this.name}`);
    }
    closeList(ignoreHistory) {
        this.$list.fadeOut();
        $("header").removeClass('d-none');
        this.$input.val('');
        this.listOpen = false;
        if (!ignoreHistory) history.pushState(null, null, this.defaultUrl);
    }
}
export default class Share {
    constructor($trigger) {
        this.$backdrop = $(`<div class="share-backdrop"></div>`);
        this.$backdrop.click(() => { this.close() });
        $("body").append(this.$backdrop);
        if($trigger) {
            this.$trigger = $trigger;
            this.$trigger.click(() => this.open());
        }
        this.addToPage();
    }
    addToPage() {
        this.$backdrop.html(`
            <div class="share-options">
                <div class="item" data-type="viber">
                    <i class="fency oicon-soc viber sm" />
                    <span>Viber</span>
                </div>
                <div class="item" data-type="whatsapp">
                    <i class="fency oicon-soc whatsapp sm" />
                    <span>WhatsApp</span>
                </div>
                <div class="item" data-type="messenger">
                    <i class="fency oicon-soc messenger sm" />
                    <span>Messenger</span>
                </div>
            </div>
        `);
        $('.share-options .item').click(e => {
            const type = $(e.currentTarget).data('type');
            this[type]();
            e.stopPropagation();
        });
    }
    viber() {
        document.location.href = "viber://forward?text=" + encodeURIComponent(window.location.href);
    }
    whatsapp() {
        document.location.href = "whatsapp://send?text=" + encodeURIComponent(window.location.href);
    }
    messenger() {
        document.location.href = "fb-messenger://share?link=" + encodeURIComponent(window.location.href);
    }
    open() {
        this.$backdrop.addClass('active');
        OYO.utils.hidePageScrollbar();
    }
    close() {
        this.$backdrop.removeClass('active');
        OYO.utils.showPageScrollbar();
    }
}
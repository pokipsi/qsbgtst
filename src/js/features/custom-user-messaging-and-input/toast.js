export default class Toast {
    constructor(msg = "", onClosed = () => {}){
        this.id = `o-toast-${Date.now()}`;
        this.msg = msg;
        if(onClosed && typeof(onClosed) == 'function'){
            this.onClosed = onClosed;
        }
        else throw('Toast: onClosed is not a function');
    }
    addToPage(){
       $("body").append(`
           <div class="o-toast-holder"><div class="o-toast" id="${this.id}">${this.msg}</div></div>
       `);
    }
    
    show(){
        $('.o-toast-holder').remove();
        this.addToPage();
        $(`#${this.id}`).addClass('o-toast-action').click(() => {
            $('.o-toast-holder').remove();    
            this.onClosed();
        });
        setTimeout(() => {
            this.onClosed();
        }, 1000);
    }
}
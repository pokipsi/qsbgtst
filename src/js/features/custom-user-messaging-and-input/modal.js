
export default class Modal{
   constructor(content = "", modalType = ""){
       this.id = `o-modal-${Date.now()}`;
       this.content = content;
       this.modalType = modalType;
   }
   
   setHTML(content = ""){
       this.content = content;
   }
   
   addBackdrop(){
       $("body").append(`
           <div class="o-modal-backdrop" id="${this.id}"></div>
       `)
   }
   
   addModal(){
       $(`#${this.id}`).append(`
           <div class="o-modal ${this.modalType}">
               ${this.content}
           </div>
       `)
   }
   
   onDOMReady(){
       
   }
   
   show(){
       this.addBackdrop();
       this.addModal();
       
       this.onDOMReady();
       
       this.addEventListeners();
   }
   
   hide(){
       $(`#${this.id}`).remove();
   }
   
   addEventListeners(){
       $(`#${this.id}`).mousedown((e) => {
           this.hide();
           e.stopPropagation();
       });
       
       $(`#${this.id} .o-modal`).mousedown((e) => {
           e.stopPropagation();
       });
       
       $(`#${this.id} .o-modal`).click((e) => {
           e.stopPropagation();
       });
       
       $(`body`).keyup((e) => {
            if(e.which == 27){ //ESC
                this.hide();
            }
       });
   }
   
}


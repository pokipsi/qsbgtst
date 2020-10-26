
import Modal from './modal';

export default class ModalBasicInput extends Modal {
    constructor({
        html = "",
        onCancel,
        onConfirm,
        modalType = "",
        positiveActionLabel = OYO.labels.ok,
        negativeActionLabel = OYO.labels.cancel
    }){
        super(`
            <div class="o-controls">
                ${html}
                <div class='o-buttons'>
                    <button class='btn-cancel btn btn-light'>${negativeActionLabel}</button>
                    <button class='btn-confirm btn btn-success'>${positiveActionLabel}</button>
                </div>
            </div>`, modalType);
        
        if(onCancel && typeof(onCancel) == 'function'){
            this.onCancel = onCancel;    
        }
        else throw('ModalBasicInput: onCancel is not a function');
        if(onConfirm && typeof(onConfirm) == 'function'){
            this.onConfirm = onConfirm;    
        }
        else throw('ModalBasicInput: onConfirm is not a function');
    }
    
    addEventListeners({ignoreOnCancel, ignoreOnConfirm} = {}){
        super.addEventListeners();
        if(!ignoreOnCancel){
            $(`#${this.id} .o-controls .btn-cancel`).click(() => {
                this.onCancel();
                this.hide();
            });            
        }
        if(!ignoreOnConfirm){
            $(`#${this.id} .o-controls .btn-confirm`).click(() => {
                this.onConfirm();
                this.hide();
            });    
        }
    }
}


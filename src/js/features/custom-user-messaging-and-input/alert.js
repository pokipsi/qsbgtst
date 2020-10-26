import Modal from './modal';

export default class Alert extends Modal {
    constructor(message, fxOnConfirm = () => {}){
        super(`
            <div class="o-controls">
                <div class="o-header">${message}</div>
                <div class='o-buttons'>
                    <button class='btn-confirm btn btn-success ml-auto'>${OYO.labels.ok}</button>
                </div>
            </div>`, "o-type-alert");
        this.onConfirm = fxOnConfirm;
    }
    addEventListeners(){
        super.addEventListeners();
        $(`#${this.id} .o-controls .btn-confirm`).click(() => {
            this.onConfirm();
            this.hide();
        });
    }
}


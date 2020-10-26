
import ModalBasicInput from './input';

export default class Prompt extends ModalBasicInput {
    
    constructor(text = "", { 
        onCancel = () => {},
        onConfirm = () => {},
        defaultValue = ""
    } = {}){
        super({
            html: 
            `
                <div class="o-header">${text}</div>
                <div class="o-content">
                    <input type="text" class="form-control" value="${defaultValue}"/>
                </div>
            `,
            onCancel: onCancel,
            onConfirm: onConfirm
        });
    }
    
    onDOMReady(){
        super.onDOMReady();
        $(`#${this.id} .o-controls input[type=text]`).focus();
    }
    
    addEventListeners(){
        super.addEventListeners({ignoreOnConfirm: true});
        
        const confirmValue = () => {
            const enteredValue = $(`#${this.id} .o-controls input[type=text]`).val();
            this.onConfirm(enteredValue);
            this.hide();
        };
        
        $(`#${this.id} .o-controls .btn-confirm`).click(() => {
            confirmValue();
        });
        $(`#${this.id} .o-controls input[type=text]`).keyup((e) => {
            if(e.which == 13){ //ENTER
                confirmValue();
            }
       });
    }
    
}


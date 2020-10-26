
import ModalBasicInput from './input';

export default class Confirm extends ModalBasicInput {
    
    constructor(question = "", { 
        onCancel = () => {},
        onConfirm = () => {}
    } = {}){
        super({
            html: `
                <div class="o-header">${question}</div>
            `,
            onCancel: onCancel,
            onConfirm: onConfirm,
            modalType: "o-type-confirm"
        });
    }
    
}
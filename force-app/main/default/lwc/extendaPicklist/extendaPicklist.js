import { LightningElement, api } from 'lwc'

import Blank from './blank.html';
import Default from './extendaPicklist.html';
import ReadOnly from './readOnly.html';

export default class ExtendaPicklist extends LightningElement {

    @api label
    @api placeholder
    @api options = []
    @api value
    @api hide
    @api relatedTo
    @api field
    @api readOnly = false;

	render() {
		if(this.hide){
			return Blank;
		}
		if(this.readOnly){
			return ReadOnly;
		}
		return Default;
	}

    renderedCallback(){

		if(this.readOnly) return;

		const selected = this.options.find(x => x.label === this.value || x.selected);

        if(selected){
			this.template.querySelector('select').value = selected.value;
			this.init = true;
        }
    }

    custom__handleChange(event) {

        const { value } = event.target;

        const detail = {
            type: 'picklist-change',
            value,
			field: this.field,
			relatedTo: this.relatedTo,
        }

        console.log('dispatching change', detail);
        
        this.dispatchEvent(new CustomEvent('change', {
            detail,
            composed: true,
            bubbles: true,
            cancelable: true,
        }))
    }
}
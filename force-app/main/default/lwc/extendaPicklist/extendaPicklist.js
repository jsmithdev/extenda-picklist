import { wire, api } from 'lwc'
import ExtendaElement from 'c/extendaElement'
import Blank from './blank.html';
import Default from './extendaPicklist.html';
import ReadOnly from './readOnly.html';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { setPicklistValues } from '../extendaPicklist/util';

export default class ExtendaPicklist extends ExtendaElement {

	options = []
    
    @api hide
    @api relatedTo
    @api readOnly = false;

	@api name;
	@api label;
	@api value;
	@api placeholder;
	@api recordTypeId;
	@api fieldApiName;
	@api objectApiName;

	@api 
	get optionsOverride() {
		return this.options || [];
	}
	set optionsOverride(value) {
		if(!value || !value.length) return;
		//this.options = setPicklistValues({ values: value.map(v => ({ value: v, label: v })) });;
		this.options = value;
	}

	get fieldApi() {
		if(this.optionsOverride.length) return;
		return {
			fieldApiName: this.fieldApiName,
			objectApiName: this.objectApiName,
		}
	}

	@wire(getPicklistValues, { recordTypeId: '$recordTypeId', fieldApiName: '$fieldApi' })
    _setField({ data, error }) {
		if(data) this.options = setPicklistValues(data);
	}

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
			fieldApiName: this.fieldApiName,
			objectApiName: this.objectApiName,
			relatedTo: this.relatedTo,
        }
        
        this.dispatchEvent(new CustomEvent('change', {
            detail,
            composed: true,
            bubbles: true,
            cancelable: true,
        }))
    }
}
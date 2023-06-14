import { API } from './API';

import { ETrackingLogType } from './Types';
import { Util } from './Util';


/* Input Types */
enum FieldType {
    BUTTON = 'button',
    CHECKBOX = 'checkbox',
    COLOR = 'color',
    DATE = 'date',
    DATETIME_LOCAL = 'datetime-local',
    EMAIL = 'email',
    FILE = 'file',
    HIDDEN = 'hidden',
    IMAGE = 'image',
    MONTH = 'month',
    NUMBER = 'number',
    PASSWORD = 'password',
    RADIO = 'radio',
    RANGE = 'range',
    RESET = 'reset',
    SEARCH = 'search',
    SUBMIT = 'submit',
    TEL = 'tel',
    TEXT = 'text',
    TIME = 'time',
    URL = 'url',
    WEEK = 'week'
}

/* Form Element Types */
enum FormElementType {
    INPUT = 'input',
    SELECT = 'select',
    TEXTAREA = 'textarea'
}


const formDataToObject = (elForm: any) => {
    var fields = elForm.querySelectorAll(Object.values(FormElementType).join(', '))

    const object: Record<string, unknown> = {};
    for (var i = 0, imax = fields.length; i < imax; ++i) {
        let field = fields[i]
        let sKey = field.name || field.id || field.placeholder || field.title || field.alt || field.value || field.type || field.tagName;
        if ([FieldType.BUTTON, FieldType.IMAGE, FieldType.SUBMIT].includes(field.type) || !sKey) continue;
        switch (field.type) {
            case FieldType.PASSWORD:
                object[String(sKey)] = field.value ? '********' : '';
                break;
            case FieldType.CHECKBOX:
                object[String(sKey)] = field.checked;
                break;
            case FieldType.RADIO:
                if (object[sKey] === undefined) object[sKey] = '';
                if (field.checked) object[sKey] = field.value;
                break;
            default:
                object[sKey] = field.value;
        }
    }
    return object;
}


export const processFormSubmit = (e: SubmitEvent) => {
    e?.preventDefault()
    const form = e.target as HTMLFormElement
    Util.debug({ form })
    const formData = formDataToObject(form)
    Util.debug({ formData })
    API.sendLog(ETrackingLogType.FORM_SUBMIT, { formData })
    return false;
}


export const attachFormSubmitListeners = () => {
    const document = Util.getDocument()
    const forms = []

    const docForms = document?.getElementsByTagName('form')
    if (docForms) {
        for (let i = 0; i < docForms.length; i++) {
            const docForm = docForms[i]
            forms?.push(docForm)
        }
    }
    /* Find forms that may be nested in iFrames */
    const iframes = document?.getElementsByTagName('iframe')
    if (iframes) {
        for (let i = 0; i < iframes.length; i++) {
            const iframe = iframes[i]
            const iframeForms = iframe?.contentWindow?.document?.getElementsByTagName('form')
            if (iframeForms) {
                for (let j = 0; j < iframeForms.length; j++) {
                    const iframeForm = iframeForms[j]
                    forms?.push(iframeForm)
                }
            }
        }
    }


    Util.debug({ forms })
    if (forms) {
        for (let i = 0; i < forms.length; i++) {
            const form = forms[i]
            form.addEventListener('submit', processFormSubmit)
        }
    }
}

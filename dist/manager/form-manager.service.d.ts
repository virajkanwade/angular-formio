import { FormioAppConfig } from '../formio.config';
import { FormManagerConfig } from './form-manager.config';
import { Formio } from 'formiojs';
import { ActivatedRoute } from '@angular/router';
export declare class FormManagerService {
    appConfig: FormioAppConfig;
    config: FormManagerConfig;
    formio: Formio;
    constructor(appConfig: FormioAppConfig, config: FormManagerConfig);
    reset(): void;
    setForm(route: ActivatedRoute): void;
    loadForm(): any;
    setSubmission(route: ActivatedRoute): void;
    loadForms(): any;
    createForm(form: any): any;
}

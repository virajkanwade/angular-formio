import { Observable } from 'rxjs';
import { FormioForm } from './formio.common';
export declare class FormioService {
    url: string;
    options?: object;
    formio: any;
    constructor(url: string, options?: object);
    requestWrapper(fn: any): any;
    saveForm(form: FormioForm): Observable<FormioForm>;
    loadForm(options?: any): Observable<FormioForm>;
    loadSubmission(): Observable<{}>;
    saveSubmission(submission: {}): Observable<{}>;
    loadSubmissions(): Observable<{}>;
}

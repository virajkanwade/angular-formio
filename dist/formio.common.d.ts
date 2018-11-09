export interface ConditionalOptions {
    show?: string;
    when?: any;
    eq?: any;
}
export interface ValidateOptions {
    required?: boolean;
    custom?: string;
    customPrivate?: boolean;
}
export interface ComponentOptions<T, V> {
    defaultValue?: T | T[];
    type?: string;
    key?: string;
    label?: string;
    input?: boolean;
    required?: boolean;
    multiple?: boolean;
    protected?: boolean;
    unique?: boolean;
    persistent?: boolean;
    tableView?: boolean;
    lockKey?: boolean;
    validate?: V;
    conditional?: ConditionalOptions;
    customConditional?: string;
}
export interface FormioRefreshValue {
    property?: string;
    value?: object;
    form?: object;
    submission?: object;
}
export interface AccessSetting {
    type: string;
    roles: string[];
}
export interface FormioForm {
    title?: string;
    display?: string;
    name?: string;
    path?: string;
    type?: string;
    project?: string;
    template?: string;
    components?: Array<ComponentOptions<any, ValidateOptions>>;
    tags?: string[];
    access?: AccessSetting[];
    submissionAccess?: AccessSetting[];
}
export interface AlertsOptions {
    submitMessage: string;
}
export interface ErrorsOptions {
    message: string;
}
export declare class FormioError {
    message: string;
    component: ComponentOptions<any, ValidateOptions>;
    constructor(message: string, component: ComponentOptions<any, ValidateOptions>);
}
export declare type FormioSubmissionCallback = (error: FormioError, submission: object) => void;
export declare type FormioBeforeSubmit = (submission: object, callback: FormioSubmissionCallback) => void;
export interface FormioHookOptions {
    beforeSubmit: FormioBeforeSubmit;
}
export interface FormioOptions {
    errors?: ErrorsOptions;
    alerts?: AlertsOptions;
    disableAlerts?: boolean;
    i18n?: object;
    fileService?: object;
    hooks?: FormioHookOptions;
}

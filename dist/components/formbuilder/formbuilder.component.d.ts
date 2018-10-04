import { AfterViewInit, OnChanges, ElementRef, EventEmitter } from '@angular/core';
import { FormioAppConfig } from '../../formio.config';
import { FormioForm, FormioOptions } from '../../formio.common';
import { FormBuilder } from 'formiojs';
export declare class FormBuilderComponent implements AfterViewInit, OnChanges {
    private config;
    ready: Promise<object>;
    readyResolve: any;
    formio: any;
    builder: FormBuilder;
    form?: FormioForm;
    options?: FormioOptions;
    change?: EventEmitter<object>;
    builderElement?: ElementRef;
    constructor(config: FormioAppConfig);
    setDisplay(display: String): any;
    buildForm(form: any): any;
    ngOnChanges(changes: any): void;
    ngAfterViewInit(): void;
}

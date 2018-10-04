import { EventEmitter, TemplateRef } from '@angular/core';
import { Formio } from 'formiojs';
export declare class GridHeaderComponent {
    sort: EventEmitter<any>;
    template: TemplateRef<any>;
    headers: Array<any>;
    constructor();
    readonly numHeaders: number;
    load(formio: Formio, query?: any): Promise<any>;
}

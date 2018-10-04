import { EventEmitter, TemplateRef } from '@angular/core';
import { Formio } from 'formiojs';
import { GridHeaderComponent } from './GridHeaderComponent';
export declare class GridBodyComponent {
    header: GridHeaderComponent;
    rowSelect: EventEmitter<any>;
    rowAction: EventEmitter<any>;
    template: TemplateRef<any>;
    rows: Array<any>;
    loading: Boolean;
    firstItem: number;
    lastItem: number;
    skip: number;
    total: number;
    constructor();
    load(formio: Formio, query?: any): Promise<any>;
    onRowSelect(event: any, row: any): void;
    onRowAction(event: any, row: any, action: any): void;
    /**
     * Set the rows for this Grid body.
     *
     * @param query
     * @param items
     * @return any
     */
    setRows(query: any, items: any): any[];
}

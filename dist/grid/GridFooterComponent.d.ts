import { TemplateRef, EventEmitter } from '@angular/core';
import { GridHeaderComponent } from './GridHeaderComponent';
import { GridBodyComponent } from './GridBodyComponent';
export declare class GridFooterComponent {
    header: GridHeaderComponent;
    body: GridBodyComponent;
    createText: String;
    pageChanged: EventEmitter<any>;
    createItem: EventEmitter<any>;
    template: TemplateRef<any>;
    constructor();
}

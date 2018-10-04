/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Input, Output, ViewChild, TemplateRef, EventEmitter } from '@angular/core';
import { GridHeaderComponent } from './GridHeaderComponent';
import { GridBodyComponent } from './GridBodyComponent';
var GridFooterComponent = /** @class */ (function () {
    function GridFooterComponent() {
        this.pageChanged = new EventEmitter();
        this.createItem = new EventEmitter();
    }
    GridFooterComponent.propDecorators = {
        header: [{ type: Input }],
        body: [{ type: Input }],
        createText: [{ type: Input }],
        pageChanged: [{ type: Output }],
        createItem: [{ type: Output }],
        template: [{ type: ViewChild, args: [TemplateRef,] }]
    };
    return GridFooterComponent;
}());
export { GridFooterComponent };
if (false) {
    /** @type {?} */
    GridFooterComponent.prototype.header;
    /** @type {?} */
    GridFooterComponent.prototype.body;
    /** @type {?} */
    GridFooterComponent.prototype.createText;
    /** @type {?} */
    GridFooterComponent.prototype.pageChanged;
    /** @type {?} */
    GridFooterComponent.prototype.createItem;
    /** @type {?} */
    GridFooterComponent.prototype.template;
}

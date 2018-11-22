/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
var GridHeaderComponent = /** @class */ (function () {
    function GridHeaderComponent() {
        this.headers = [];
        this.sort = new EventEmitter();
    }
    Object.defineProperty(GridHeaderComponent.prototype, "numHeaders", {
        get: /**
         * @return {?}
         */
        function () {
            return this.headers.length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} formio
     * @param {?=} query
     * @return {?}
     */
    GridHeaderComponent.prototype.load = /**
     * @param {?} formio
     * @param {?=} query
     * @return {?}
     */
    function (formio, query) {
        return Promise.resolve([]);
    };
    GridHeaderComponent.propDecorators = {
        sort: [{ type: Output }],
        template: [{ type: ViewChild, args: [TemplateRef,] }]
    };
    return GridHeaderComponent;
}());
export { GridHeaderComponent };
if (false) {
    /** @type {?} */
    GridHeaderComponent.prototype.sort;
    /** @type {?} */
    GridHeaderComponent.prototype.template;
    /** @type {?} */
    GridHeaderComponent.prototype.headers;
}

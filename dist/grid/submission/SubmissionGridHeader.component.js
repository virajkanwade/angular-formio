var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component } from '@angular/core';
import { Utils, Components } from 'formiojs';
import { GridHeaderComponent } from '../GridHeaderComponent';
var SubmissionGridHeaderComponent = /** @class */ (function (_super) {
    __extends(SubmissionGridHeaderComponent, _super);
    function SubmissionGridHeaderComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} formio
     * @param {?=} query
     * @return {?}
     */
    SubmissionGridHeaderComponent.prototype.load = /**
     * @param {?} formio
     * @param {?=} query
     * @return {?}
     */
    function (formio, query) {
        var _this = this;
        query = query || {};
        return formio.loadForm({ params: query }).then(function (form) {
            _this.headers = [];
            Utils.eachComponent(form.components, function (component) {
                if (component.input && component.tableView) {
                    _this.headers.push({
                        label: component.label,
                        key: 'data.' + component.key,
                        sort: '',
                        component: Components.create(component, null, null, true)
                    });
                }
            });
            return _this.headers;
        });
    };
    SubmissionGridHeaderComponent.decorators = [
        { type: Component, args: [{
                    template: "<ng-template> <thead> <tr> <th *ngFor=\"let header of headers\"> <a (click)=\"sort.emit(header)\"> {{ header.label }}&nbsp;<span [ngClass]=\"{'glyphicon-triangle-top': (header.sort === 'asc'), 'glyphicon-triangle-bottom': (header.sort === 'desc')}\" class=\"glyphicon\" *ngIf=\"header.sort\"></span> </a> </th> </tr> </thead> </ng-template> "
                },] },
    ];
    return SubmissionGridHeaderComponent;
}(GridHeaderComponent));
export { SubmissionGridHeaderComponent };

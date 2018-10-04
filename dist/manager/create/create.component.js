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
import { FormManagerEditComponent } from '../edit/edit.component';
var FormManagerCreateComponent = /** @class */ (function (_super) {
    __extends(FormManagerCreateComponent, _super);
    function FormManagerCreateComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {?}
     */
    FormManagerCreateComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.service.reset();
    };
    FormManagerCreateComponent.decorators = [
        { type: Component, args: [{
                    template: "<div class=\"loader\" *ngIf=\"loading\"></div> <div class=\"form-group row\"> <div class=\"col-sm-8\"> <input type=\"text\" class=\"form-control\" id=\"formTitle\" placeholder=\"Enter a Title\" #title> </div> <div class=\"col-sm-2\"> <select class=\"form-control\" id=\"formSelect\" #type> <option value=\"form\">Form</option> <option value=\"wizard\">Wizard</option> <option value=\"pdf\">PDF</option> </select> </div> <div class=\"col-sm-2\"> <button class=\"btn btn-primary btn-block\" (click)=\"onSave()\">Save Form</button> </div> </div> <form-builder [form]=\"form\" #builder></form-builder> <button class=\"btn btn-primary\" style=\"margin-top: 10px;\" (click)=\"onSave()\">Save Form</button> "
                },] },
    ];
    return FormManagerCreateComponent;
}(FormManagerEditComponent));
export { FormManagerCreateComponent };

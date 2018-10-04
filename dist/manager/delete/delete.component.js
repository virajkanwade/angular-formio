/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component } from '@angular/core';
import { FormManagerService } from '../form-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
var FormManagerDeleteComponent = /** @class */ (function () {
    function FormManagerDeleteComponent(service, router, route) {
        this.service = service;
        this.router = router;
        this.route = route;
    }
    /**
     * @return {?}
     */
    FormManagerDeleteComponent.prototype.onDelete = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.service.formio.deleteForm().then(function () {
            _this.router.navigate(['../../'], { relativeTo: _this.route });
        });
    };
    /**
     * @return {?}
     */
    FormManagerDeleteComponent.prototype.onCancel = /**
     * @return {?}
     */
    function () {
        this.router.navigate(['../', 'view'], { relativeTo: this.route });
    };
    FormManagerDeleteComponent.decorators = [
        { type: Component, args: [{
                    template: "<h3>Are you sure you wish to delete this form?</h3> <div class=\"btn-toolbar\"> <button type=\"button\" (click)=\"onDelete()\" class=\"btn btn-danger\" style=\"margin-right: 10px;\">Yes</button> <button type=\"button\" (click)=\"onCancel()\" class=\"btn btn-danger\">No</button> </div> "
                },] },
    ];
    /** @nocollapse */
    FormManagerDeleteComponent.ctorParameters = function () { return [
        { type: FormManagerService },
        { type: Router },
        { type: ActivatedRoute }
    ]; };
    return FormManagerDeleteComponent;
}());
export { FormManagerDeleteComponent };
if (false) {
    /** @type {?} */
    FormManagerDeleteComponent.prototype.service;
    /** @type {?} */
    FormManagerDeleteComponent.prototype.router;
    /** @type {?} */
    FormManagerDeleteComponent.prototype.route;
}

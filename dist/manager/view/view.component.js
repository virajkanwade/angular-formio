/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component } from '@angular/core';
import { FormManagerService } from '../form-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
var FormManagerViewComponent = /** @class */ (function () {
    function FormManagerViewComponent(service, router, route) {
        this.service = service;
        this.router = router;
        this.route = route;
    }
    /**
     * @param {?} submission
     * @return {?}
     */
    FormManagerViewComponent.prototype.onSubmit = /**
     * @param {?} submission
     * @return {?}
     */
    function (submission) {
        this.router.navigate(['../', 'submission', submission._id], { relativeTo: this.route });
    };
    FormManagerViewComponent.decorators = [
        { type: Component, args: [{
                    template: "<formio [src]=\"service.formio.formUrl\" (submit)=\"onSubmit($event)\"></formio> "
                },] },
    ];
    /** @nocollapse */
    FormManagerViewComponent.ctorParameters = function () { return [
        { type: FormManagerService },
        { type: Router },
        { type: ActivatedRoute }
    ]; };
    return FormManagerViewComponent;
}());
export { FormManagerViewComponent };
if (false) {
    /** @type {?} */
    FormManagerViewComponent.prototype.service;
    /** @type {?} */
    FormManagerViewComponent.prototype.router;
    /** @type {?} */
    FormManagerViewComponent.prototype.route;
}

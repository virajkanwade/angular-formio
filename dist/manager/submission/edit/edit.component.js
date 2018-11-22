/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component } from '@angular/core';
import { FormManagerService } from '../../form-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
var SubmissionEditComponent = /** @class */ (function () {
    function SubmissionEditComponent(service, router, route) {
        this.service = service;
        this.router = router;
        this.route = route;
    }
    /**
     * @param {?} submission
     * @return {?}
     */
    SubmissionEditComponent.prototype.onSubmit = /**
     * @param {?} submission
     * @return {?}
     */
    function (submission) {
        this.router.navigate(['../../'], { relativeTo: this.route });
    };
    SubmissionEditComponent.decorators = [
        { type: Component, args: [{
                    template: "<formio [src]=\"service.formio.submissionUrl\" (submit)=\"onSubmit($event)\"></formio> "
                },] },
    ];
    /** @nocollapse */
    SubmissionEditComponent.ctorParameters = function () { return [
        { type: FormManagerService },
        { type: Router },
        { type: ActivatedRoute }
    ]; };
    return SubmissionEditComponent;
}());
export { SubmissionEditComponent };
if (false) {
    /** @type {?} */
    SubmissionEditComponent.prototype.service;
    /** @type {?} */
    SubmissionEditComponent.prototype.router;
    /** @type {?} */
    SubmissionEditComponent.prototype.route;
}

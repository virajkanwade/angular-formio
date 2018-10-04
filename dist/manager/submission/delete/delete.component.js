/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component } from '@angular/core';
import { FormManagerService } from '../../form-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
var SubmissionDeleteComponent = /** @class */ (function () {
    function SubmissionDeleteComponent(service, router, route) {
        this.service = service;
        this.router = router;
        this.route = route;
    }
    /**
     * @return {?}
     */
    SubmissionDeleteComponent.prototype.onDelete = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.service.formio.deleteSubmission().then(function () {
            _this.router.navigate(['../../'], { relativeTo: _this.route });
        });
    };
    /**
     * @return {?}
     */
    SubmissionDeleteComponent.prototype.onCancel = /**
     * @return {?}
     */
    function () {
        this.router.navigate(['../', 'view'], { relativeTo: this.route });
    };
    SubmissionDeleteComponent.decorators = [
        { type: Component, args: [{
                    template: "<h3>Are you sure you wish to delete this record?</h3> <div class=\"btn-toolbar\"> <button type=\"button\" (click)=\"onDelete()\" class=\"btn btn-danger\" style=\"margin-right: 10px;\">Yes</button> <button type=\"button\" (click)=\"onCancel()\" class=\"btn btn-danger\">No</button> </div> "
                },] },
    ];
    /** @nocollapse */
    SubmissionDeleteComponent.ctorParameters = function () { return [
        { type: FormManagerService },
        { type: Router },
        { type: ActivatedRoute }
    ]; };
    return SubmissionDeleteComponent;
}());
export { SubmissionDeleteComponent };
if (false) {
    /** @type {?} */
    SubmissionDeleteComponent.prototype.service;
    /** @type {?} */
    SubmissionDeleteComponent.prototype.router;
    /** @type {?} */
    SubmissionDeleteComponent.prototype.route;
}

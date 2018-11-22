/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component } from '@angular/core';
import { FormManagerService } from '../../form-manager.service';
var SubmissionViewComponent = /** @class */ (function () {
    function SubmissionViewComponent(service) {
        this.service = service;
    }
    SubmissionViewComponent.decorators = [
        { type: Component, args: [{
                    template: "<formio [src]=\"service.formio.submissionUrl\" [readOnly]=\"true\"></formio> "
                },] },
    ];
    /** @nocollapse */
    SubmissionViewComponent.ctorParameters = function () { return [
        { type: FormManagerService }
    ]; };
    return SubmissionViewComponent;
}());
export { SubmissionViewComponent };
if (false) {
    /** @type {?} */
    SubmissionViewComponent.prototype.service;
}

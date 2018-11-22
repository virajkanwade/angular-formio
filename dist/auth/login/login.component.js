/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component } from '@angular/core';
import { FormioAuthService } from '../auth.service';
var FormioAuthLoginComponent = /** @class */ (function () {
    function FormioAuthLoginComponent(service) {
        this.service = service;
    }
    FormioAuthLoginComponent.decorators = [
        { type: Component, args: [{
                    template: "<formio [src]=\"service.loginForm\" (submit)=\"service.onLoginSubmit($event)\"></formio> "
                },] },
    ];
    /** @nocollapse */
    FormioAuthLoginComponent.ctorParameters = function () { return [
        { type: FormioAuthService }
    ]; };
    return FormioAuthLoginComponent;
}());
export { FormioAuthLoginComponent };
if (false) {
    /** @type {?} */
    FormioAuthLoginComponent.prototype.service;
}

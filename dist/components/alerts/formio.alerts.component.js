/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
import { FormioAlerts } from './formio.alerts';
var FormioAlertsComponent = /** @class */ (function () {
    function FormioAlertsComponent() {
        this.alerts = new FormioAlerts();
    }
    FormioAlertsComponent.decorators = [
        { type: Component, args: [{
                    selector: 'formio-alerts',
                    template: "<div *ngFor=\"let alert of alerts.alerts\" class=\"alert alert-{{ alert.type }}\" role=\"alert\">{{ alert.message }}</div> "
                },] },
    ];
    /** @nocollapse */
    FormioAlertsComponent.ctorParameters = function () { return []; };
    FormioAlertsComponent.propDecorators = {
        alerts: [{ type: Input }]
    };
    return FormioAlertsComponent;
}());
export { FormioAlertsComponent };
if (false) {
    /** @type {?} */
    FormioAlertsComponent.prototype.alerts;
}

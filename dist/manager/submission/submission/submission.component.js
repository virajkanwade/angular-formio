/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component } from '@angular/core';
import { FormManagerService } from '../../form-manager.service';
import { ActivatedRoute } from '@angular/router';
var SubmissionComponent = /** @class */ (function () {
    function SubmissionComponent(service, route) {
        this.service = service;
        this.route = route;
    }
    /**
     * @return {?}
     */
    SubmissionComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.service.setSubmission(this.route);
    };
    SubmissionComponent.decorators = [
        { type: Component, args: [{
                    template: "<ul class=\"nav nav-tabs\" style=\"margin-bottom:10px\"> <li class=\"nav-item\"><a class=\"nav-link\" routerLink=\"../\"><i class=\"fa fa-chevron-left glyphicon glyphicon-chevron-left\"></i></a></li> <li class=\"nav-item\" routerLinkActive=\"active\"><a class=\"nav-link\" routerLink=\"view\" routerLinkActive=\"active\"><i class=\"fa fa-eye glyphicon glyphicon-eye\"></i> View</a></li> <li class=\"nav-item\" routerLinkActive=\"active\"><a class=\"nav-link\" routerLink=\"edit\" routerLinkActive=\"active\"><i class=\"fa fa-edit glyphicon glyphicon-edit\"></i> Edit</a></li> <li class=\"nav-item\" routerLinkActive=\"active\"><a class=\"nav-link\" routerLink=\"delete\" routerLinkActive=\"active\"><span class=\"fa fa-trash glyphicon glyphicon-trash\"></span></a></li> </ul> <router-outlet></router-outlet> "
                },] },
    ];
    /** @nocollapse */
    SubmissionComponent.ctorParameters = function () { return [
        { type: FormManagerService },
        { type: ActivatedRoute }
    ]; };
    return SubmissionComponent;
}());
export { SubmissionComponent };
if (false) {
    /** @type {?} */
    SubmissionComponent.prototype.service;
    /** @type {?} */
    SubmissionComponent.prototype.route;
}

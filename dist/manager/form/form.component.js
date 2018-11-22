/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component } from '@angular/core';
import { FormManagerService } from '../form-manager.service';
import { ActivatedRoute } from '@angular/router';
var FormManagerFormComponent = /** @class */ (function () {
    function FormManagerFormComponent(service, route) {
        this.service = service;
        this.route = route;
    }
    /**
     * @return {?}
     */
    FormManagerFormComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.service.setForm(this.route);
    };
    FormManagerFormComponent.decorators = [
        { type: Component, args: [{
                    template: "<ul class=\"nav nav-tabs\" style=\"margin-bottom:10px\"> <li class=\"nav-item\"><a class=\"nav-link\" routerLink=\"../\"><i class=\"fa fa-chevron-left glyphicon glyphicon-chevron-left\"></i></a></li> <li class=\"nav-item\" routerLinkActive=\"active\"><a class=\"nav-link\" routerLink=\"view\" routerLinkActive=\"active\"><i class=\"fa fa-pencil glyphicon glyphicon-pencil\"></i> Enter Data</a></li> <li class=\"nav-item\" routerLinkActive=\"active\"><a class=\"nav-link\" routerLink=\"submission\" routerLinkActive=\"active\"><i class=\"fa fa-list-alt glyphicon glyphicon-list-alt\"></i> View Data</a></li> <li class=\"nav-item\" routerLinkActive=\"active\"><a class=\"nav-link\" routerLink=\"edit\" routerLinkActive=\"active\"><i class=\"fa fa-edit glyphicon glyphicon-edit\"></i> Edit Form</a></li> <li class=\"nav-item\" routerLinkActive=\"active\"><a class=\"nav-link\" routerLink=\"delete\" routerLinkActive=\"active\"><span class=\"fa fa-trash glyphicon glyphicon-trash\"></span></a></li> </ul> <router-outlet></router-outlet> "
                },] },
    ];
    /** @nocollapse */
    FormManagerFormComponent.ctorParameters = function () { return [
        { type: FormManagerService },
        { type: ActivatedRoute }
    ]; };
    return FormManagerFormComponent;
}());
export { FormManagerFormComponent };
if (false) {
    /** @type {?} */
    FormManagerFormComponent.prototype.service;
    /** @type {?} */
    FormManagerFormComponent.prototype.route;
}

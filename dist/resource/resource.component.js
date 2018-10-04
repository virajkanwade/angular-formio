/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormioResourceService } from './resource.service';
var FormioResourceComponent = /** @class */ (function () {
    function FormioResourceComponent(service, route) {
        this.service = service;
        this.route = route;
    }
    /**
     * @return {?}
     */
    FormioResourceComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.service.loadResource(this.route);
    };
    FormioResourceComponent.decorators = [
        { type: Component, args: [{
                    template: "<ul class=\"nav nav-tabs\" style=\"margin-bottom: 10px\"> <li class=\"nav-item\"><a class=\"nav-link\" routerLink=\"../\"><i class=\"fa fa-chevron-left glyphicon glyphicon-chevron-left\"></i></a></li> <li class=\"nav-item\" routerLinkActive=\"active\"><a class=\"nav-link\" routerLink=\"view\" routerLinkActive=\"active\">View</a></li> <li class=\"nav-item\" routerLinkActive=\"active\"><a class=\"nav-link\" routerLink=\"edit\" routerLinkActive=\"active\">Edit</a></li> <li class=\"nav-item\" routerLinkActive=\"active\"><a class=\"nav-link\" routerLink=\"delete\" routerLinkActive=\"active\"><span class=\"fa fa-trash glyphicon glyphicon-trash\"></span></a></li> </ul> <router-outlet></router-outlet> "
                },] },
    ];
    /** @nocollapse */
    FormioResourceComponent.ctorParameters = function () { return [
        { type: FormioResourceService },
        { type: ActivatedRoute }
    ]; };
    return FormioResourceComponent;
}());
export { FormioResourceComponent };
if (false) {
    /** @type {?} */
    FormioResourceComponent.prototype.service;
    /** @type {?} */
    FormioResourceComponent.prototype.route;
}

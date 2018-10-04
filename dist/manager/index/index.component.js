/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormManagerService } from '../form-manager.service';
import { FormManagerConfig } from '../form-manager.config';
var FormManagerIndexComponent = /** @class */ (function () {
    function FormManagerIndexComponent(service, route, router, config) {
        this.service = service;
        this.route = route;
        this.router = router;
        this.config = config;
    }
    /**
     * @return {?}
     */
    FormManagerIndexComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.service.reset();
    };
    /**
     * @param {?} action
     * @return {?}
     */
    FormManagerIndexComponent.prototype.onAction = /**
     * @param {?} action
     * @return {?}
     */
    function (action) {
        this.router.navigate([action.row._id, action.action], { relativeTo: this.route });
    };
    /**
     * @param {?} row
     * @return {?}
     */
    FormManagerIndexComponent.prototype.onSelect = /**
     * @param {?} row
     * @return {?}
     */
    function (row) {
        this.router.navigate([row._id, 'view'], { relativeTo: this.route });
    };
    /**
     * @return {?}
     */
    FormManagerIndexComponent.prototype.onCreateItem = /**
     * @return {?}
     */
    function () {
        this.router.navigate(['create'], { relativeTo: this.route });
    };
    FormManagerIndexComponent.decorators = [
        { type: Component, args: [{
                    template: "<formio-grid [formio]=\"service.formio\" [gridType]=\"'form'\" [query]=\"{tags: config.tag, type: 'form'}\" (rowAction)=\"onAction($event)\" (rowSelect)=\"onSelect($event)\" (createItem)=\"onCreateItem()\" ></formio-grid> "
                },] },
    ];
    /** @nocollapse */
    FormManagerIndexComponent.ctorParameters = function () { return [
        { type: FormManagerService },
        { type: ActivatedRoute },
        { type: Router },
        { type: FormManagerConfig }
    ]; };
    return FormManagerIndexComponent;
}());
export { FormManagerIndexComponent };
if (false) {
    /** @type {?} */
    FormManagerIndexComponent.prototype.service;
    /** @type {?} */
    FormManagerIndexComponent.prototype.route;
    /** @type {?} */
    FormManagerIndexComponent.prototype.router;
    /** @type {?} */
    FormManagerIndexComponent.prototype.config;
}

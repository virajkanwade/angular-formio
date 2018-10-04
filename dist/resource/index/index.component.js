/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormioResourceService } from '../resource.service';
import { FormioResourceConfig } from '../resource.config';
import { each } from 'lodash';
var FormioResourceIndexComponent = /** @class */ (function () {
    function FormioResourceIndexComponent(service, route, router, config, ref) {
        this.service = service;
        this.route = route;
        this.router = router;
        this.config = config;
        this.ref = ref;
        this.formTitle = '';
    }
    /**
     * @return {?}
     */
    FormioResourceIndexComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.gridQuery = {};
        this.service.setContext(this.route);
        this.service.formLoaded.then(function () {
            _this.formTitle = _this.service.form.title;
            _this.ref.detectChanges();
        });
        if (this.service &&
            this.config.parents &&
            this.config.parents.length) {
            // Wait for the parents to load before loading this grid.
            this.service.parentsLoaded.then(function (parents) {
                each(parents, function (parent) {
                    if (parent && parent.filter) {
                        _this.gridQuery['data.' + parent.name + '._id'] =
                            parent.resource._id;
                    }
                });
                // Set the source to load the grid.
                // Set the source to load the grid.
                _this.gridSrc = _this.service.formUrl;
            });
        }
        else if (this.service.formUrl) {
            this.gridSrc = this.service.formUrl;
        }
    };
    /**
     * @param {?} row
     * @return {?}
     */
    FormioResourceIndexComponent.prototype.onSelect = /**
     * @param {?} row
     * @return {?}
     */
    function (row) {
        this.router.navigate([row._id, 'view'], { relativeTo: this.route });
    };
    /**
     * @return {?}
     */
    FormioResourceIndexComponent.prototype.onCreateItem = /**
     * @return {?}
     */
    function () {
        this.router.navigate(['new'], { relativeTo: this.route });
    };
    FormioResourceIndexComponent.decorators = [
        { type: Component, args: [{
                    template: "<formio-grid *ngIf=\"formTitle\" [src]=\"gridSrc\" [query]=\"gridQuery\" [onForm]=\"service.formLoaded\" (rowSelect)=\"onSelect($event)\" (error)=\"service.onError($event)\" (createItem)=\"onCreateItem()\" [createText]=\"'New ' + formTitle\" ></formio-grid> "
                },] },
    ];
    /** @nocollapse */
    FormioResourceIndexComponent.ctorParameters = function () { return [
        { type: FormioResourceService },
        { type: ActivatedRoute },
        { type: Router },
        { type: FormioResourceConfig },
        { type: ChangeDetectorRef }
    ]; };
    return FormioResourceIndexComponent;
}());
export { FormioResourceIndexComponent };
if (false) {
    /** @type {?} */
    FormioResourceIndexComponent.prototype.gridSrc;
    /** @type {?} */
    FormioResourceIndexComponent.prototype.gridQuery;
    /** @type {?} */
    FormioResourceIndexComponent.prototype.formTitle;
    /** @type {?} */
    FormioResourceIndexComponent.prototype.service;
    /** @type {?} */
    FormioResourceIndexComponent.prototype.route;
    /** @type {?} */
    FormioResourceIndexComponent.prototype.router;
    /** @type {?} */
    FormioResourceIndexComponent.prototype.config;
    /** @type {?} */
    FormioResourceIndexComponent.prototype.ref;
}

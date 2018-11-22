/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { FormioAppConfig } from '../formio.config';
import { FormManagerConfig } from './form-manager.config';
import { Formio } from 'formiojs';
var FormManagerService = /** @class */ (function () {
    function FormManagerService(appConfig, config) {
        this.appConfig = appConfig;
        this.config = config;
        if (this.appConfig && this.appConfig.appUrl) {
            Formio.setBaseUrl(this.appConfig.apiUrl);
            Formio.setProjectUrl(this.appConfig.appUrl);
        }
        else {
            console.error('You must provide an AppConfig within your application!');
        }
        this.reset();
    }
    /**
     * @return {?}
     */
    FormManagerService.prototype.reset = /**
     * @return {?}
     */
    function () {
        this.formio = new Formio(this.appConfig.appUrl);
    };
    /**
     * @param {?} route
     * @return {?}
     */
    FormManagerService.prototype.setForm = /**
     * @param {?} route
     * @return {?}
     */
    function (route) {
        var _this = this;
        route.params.subscribe(function (params) {
            if (params["id"]) {
                _this.formio = new Formio(_this.formio.formsUrl + "/" + params["id"]);
            }
            else {
                _this.reset();
            }
        });
    };
    /**
     * @return {?}
     */
    FormManagerService.prototype.loadForm = /**
     * @return {?}
     */
    function () {
        return this.formio.loadForm();
    };
    /**
     * @param {?} route
     * @return {?}
     */
    FormManagerService.prototype.setSubmission = /**
     * @param {?} route
     * @return {?}
     */
    function (route) {
        var _this = this;
        route.params.subscribe(function (params) {
            _this.formio = new Formio(_this.formio.submissionsUrl + "/" + params["id"]);
        });
    };
    /**
     * @return {?}
     */
    FormManagerService.prototype.loadForms = /**
     * @return {?}
     */
    function () {
        return this.formio.loadForms({ params: {
                tags: this.config.tag
            } });
    };
    /**
     * @param {?} form
     * @return {?}
     */
    FormManagerService.prototype.createForm = /**
     * @param {?} form
     * @return {?}
     */
    function (form) {
        return this.formio.createform(form);
    };
    FormManagerService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    FormManagerService.ctorParameters = function () { return [
        { type: FormioAppConfig },
        { type: FormManagerConfig }
    ]; };
    return FormManagerService;
}());
export { FormManagerService };
if (false) {
    /** @type {?} */
    FormManagerService.prototype.formio;
    /** @type {?} */
    FormManagerService.prototype.appConfig;
    /** @type {?} */
    FormManagerService.prototype.config;
}

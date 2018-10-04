/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { EventEmitter, Injectable, Optional } from '@angular/core';
import { FormioResourceConfig } from './resource.config';
import { FormioResources } from './resources.service';
import { FormioLoader } from '../components/loader/formio.loader';
import { FormioAppConfig } from '../formio.config';
import Promise from 'native-promise-only';
import { Formio, Utils } from 'formiojs';
import _ from 'lodash';
var FormioResourceService = /** @class */ (function () {
    function FormioResourceService(appConfig, config, loader, resourcesService) {
        var _this = this;
        this.appConfig = appConfig;
        this.config = config;
        this.loader = loader;
        this.resourcesService = resourcesService;
        this.refresh = new EventEmitter();
        this.formLoaded = new Promise(function () { });
        if (this.appConfig && this.appConfig.appUrl) {
            Formio.setBaseUrl(this.appConfig.apiUrl);
            Formio.setProjectUrl(this.appConfig.appUrl);
            Formio.formOnly = this.appConfig.formOnly;
        }
        else {
            console.error('You must provide an AppConfig within your application!');
        }
        // Create the form url and load the resources.
        this.formUrl = this.appConfig.appUrl + '/' + this.config.form;
        this.refresh = new EventEmitter();
        this.resource = { data: {} };
        this.resourceLoaded = new Promise(function (resolve, reject) {
            _this.resourceResolve = resolve;
            _this.resourceReject = reject;
        });
        this.formLoaded = new Promise(function (resolve, reject) {
            _this.formResolve = resolve;
            _this.formReject = reject;
        });
        this.parentsLoaded = new Promise(function (resolve, reject) {
            _this.parentsResolve = resolve;
            _this.parentsReject = reject;
        });
        // Add this resource service to the list of all resources in context.
        if (this.resourcesService) {
            this.resources = this.resourcesService.resources;
            this.resources[this.config.name] = this;
        }
        this.loadForm();
    }
    /**
     * @return {?}
     */
    FormioResourceService.prototype.initialize = /**
     * @return {?}
     */
    function () {
        console.warn('FormioResourceService.initialize() has been deprecated.');
    };
    /**
     * @param {?} error
     * @return {?}
     */
    FormioResourceService.prototype.onError = /**
     * @param {?} error
     * @return {?}
     */
    function (error) {
        if (this.resourcesService) {
            this.resourcesService.error.emit(error);
        }
        throw error;
    };
    /**
     * @param {?} err
     * @return {?}
     */
    FormioResourceService.prototype.onFormError = /**
     * @param {?} err
     * @return {?}
     */
    function (err) {
        this.formReject(err);
        this.onError(err);
    };
    /**
     * @param {?} route
     * @return {?}
     */
    FormioResourceService.prototype.setContext = /**
     * @param {?} route
     * @return {?}
     */
    function (route) {
        this.resourceId = route.snapshot.params['id'];
        this.resource = { data: {} };
        this.resourceUrl = this.appConfig.appUrl + '/' + this.config.form;
        if (this.resourceId) {
            this.resourceUrl += '/submission/' + this.resourceId;
        }
        this.formio = new Formio(this.resourceUrl);
        this.setParents();
    };
    /**
     * @return {?}
     */
    FormioResourceService.prototype.loadForm = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.formFormio = new Formio(this.formUrl);
        this.loader.loading = true;
        this.formLoading = this.formFormio
            .loadForm()
            .then(function (form) {
            _this.form = form;
            _this.formResolve(form);
            _this.loader.loading = false;
            _this.setParents();
            return form;
        }, function (err) { return _this.onFormError(err); })
            .catch(function (err) { return _this.onFormError(err); });
        return this.formLoading;
    };
    /**
     * @return {?}
     */
    FormioResourceService.prototype.setParents = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this.config.parents || !this.config.parents.length || !this.form) {
            return;
        }
        if (!this.resourcesService) {
            console.warn('You must provide the FormioResources within your application to use nested resources.');
            return;
        }
        /** @type {?} */
        var _parentsLoaded = [];
        this.config.parents.forEach(function (parent) {
            /** @type {?} */
            var resourceName = parent.resource || parent;
            /** @type {?} */
            var resourceField = parent.field || parent;
            /** @type {?} */
            var filterResource = parent.hasOwnProperty('filter') ? parent.filter : true;
            if (_this.resources.hasOwnProperty(resourceName)) {
                _parentsLoaded.push(_this.resources[resourceName].resourceLoaded.then(function (resource) {
                    /** @type {?} */
                    var parentPath = '';
                    Utils.eachComponent(_this.form.components, function (component, path) {
                        if (component.key === resourceField) {
                            component.hidden = true;
                            component.clearOnHide = false;
                            _.set(_this.resource.data, path, resource);
                            parentPath = path;
                            return true;
                        }
                    });
                    return {
                        name: parentPath,
                        filter: filterResource,
                        resource: resource
                    };
                }));
            }
        });
        // When all the parents have loaded, emit that to the onParents emitter.
        Promise.all(_parentsLoaded).then(function (parents) {
            _this.parentsResolve(parents);
            _this.refresh.emit({
                form: _this.form,
                submission: _this.resource
            });
        });
    };
    /**
     * @param {?} err
     * @return {?}
     */
    FormioResourceService.prototype.onSubmissionError = /**
     * @param {?} err
     * @return {?}
     */
    function (err) {
        this.resourceReject(err);
        this.onError(err);
    };
    /**
     * @param {?} route
     * @return {?}
     */
    FormioResourceService.prototype.loadResource = /**
     * @param {?} route
     * @return {?}
     */
    function (route) {
        var _this = this;
        this.setContext(route);
        this.loader.loading = true;
        this.resourceLoading = this.formio
            .loadSubmission(null, { ignoreCache: true })
            .then(function (resource) {
            _this.resource = resource;
            _this.resourceResolve(resource);
            _this.loader.loading = false;
            _this.refresh.emit({
                property: 'submission',
                value: _this.resource
            });
            return resource;
        }, function (err) { return _this.onSubmissionError(err); })
            .catch(function (err) { return _this.onSubmissionError(err); });
        return this.resourceLoading;
    };
    /**
     * @param {?} resource
     * @return {?}
     */
    FormioResourceService.prototype.save = /**
     * @param {?} resource
     * @return {?}
     */
    function (resource) {
        var _this = this;
        /** @type {?} */
        var formio = resource._id ? this.formio : this.formFormio;
        return formio
            .saveSubmission(resource)
            .then(function (saved) {
            _this.resource = saved;
            return saved;
        }, function (err) { return _this.onError(err); })
            .catch(function (err) { return _this.onError(err); });
    };
    /**
     * @return {?}
     */
    FormioResourceService.prototype.remove = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return this.formio
            .deleteSubmission()
            .then(function () {
            _this.resource = null;
        }, function (err) { return _this.onError(err); })
            .catch(function (err) { return _this.onError(err); });
    };
    FormioResourceService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    FormioResourceService.ctorParameters = function () { return [
        { type: FormioAppConfig },
        { type: FormioResourceConfig },
        { type: FormioLoader },
        { type: FormioResources, decorators: [{ type: Optional }] }
    ]; };
    return FormioResourceService;
}());
export { FormioResourceService };
if (false) {
    /** @type {?} */
    FormioResourceService.prototype.form;
    /** @type {?} */
    FormioResourceService.prototype.resource;
    /** @type {?} */
    FormioResourceService.prototype.resourceUrl;
    /** @type {?} */
    FormioResourceService.prototype.formUrl;
    /** @type {?} */
    FormioResourceService.prototype.formFormio;
    /** @type {?} */
    FormioResourceService.prototype.formio;
    /** @type {?} */
    FormioResourceService.prototype.refresh;
    /** @type {?} */
    FormioResourceService.prototype.resourceLoading;
    /** @type {?} */
    FormioResourceService.prototype.resourceLoaded;
    /** @type {?} */
    FormioResourceService.prototype.resourceResolve;
    /** @type {?} */
    FormioResourceService.prototype.resourceReject;
    /** @type {?} */
    FormioResourceService.prototype.resourceId;
    /** @type {?} */
    FormioResourceService.prototype.resources;
    /** @type {?} */
    FormioResourceService.prototype.formLoading;
    /** @type {?} */
    FormioResourceService.prototype.formLoaded;
    /** @type {?} */
    FormioResourceService.prototype.formResolve;
    /** @type {?} */
    FormioResourceService.prototype.formReject;
    /** @type {?} */
    FormioResourceService.prototype.parentsLoaded;
    /** @type {?} */
    FormioResourceService.prototype.parentsResolve;
    /** @type {?} */
    FormioResourceService.prototype.parentsReject;
    /** @type {?} */
    FormioResourceService.prototype.appConfig;
    /** @type {?} */
    FormioResourceService.prototype.config;
    /** @type {?} */
    FormioResourceService.prototype.loader;
    /** @type {?} */
    FormioResourceService.prototype.resourcesService;
}

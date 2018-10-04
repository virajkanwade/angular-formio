(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('lodash'), require('formiojs'), require('native-promise-only'), require('@angular/router'), require('@angular/common'), require('rxjs'), require('@angular/forms'), require('ngx-bootstrap/pagination')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'lodash', 'formiojs', 'native-promise-only', '@angular/router', '@angular/common', 'rxjs', '@angular/forms', 'ngx-bootstrap/pagination'], factory) :
	(factory((global['formio-resource'] = {}),global.core,global._,global.formiojs,global.Promise$1,global.router,global.common,global.rxjs,global.forms,global.pagination));
}(this, (function (exports,core,_,formiojs,Promise$1,router,common,rxjs,forms,pagination) { 'use strict';

var ___default = 'default' in _ ? _['default'] : _;
Promise$1 = Promise$1 && Promise$1.hasOwnProperty('default') ? Promise$1['default'] : Promise$1;

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @record
 */

var FormioResourceConfig = /** @class */ (function () {
    function FormioResourceConfig() {
        this.name = '';
        this.form = '';
        this.parents = [];
    }
    FormioResourceConfig.decorators = [
        { type: core.Injectable },
    ];
    return FormioResourceConfig;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @record
 */

/**
 * @record
 */

var FormioAuthConfig = /** @class */ (function () {
    function FormioAuthConfig() {
    }
    FormioAuthConfig.decorators = [
        { type: core.Injectable },
    ];
    return FormioAuthConfig;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var FormioAppConfig = /** @class */ (function () {
    function FormioAppConfig() {
        this.appUrl = '';
        this.apiUrl = '';
    }
    FormioAppConfig.decorators = [
        { type: core.Injectable },
    ];
    return FormioAppConfig;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var FormioAuthService = /** @class */ (function () {
    function FormioAuthService(appConfig, config) {
        var _this = this;
        this.appConfig = appConfig;
        this.config = config;
        this.authenticated = false;
        this.formAccess = {};
        this.submissionAccess = {};
        this.is = {};
        this.user = null;
        if (this.appConfig && this.appConfig.appUrl) {
            formiojs.Formio.setBaseUrl(this.appConfig.apiUrl);
            formiojs.Formio.setProjectUrl(this.appConfig.appUrl);
            formiojs.Formio.formOnly = !!this.appConfig.formOnly;
        }
        else {
            console.error('You must provide an AppConfig within your application!');
        }
        this.loginForm =
            this.appConfig.appUrl +
                '/' +
                _.get(this.config, 'login.form', 'user/login');
        this.registerForm =
            this.appConfig.appUrl +
                '/' +
                _.get(this.config, 'register.form', 'user/login');
        this.onLogin = new core.EventEmitter();
        this.onLogout = new core.EventEmitter();
        this.onRegister = new core.EventEmitter();
        this.onUser = new core.EventEmitter();
        this.onError = new core.EventEmitter();
        this.ready = new Promise(function (resolve, reject) {
            _this.readyResolve = resolve;
            _this.readyReject = reject;
        });
        // Register for the core events.
        formiojs.Formio.events.on('formio.badToken', function () { return _this.logoutError(); });
        formiojs.Formio.events.on('formio.sessionExpired', function () { return _this.logoutError(); });
        this.init();
    }
    /**
     * @param {?} submission
     * @return {?}
     */
    FormioAuthService.prototype.onLoginSubmit = /**
     * @param {?} submission
     * @return {?}
     */
    function (submission) {
        this.setUser(submission);
        this.onLogin.emit(submission);
    };
    /**
     * @param {?} submission
     * @return {?}
     */
    FormioAuthService.prototype.onRegisterSubmit = /**
     * @param {?} submission
     * @return {?}
     */
    function (submission) {
        this.setUser(submission);
        this.onRegister.emit(submission);
    };
    /**
     * @return {?}
     */
    FormioAuthService.prototype.init = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.projectReady = formiojs.Formio.makeStaticRequest(this.appConfig.appUrl).then(function (project) {
            _.each(project.access, function (access) {
                _this.formAccess[access.type] = access.roles;
            });
        }, function () {
            _this.formAccess = {};
            return null;
        });
        // Get the access for this project.
        this.accessReady = formiojs.Formio.makeStaticRequest(this.appConfig.appUrl + '/access').then(function (access) {
            _.each(access.forms, function (form) {
                _this.submissionAccess[form.name] = {};
                form.submissionAccess.forEach(function (subAccess) {
                    _this.submissionAccess[form.name][subAccess.type] = subAccess.roles;
                });
            });
            _this.roles = access.roles;
            return access;
        }, function () {
            _this.roles = {};
            return null;
        });
        this.userReady = formiojs.Formio.currentUser().then(function (user) {
            _this.setUser(user);
            return user;
        });
        // Trigger we are redy when all promises have resolved.
        if (this.accessReady) {
            this.accessReady
                .then(function () { return _this.projectReady; })
                .then(function () { return _this.userReady; })
                .then(function () { return _this.readyResolve(true); })
                .catch(function (err) { return _this.readyReject(err); });
        }
    };
    /**
     * @param {?} user
     * @return {?}
     */
    FormioAuthService.prototype.setUser = /**
     * @param {?} user
     * @return {?}
     */
    function (user) {
        if (user) {
            this.user = user;
            localStorage.setItem('formioAppUser', JSON.stringify(user));
            this.setUserRoles();
        }
        else {
            this.user = null;
            this.is = {};
            localStorage.removeItem('formioAppUser');
            formiojs.Formio.clearCache();
            formiojs.Formio.setUser(null);
        }
        this.authenticated = !!formiojs.Formio.getToken();
        this.onUser.emit(this.user);
    };
    /**
     * @return {?}
     */
    FormioAuthService.prototype.setUserRoles = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.accessReady) {
            this.accessReady.then(function () {
                _.each(_this.roles, function (role, roleName) {
                    if (_this.user.roles.indexOf(role._id) !== -1) {
                        _this.is[roleName] = true;
                    }
                });
            });
        }
    };
    /**
     * @return {?}
     */
    FormioAuthService.prototype.logoutError = /**
     * @return {?}
     */
    function () {
        this.setUser(null);
        localStorage.removeItem('formioToken');
        this.onError.emit();
    };
    /**
     * @return {?}
     */
    FormioAuthService.prototype.logout = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.setUser(null);
        localStorage.removeItem('formioToken');
        formiojs.Formio.logout()
            .then(function () { return _this.onLogout.emit(); })
            .catch(function () { return _this.logoutError(); });
    };
    FormioAuthService.decorators = [
        { type: core.Injectable },
    ];
    /** @nocollapse */
    FormioAuthService.ctorParameters = function () { return [
        { type: FormioAppConfig },
        { type: FormioAuthConfig }
    ]; };
    return FormioAuthService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @record
 */

var FormioResources = /** @class */ (function () {
    function FormioResources(auth) {
        this.auth = auth;
        this.resources = {};
        this.error = new core.EventEmitter();
        this.onError = this.error;
        this.resources = {
            currentUser: {
                resourceLoaded: this.auth.userReady
            }
        };
    }
    FormioResources.decorators = [
        { type: core.Injectable },
    ];
    /** @nocollapse */
    FormioResources.ctorParameters = function () { return [
        { type: FormioAuthService }
    ]; };
    return FormioResources;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var FormioLoader = /** @class */ (function () {
    function FormioLoader() {
        this.loading = true;
    }
    FormioLoader.decorators = [
        { type: core.Injectable },
    ];
    return FormioLoader;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var FormioResourceService = /** @class */ (function () {
    function FormioResourceService(appConfig, config, loader, resourcesService) {
        var _this = this;
        this.appConfig = appConfig;
        this.config = config;
        this.loader = loader;
        this.resourcesService = resourcesService;
        this.refresh = new core.EventEmitter();
        this.formLoaded = new Promise$1(function () { });
        if (this.appConfig && this.appConfig.appUrl) {
            formiojs.Formio.setBaseUrl(this.appConfig.apiUrl);
            formiojs.Formio.setProjectUrl(this.appConfig.appUrl);
            formiojs.Formio.formOnly = this.appConfig.formOnly;
        }
        else {
            console.error('You must provide an AppConfig within your application!');
        }
        // Create the form url and load the resources.
        this.formUrl = this.appConfig.appUrl + '/' + this.config.form;
        this.refresh = new core.EventEmitter();
        this.resource = { data: {} };
        this.resourceLoaded = new Promise$1(function (resolve, reject) {
            _this.resourceResolve = resolve;
            _this.resourceReject = reject;
        });
        this.formLoaded = new Promise$1(function (resolve, reject) {
            _this.formResolve = resolve;
            _this.formReject = reject;
        });
        this.parentsLoaded = new Promise$1(function (resolve, reject) {
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
        this.formio = new formiojs.Formio(this.resourceUrl);
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
        this.formFormio = new formiojs.Formio(this.formUrl);
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
                    formiojs.Utils.eachComponent(_this.form.components, function (component, path) {
                        if (component.key === resourceField) {
                            component.hidden = true;
                            component.clearOnHide = false;
                            ___default.set(_this.resource.data, path, resource);
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
        Promise$1.all(_parentsLoaded).then(function (parents) {
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
        { type: core.Injectable },
    ];
    /** @nocollapse */
    FormioResourceService.ctorParameters = function () { return [
        { type: FormioAppConfig },
        { type: FormioResourceConfig },
        { type: FormioLoader },
        { type: FormioResources, decorators: [{ type: core.Optional }] }
    ]; };
    return FormioResourceService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
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
        { type: core.Component, args: [{
                    template: "<ul class=\"nav nav-tabs\" style=\"margin-bottom: 10px\"> <li class=\"nav-item\"><a class=\"nav-link\" routerLink=\"../\"><i class=\"fa fa-chevron-left glyphicon glyphicon-chevron-left\"></i></a></li> <li class=\"nav-item\" routerLinkActive=\"active\"><a class=\"nav-link\" routerLink=\"view\" routerLinkActive=\"active\">View</a></li> <li class=\"nav-item\" routerLinkActive=\"active\"><a class=\"nav-link\" routerLink=\"edit\" routerLinkActive=\"active\">Edit</a></li> <li class=\"nav-item\" routerLinkActive=\"active\"><a class=\"nav-link\" routerLink=\"delete\" routerLinkActive=\"active\"><span class=\"fa fa-trash glyphicon glyphicon-trash\"></span></a></li> </ul> <router-outlet></router-outlet> "
                },] },
    ];
    /** @nocollapse */
    FormioResourceComponent.ctorParameters = function () { return [
        { type: FormioResourceService },
        { type: router.ActivatedRoute }
    ]; };
    return FormioResourceComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var FormioResourceViewComponent = /** @class */ (function () {
    function FormioResourceViewComponent(service, config) {
        this.service = service;
        this.config = config;
    }
    FormioResourceViewComponent.decorators = [
        { type: core.Component, args: [{
                    template: "<formio [form]=\"service.form\" [submission]=\"service.resource\" [refresh]=\"service.refresh\" [hideComponents]=\"config.parents\" [readOnly]=\"true\" ></formio> "
                },] },
    ];
    /** @nocollapse */
    FormioResourceViewComponent.ctorParameters = function () { return [
        { type: FormioResourceService },
        { type: FormioResourceConfig }
    ]; };
    return FormioResourceViewComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var FormioResourceEditComponent = /** @class */ (function () {
    function FormioResourceEditComponent(service, route, router$$1, config) {
        this.service = service;
        this.route = route;
        this.router = router$$1;
        this.config = config;
    }
    /**
     * @param {?} submission
     * @return {?}
     */
    FormioResourceEditComponent.prototype.onSubmit = /**
     * @param {?} submission
     * @return {?}
     */
    function (submission) {
        var _this = this;
        /** @type {?} */
        var edit = this.service.resource;
        edit.data = submission.data;
        this.service.save(edit).then(function () {
            _this.router.navigate(['../', 'view'], { relativeTo: _this.route });
        });
    };
    FormioResourceEditComponent.decorators = [
        { type: core.Component, args: [{
                    template: "<formio [form]=\"service.form\" [submission]=\"service.resource\" [refresh]=\"service.refresh\" (submit)=\"onSubmit($event)\" ></formio> "
                },] },
    ];
    /** @nocollapse */
    FormioResourceEditComponent.ctorParameters = function () { return [
        { type: FormioResourceService },
        { type: router.ActivatedRoute },
        { type: router.Router },
        { type: FormioResourceConfig }
    ]; };
    return FormioResourceEditComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var FormioResourceDeleteComponent = /** @class */ (function () {
    function FormioResourceDeleteComponent(service, route, router$$1) {
        this.service = service;
        this.route = route;
        this.router = router$$1;
    }
    /**
     * @return {?}
     */
    FormioResourceDeleteComponent.prototype.onDelete = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.service.remove().then(function () {
            _this.router.navigate(['../../'], { relativeTo: _this.route });
        });
    };
    /**
     * @return {?}
     */
    FormioResourceDeleteComponent.prototype.onCancel = /**
     * @return {?}
     */
    function () {
        this.router.navigate(['../', 'view'], { relativeTo: this.route });
    };
    FormioResourceDeleteComponent.decorators = [
        { type: core.Component, args: [{
                    template: "<h3>Are you sure you wish to delete this record?</h3> <div class=\"btn-toolbar\"> <button type=\"button\" (click)=\"onDelete()\" class=\"btn btn-danger\" style=\"margin-right: 10px;\">Yes</button> <button type=\"button\" (click)=\"onCancel()\" class=\"btn btn-danger\">No</button> </div> "
                },] },
    ];
    /** @nocollapse */
    FormioResourceDeleteComponent.ctorParameters = function () { return [
        { type: FormioResourceService },
        { type: router.ActivatedRoute },
        { type: router.Router }
    ]; };
    return FormioResourceDeleteComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var FormioResourceCreateComponent = /** @class */ (function () {
    function FormioResourceCreateComponent(service, route, router$$1, config) {
        this.service = service;
        this.route = route;
        this.router = router$$1;
        this.config = config;
        this.onError = new core.EventEmitter();
        this.onSuccess = new core.EventEmitter();
    }
    /**
     * @return {?}
     */
    FormioResourceCreateComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.service.setContext(this.route);
    };
    /**
     * @param {?} submission
     * @return {?}
     */
    FormioResourceCreateComponent.prototype.onSubmit = /**
     * @param {?} submission
     * @return {?}
     */
    function (submission) {
        var _this = this;
        this.service
            .save(submission)
            .then(function () {
            _this.router.navigate(['../', _this.service.resource._id, 'view'], {
                relativeTo: _this.route
            });
        })
            .catch(function (err) { return _this.onError.emit(err); });
    };
    FormioResourceCreateComponent.decorators = [
        { type: core.Component, args: [{
                    styles: [".back-button { font-size: 0.8em; } "],
                    template: "<h3 *ngIf=\"service.form\" style=\"margin-top:0;\"> <a routerLink=\"../\" class=\"back-button\"> <i class=\"fa fa-chevron-left glyphicon glyphicon-chevron-left\"></i> </a> | New {{ service.form.title }} </h3> <formio [form]=\"service.form\" [submission]=\"service.resource\" [refresh]=\"service.refresh\" [error]=\"onError\" [success]=\"onSuccess\" (submit)=\"onSubmit($event)\" ></formio> "
                },] },
    ];
    /** @nocollapse */
    FormioResourceCreateComponent.ctorParameters = function () { return [
        { type: FormioResourceService },
        { type: router.ActivatedRoute },
        { type: router.Router },
        { type: FormioResourceConfig }
    ]; };
    return FormioResourceCreateComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var FormioResourceIndexComponent = /** @class */ (function () {
    function FormioResourceIndexComponent(service, route, router$$1, config, ref) {
        this.service = service;
        this.route = route;
        this.router = router$$1;
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
                _.each(parents, function (parent) {
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
        { type: core.Component, args: [{
                    template: "<formio-grid *ngIf=\"formTitle\" [src]=\"gridSrc\" [query]=\"gridQuery\" [onForm]=\"service.formLoaded\" (rowSelect)=\"onSelect($event)\" (error)=\"service.onError($event)\" (createItem)=\"onCreateItem()\" [createText]=\"'New ' + formTitle\" ></formio-grid> "
                },] },
    ];
    /** @nocollapse */
    FormioResourceIndexComponent.ctorParameters = function () { return [
        { type: FormioResourceService },
        { type: router.ActivatedRoute },
        { type: router.Router },
        { type: FormioResourceConfig },
        { type: core.ChangeDetectorRef }
    ]; };
    return FormioResourceIndexComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @param {?=} config
 * @return {?}
 */
function FormioResourceRoutes(config) {
    return [
        {
            path: '',
            component: config && config.index ? config.index : FormioResourceIndexComponent
        },
        {
            path: 'new',
            component: config && config.create ? config.create : FormioResourceCreateComponent
        },
        {
            path: ':id',
            component: config && config.resource ? config.resource : FormioResourceComponent,
            children: [
                {
                    path: '',
                    redirectTo: 'view',
                    pathMatch: 'full'
                },
                {
                    path: 'view',
                    component: config && config.view ? config.view : FormioResourceViewComponent
                },
                {
                    path: 'edit',
                    component: config && config.edit ? config.edit : FormioResourceEditComponent
                },
                {
                    path: 'delete',
                    component: config && config.delete ? config.delete : FormioResourceDeleteComponent
                }
            ]
        }
    ];
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var FormioService = /** @class */ (function () {
    function FormioService(url, options) {
        this.url = url;
        this.options = options;
        this.formio = new formiojs.Formio(this.url, this.options);
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    FormioService.prototype.requestWrapper = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        /** @type {?} */
        var record;
        /** @type {?} */
        var called = false;
        return rxjs.Observable.create(function (observer) {
            try {
                if (!called) {
                    called = true;
                    fn()
                        .then(function (_record) {
                        record = _record;
                        observer.next(record);
                        observer.complete();
                    })
                        .catch(function (err) { return observer.error(err); });
                }
                else if (record) {
                    observer.next(record);
                    observer.complete();
                }
            }
            catch (err) {
                observer.error(err);
            }
        });
    };
    /**
     * @param {?} form
     * @return {?}
     */
    FormioService.prototype.saveForm = /**
     * @param {?} form
     * @return {?}
     */
    function (form) {
        var _this = this;
        return this.requestWrapper(function () { return _this.formio.saveForm(form); });
    };
    /**
     * @param {?=} options
     * @return {?}
     */
    FormioService.prototype.loadForm = /**
     * @param {?=} options
     * @return {?}
     */
    function (options) {
        var _this = this;
        return this.requestWrapper(function () { return _this.formio.loadForm(options); });
    };
    /**
     * @return {?}
     */
    FormioService.prototype.loadSubmission = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return this.requestWrapper(function () { return _this.formio.loadSubmission(); });
    };
    /**
     * @param {?} submission
     * @return {?}
     */
    FormioService.prototype.saveSubmission = /**
     * @param {?} submission
     * @return {?}
     */
    function (submission) {
        var _this = this;
        return this.requestWrapper(function () { return _this.formio.saveSubmission(submission); });
    };
    /**
     * @return {?}
     */
    FormioService.prototype.loadSubmissions = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return this.requestWrapper(function () { return _this.formio.loadSubmissions(); });
    };
    return FormioService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @record
 */

var FormioAlerts = /** @class */ (function () {
    function FormioAlerts() {
        this.alerts = [];
    }
    /**
     * @param {?} alert
     * @return {?}
     */
    FormioAlerts.prototype.setAlert = /**
     * @param {?} alert
     * @return {?}
     */
    function (alert) {
        this.alerts = [alert];
    };
    /**
     * @param {?} alert
     * @return {?}
     */
    FormioAlerts.prototype.addAlert = /**
     * @param {?} alert
     * @return {?}
     */
    function (alert) {
        this.alerts.push(alert);
    };
    /**
     * @param {?} alerts
     * @return {?}
     */
    FormioAlerts.prototype.setAlerts = /**
     * @param {?} alerts
     * @return {?}
     */
    function (alerts) {
        this.alerts = alerts;
    };
    return FormioAlerts;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var FormioComponent = /** @class */ (function () {
    function FormioComponent(loader, config) {
        var _this = this;
        this.loader = loader;
        this.config = config;
        this.submission = {};
        this.readOnly = false;
        this.viewOnly = false;
        this.hooks = {};
        if (this.config) {
            formiojs.Formio.setBaseUrl(this.config.apiUrl);
            formiojs.Formio.setProjectUrl(this.config.appUrl);
        }
        else {
            console.warn('You must provide an AppConfig within your application!');
        }
        this.formioReady = new Promise(function (ready) {
            _this.formioReadyResolve = ready;
        });
        this.submitting = false;
        this.alerts = new FormioAlerts();
        this.beforeSubmit = new core.EventEmitter();
        this.prevPage = new core.EventEmitter();
        this.nextPage = new core.EventEmitter();
        this.submit = new core.EventEmitter();
        this.errorChange = new core.EventEmitter();
        this.invalid = new core.EventEmitter();
        this.change = new core.EventEmitter();
        this.customEvent = new core.EventEmitter();
        this.render = new core.EventEmitter();
        this.formLoad = new core.EventEmitter();
        this.ready = new core.EventEmitter();
        this.initialized = false;
        this.alerts.alerts = [];
    }
    /**
     * @param {?} form
     * @return {?}
     */
    FormioComponent.prototype.setForm = /**
     * @param {?} form
     * @return {?}
     */
    function (form) {
        var _this = this;
        this.form = form;
        // Only initialize a single formio instance.
        if (this.formio) {
            this.formio.form = this.form;
            return;
        }
        // Create the form.
        return formiojs.Formio.createForm(this.formioElement ? this.formioElement.nativeElement : null, this.form, _.assign({}, {
            icons: _.get(this.config, 'icons', 'fontawesome'),
            noAlerts: _.get(this.options, 'noAlerts', true),
            readOnly: this.readOnly,
            viewAsHtml: this.viewOnly,
            i18n: _.get(this.options, 'i18n', null),
            fileService: _.get(this.options, 'fileService', null),
            hooks: this.hooks
        }, this.renderOptions || {})).then(function (formio) {
            _this.formio = formio;
            if (_this.url) {
                _this.formio.setUrl(_this.url, _this.formioOptions || {});
            }
            if (_this.src) {
                _this.formio.setUrl(_this.src, _this.formioOptions || {});
            }
            _this.formio.nosubmit = true;
            _this.formio.on('prevPage', function (data) { return _this.onPrevPage(data); });
            _this.formio.on('nextPage', function (data) { return _this.onNextPage(data); });
            _this.formio.on('change', function (value) { return _this.change.emit(value); });
            _this.formio.on('customEvent', function (event) {
                return _this.customEvent.emit(event);
            });
            _this.formio.on('submit', function (submission) {
                return _this.submitForm(submission);
            });
            _this.formio.on('error', function (err) { return _this.onError(err); });
            _this.formio.on('render', function () { return _this.render.emit(); });
            _this.formio.on('formLoad', function (loadedForm) {
                return _this.formLoad.emit(loadedForm);
            });
            _this.loader.loading = false;
            _this.ready.emit(_this);
            _this.formioReadyResolve(_this.formio);
            return _this.formio;
        });
    };
    /**
     * @return {?}
     */
    FormioComponent.prototype.initialize = /**
     * @return {?}
     */
    function () {
        if (this.initialized) {
            return;
        }
        this.options = Object.assign({
            errors: {
                message: 'Please fix the following errors before submitting.'
            },
            alerts: {
                submitMessage: 'Submission Complete.'
            },
            disableAlerts: false,
            hooks: {
                beforeSubmit: null
            }
        }, this.options);
        this.initialized = true;
    };
    /**
     * @return {?}
     */
    FormioComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.initialize();
        if (this.language) {
            this.language.subscribe(function (lang) {
                _this.formio.language = lang;
            });
        }
        if (this.refresh) {
            this.refresh.subscribe(function (refresh) {
                return _this.onRefresh(refresh);
            });
        }
        if (this.error) {
            this.error.subscribe(function (err) { return _this.onError(err); });
        }
        if (this.success) {
            this.success.subscribe(function (message) {
                _this.alerts.setAlert({
                    type: 'success',
                    message: message || _.get(_this.options, 'alerts.submitMessage')
                });
            });
        }
        if (this.src) {
            if (!this.service) {
                this.service = new FormioService(this.src);
            }
            this.loader.loading = true;
            this.service.loadForm({ params: { live: 1 } }).subscribe(function (form) {
                if (form && form.components) {
                    _this.setForm(form);
                }
                // if a submission is also provided.
                if (_.isEmpty(_this.submission) &&
                    _this.service &&
                    _this.service.formio.submissionId) {
                    _this.service.loadSubmission().subscribe(function (submission) {
                        if (_this.readOnly) {
                            _this.formio.options.readOnly = true;
                        }
                        _this.submission = _this.formio.submission = submission;
                    }, function (err) { return _this.onError(err); });
                }
            }, function (err) { return _this.onError(err); });
        }
        if (this.url && !this.service) {
            this.service = new FormioService(this.url);
        }
    };
    /**
     * @param {?} refresh
     * @return {?}
     */
    FormioComponent.prototype.onRefresh = /**
     * @param {?} refresh
     * @return {?}
     */
    function (refresh) {
        var _this = this;
        this.formioReady.then(function () {
            if (refresh.form) {
                _this.formio.setForm(refresh.form).then(function () {
                    if (refresh.submission) {
                        _this.formio.setSubmission(refresh.submission);
                    }
                });
            }
            else if (refresh.submission) {
                _this.formio.setSubmission(refresh.submission);
            }
            else {
                switch (refresh.property) {
                    case 'submission':
                        _this.formio.submission = refresh.value;
                        break;
                    case 'form':
                        _this.formio.form = refresh.value;
                        break;
                }
            }
        });
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    FormioComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        var _this = this;
        this.initialize();
        if (changes.form && changes.form.currentValue) {
            this.setForm(changes.form.currentValue);
        }
        this.formioReady.then(function () {
            if (changes.submission && changes.submission.currentValue) {
                _this.formio.submission = changes.submission.currentValue;
            }
            if (changes.hideComponents) {
                _this.formio.hideComponents(changes.hideComponents.currentValue);
            }
        });
    };
    /**
     * @param {?} data
     * @return {?}
     */
    FormioComponent.prototype.onPrevPage = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        this.alerts.setAlerts([]);
        this.prevPage.emit(data);
    };
    /**
     * @param {?} data
     * @return {?}
     */
    FormioComponent.prototype.onNextPage = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        this.alerts.setAlerts([]);
        this.nextPage.emit(data);
    };
    /**
     * @param {?} submission
     * @param {?} saved
     * @return {?}
     */
    FormioComponent.prototype.onSubmit = /**
     * @param {?} submission
     * @param {?} saved
     * @return {?}
     */
    function (submission, saved) {
        this.submitting = false;
        if (saved) {
            this.formio.emit('submitDone', submission);
        }
        this.submit.emit(submission);
        if (!this.success) {
            this.alerts.setAlert({
                type: 'success',
                message: _.get(this.options, 'alerts.submitMessage')
            });
        }
    };
    /**
     * @param {?} err
     * @return {?}
     */
    FormioComponent.prototype.onError = /**
     * @param {?} err
     * @return {?}
     */
    function (err) {
        var _this = this;
        this.loader.loading = false;
        this.alerts.setAlerts([]);
        this.submitting = false;
        if (!err) {
            return;
        }
        // Make sure it is an array.
        err = err instanceof Array ? err : [err];
        // Emit these errors again.
        this.errorChange.emit(err);
        // Iterate through each one and set the alerts array.
        _.each(err, function (error) {
            _this.alerts.addAlert({
                type: 'danger',
                message: error.message || error.toString()
            });
        });
    };
    /**
     * @param {?} submission
     * @return {?}
     */
    FormioComponent.prototype.submitExecute = /**
     * @param {?} submission
     * @return {?}
     */
    function (submission) {
        var _this = this;
        if (this.service && !this.url) {
            this.service
                .saveSubmission(submission)
                .subscribe(function (sub) { return _this.onSubmit(sub, true); }, function (err) { return _this.onError(err); });
        }
        else {
            this.onSubmit(submission, false);
        }
    };
    /**
     * @param {?} submission
     * @return {?}
     */
    FormioComponent.prototype.submitForm = /**
     * @param {?} submission
     * @return {?}
     */
    function (submission) {
        var _this = this;
        // Keep double submits from occurring...
        if (this.submitting) {
            return;
        }
        this.submitting = true;
        this.beforeSubmit.emit(submission);
        /** @type {?} */
        var beforeSubmit = _.get(this.options, 'hooks.beforeSubmit');
        if (beforeSubmit) {
            beforeSubmit(submission, function (err, sub) {
                if (err) {
                    _this.onError(err);
                    return;
                }
                _this.submitExecute(sub);
            });
        }
        else {
            this.submitExecute(submission);
        }
    };
    FormioComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'formio',
                    template: "<div> <formio-loader></formio-loader> <formio-alerts *ngIf=\"!this.options.disableAlerts\" [alerts]=\"alerts\"></formio-alerts> <div #formio></div> </div> ",
                    styles: [".flatpickr-calendar{background:0 0;opacity:0;display:none;text-align:center;visibility:hidden;padding:0;-webkit-animation:none;animation:none;direction:ltr;border:0;font-size:14px;line-height:24px;border-radius:5px;position:absolute;width:307.875px;-webkit-box-sizing:border-box;box-sizing:border-box;-ms-touch-action:manipulation;touch-action:manipulation;background:#fff;-webkit-box-shadow:1px 0 0 #e6e6e6,-1px 0 0 #e6e6e6,0 1px 0 #e6e6e6,0 -1px 0 #e6e6e6,0 3px 13px rgba(0,0,0,.08);box-shadow:1px 0 0 #e6e6e6,-1px 0 0 #e6e6e6,0 1px 0 #e6e6e6,0 -1px 0 #e6e6e6,0 3px 13px rgba(0,0,0,.08)}.flatpickr-calendar.inline,.flatpickr-calendar.open{opacity:1;max-height:640px;visibility:visible}.flatpickr-calendar.open{display:inline-block;z-index:99999}.flatpickr-calendar.animate.open{-webkit-animation:fpFadeInDown .3s cubic-bezier(.23,1,.32,1);animation:fpFadeInDown .3s cubic-bezier(.23,1,.32,1)}.flatpickr-calendar.inline{display:block;position:relative;top:2px}.flatpickr-calendar.static{position:absolute;top:calc(100% + 2px)}.flatpickr-calendar.static.open{z-index:999;display:block}.flatpickr-calendar.multiMonth .flatpickr-days .dayContainer:nth-child(n+1) .flatpickr-day.inRange:nth-child(7n+7){-webkit-box-shadow:none!important;box-shadow:none!important}.flatpickr-calendar.multiMonth .flatpickr-days .dayContainer:nth-child(n+2) .flatpickr-day.inRange:nth-child(7n+1){-webkit-box-shadow:-2px 0 0 #e6e6e6,5px 0 0 #e6e6e6;box-shadow:-2px 0 0 #e6e6e6,5px 0 0 #e6e6e6}.flatpickr-calendar .hasTime .dayContainer,.flatpickr-calendar .hasWeeks .dayContainer{border-bottom:0;border-bottom-right-radius:0;border-bottom-left-radius:0}.flatpickr-calendar .hasWeeks .dayContainer{border-left:0}.flatpickr-calendar.showTimeInput.hasTime .flatpickr-time{height:40px;border-top:1px solid #e6e6e6}.flatpickr-calendar.noCalendar.hasTime .flatpickr-time{height:auto}.flatpickr-calendar:after,.flatpickr-calendar:before{position:absolute;display:block;pointer-events:none;border:solid transparent;content:'';height:0;width:0;left:22px}.flatpickr-calendar.rightMost:after,.flatpickr-calendar.rightMost:before{left:auto;right:22px}.flatpickr-calendar:before{border-width:5px;margin:0 -5px}.flatpickr-calendar:after{border-width:4px;margin:0 -4px}.flatpickr-calendar.arrowTop:after,.flatpickr-calendar.arrowTop:before{bottom:100%}.flatpickr-calendar.arrowTop:before{border-bottom-color:#e6e6e6}.flatpickr-calendar.arrowTop:after{border-bottom-color:#fff}.flatpickr-calendar.arrowBottom:after,.flatpickr-calendar.arrowBottom:before{top:100%}.flatpickr-calendar.arrowBottom:before{border-top-color:#e6e6e6}.flatpickr-calendar.arrowBottom:after{border-top-color:#fff}.flatpickr-calendar:focus{outline:0}.flatpickr-wrapper{position:relative;display:inline-block}.flatpickr-months{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex}.flatpickr-months .flatpickr-month{background:0 0;color:rgba(0,0,0,.9);fill:rgba(0,0,0,.9);height:28px;line-height:1;text-align:center;position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;overflow:hidden;-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1}.flatpickr-months .flatpickr-next-month,.flatpickr-months .flatpickr-prev-month{text-decoration:none;cursor:pointer;position:absolute;top:0;line-height:16px;height:28px;padding:10px;z-index:3;color:rgba(0,0,0,.9);fill:rgba(0,0,0,.9)}.flatpickr-months .flatpickr-next-month.disabled,.flatpickr-months .flatpickr-prev-month.disabled{display:none}.flatpickr-months .flatpickr-next-month i,.flatpickr-months .flatpickr-prev-month i{position:relative}.flatpickr-months .flatpickr-next-month.flatpickr-prev-month,.flatpickr-months .flatpickr-prev-month.flatpickr-prev-month{left:0}.flatpickr-months .flatpickr-next-month.flatpickr-next-month,.flatpickr-months .flatpickr-prev-month.flatpickr-next-month{right:0}.flatpickr-months .flatpickr-next-month:hover,.flatpickr-months .flatpickr-prev-month:hover{color:#959ea9}.flatpickr-months .flatpickr-next-month:hover svg,.flatpickr-months .flatpickr-prev-month:hover svg{fill:#f64747}.flatpickr-months .flatpickr-next-month svg,.flatpickr-months .flatpickr-prev-month svg{width:14px;height:14px}.flatpickr-months .flatpickr-next-month svg path,.flatpickr-months .flatpickr-prev-month svg path{-webkit-transition:fill .1s;transition:fill .1s;fill:inherit}.numInputWrapper{position:relative;height:auto}.numInputWrapper input,.numInputWrapper span{display:inline-block}.numInputWrapper input{width:100%}.numInputWrapper input::-ms-clear{display:none}.numInputWrapper span{position:absolute;right:0;width:14px;padding:0 4px 0 2px;height:50%;line-height:50%;opacity:0;cursor:pointer;border:1px solid rgba(57,57,57,.15);-webkit-box-sizing:border-box;box-sizing:border-box}.numInputWrapper span:hover{background:rgba(0,0,0,.1)}.numInputWrapper span:active{background:rgba(0,0,0,.2)}.numInputWrapper span:after{display:block;content:\"\";position:absolute}.numInputWrapper span.arrowUp{top:0;border-bottom:0}.numInputWrapper span.arrowUp:after{border-left:4px solid transparent;border-right:4px solid transparent;border-bottom:4px solid rgba(57,57,57,.6);top:26%}.numInputWrapper span.arrowDown{top:50%}.numInputWrapper span.arrowDown:after{border-left:4px solid transparent;border-right:4px solid transparent;border-top:4px solid rgba(57,57,57,.6);top:40%}.numInputWrapper span svg{width:inherit;height:auto}.numInputWrapper span svg path{fill:rgba(0,0,0,.5)}.numInputWrapper:hover{background:rgba(0,0,0,.05)}.numInputWrapper:hover span{opacity:1}.flatpickr-current-month{font-size:135%;line-height:inherit;font-weight:300;color:inherit;position:absolute;width:75%;left:12.5%;padding:6.16px 0 0 0;line-height:1;height:28px;display:inline-block;text-align:center;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}.flatpickr-current-month span.cur-month{font-family:inherit;font-weight:700;color:inherit;display:inline-block;margin-left:.5ch;padding:0}.flatpickr-current-month span.cur-month:hover{background:rgba(0,0,0,.05)}.flatpickr-current-month .numInputWrapper{width:6ch;width:7ch\0;display:inline-block}.flatpickr-current-month .numInputWrapper span.arrowUp:after{border-bottom-color:rgba(0,0,0,.9)}.flatpickr-current-month .numInputWrapper span.arrowDown:after{border-top-color:rgba(0,0,0,.9)}.flatpickr-current-month input.cur-year{background:0 0;-webkit-box-sizing:border-box;box-sizing:border-box;color:inherit;cursor:text;padding:0 0 0 .5ch;margin:0;display:inline-block;font-size:inherit;font-family:inherit;font-weight:300;line-height:inherit;height:auto;border:0;border-radius:0;vertical-align:initial}.flatpickr-current-month input.cur-year:focus{outline:0}.flatpickr-current-month input.cur-year[disabled],.flatpickr-current-month input.cur-year[disabled]:hover{font-size:100%;color:rgba(0,0,0,.5);background:0 0;pointer-events:none}.flatpickr-weekdays{background:0 0;text-align:center;overflow:hidden;width:100%;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;height:28px}.flatpickr-weekdays .flatpickr-weekdaycontainer{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1}span.flatpickr-weekday{cursor:default;font-size:90%;background:0 0;color:rgba(0,0,0,.54);line-height:1;margin:0;text-align:center;display:block;-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;font-weight:bolder}.dayContainer,.flatpickr-weeks{padding:1px 0 0 0}.flatpickr-days{position:relative;overflow:hidden;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:start;-webkit-align-items:flex-start;-ms-flex-align:start;align-items:flex-start;width:307.875px}.flatpickr-days:focus{outline:0}.dayContainer{padding:0;outline:0;text-align:left;width:307.875px;min-width:307.875px;max-width:307.875px;-webkit-box-sizing:border-box;box-sizing:border-box;display:inline-block;display:-ms-flexbox;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-flex-wrap:wrap;flex-wrap:wrap;-ms-flex-wrap:wrap;-ms-flex-pack:justify;-webkit-justify-content:space-around;justify-content:space-around;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0);opacity:1}.dayContainer+.dayContainer{-webkit-box-shadow:-1px 0 0 #e6e6e6;box-shadow:-1px 0 0 #e6e6e6}.flatpickr-day{background:0 0;border:1px solid transparent;border-radius:150px;-webkit-box-sizing:border-box;box-sizing:border-box;color:#393939;cursor:pointer;font-weight:400;width:14.2857143%;-webkit-flex-basis:14.2857143%;-ms-flex-preferred-size:14.2857143%;flex-basis:14.2857143%;max-width:39px;height:39px;line-height:39px;margin:0;display:inline-block;position:relative;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;text-align:center}.flatpickr-day.inRange,.flatpickr-day.nextMonthDay.inRange,.flatpickr-day.nextMonthDay.today.inRange,.flatpickr-day.nextMonthDay:focus,.flatpickr-day.nextMonthDay:hover,.flatpickr-day.prevMonthDay.inRange,.flatpickr-day.prevMonthDay.today.inRange,.flatpickr-day.prevMonthDay:focus,.flatpickr-day.prevMonthDay:hover,.flatpickr-day.today.inRange,.flatpickr-day:focus,.flatpickr-day:hover{cursor:pointer;outline:0;background:#e6e6e6;border-color:#e6e6e6}.flatpickr-day.today{border-color:#959ea9}.flatpickr-day.today:focus,.flatpickr-day.today:hover{border-color:#959ea9;background:#959ea9;color:#fff}.flatpickr-day.endRange,.flatpickr-day.endRange.inRange,.flatpickr-day.endRange.nextMonthDay,.flatpickr-day.endRange.prevMonthDay,.flatpickr-day.endRange:focus,.flatpickr-day.endRange:hover,.flatpickr-day.selected,.flatpickr-day.selected.inRange,.flatpickr-day.selected.nextMonthDay,.flatpickr-day.selected.prevMonthDay,.flatpickr-day.selected:focus,.flatpickr-day.selected:hover,.flatpickr-day.startRange,.flatpickr-day.startRange.inRange,.flatpickr-day.startRange.nextMonthDay,.flatpickr-day.startRange.prevMonthDay,.flatpickr-day.startRange:focus,.flatpickr-day.startRange:hover{background:#569ff7;-webkit-box-shadow:none;box-shadow:none;color:#fff;border-color:#569ff7}.flatpickr-day.endRange.startRange,.flatpickr-day.selected.startRange,.flatpickr-day.startRange.startRange{border-radius:50px 0 0 50px}.flatpickr-day.endRange.endRange,.flatpickr-day.selected.endRange,.flatpickr-day.startRange.endRange{border-radius:0 50px 50px 0}.flatpickr-day.endRange.startRange+.endRange:not(:nth-child(7n+1)),.flatpickr-day.selected.startRange+.endRange:not(:nth-child(7n+1)),.flatpickr-day.startRange.startRange+.endRange:not(:nth-child(7n+1)){-webkit-box-shadow:-10px 0 0 #569ff7;box-shadow:-10px 0 0 #569ff7}.flatpickr-day.endRange.startRange.endRange,.flatpickr-day.selected.startRange.endRange,.flatpickr-day.startRange.startRange.endRange{border-radius:50px}.flatpickr-day.inRange{border-radius:0;-webkit-box-shadow:-5px 0 0 #e6e6e6,5px 0 0 #e6e6e6;box-shadow:-5px 0 0 #e6e6e6,5px 0 0 #e6e6e6}.flatpickr-day.disabled,.flatpickr-day.disabled:hover,.flatpickr-day.nextMonthDay,.flatpickr-day.notAllowed,.flatpickr-day.notAllowed.nextMonthDay,.flatpickr-day.notAllowed.prevMonthDay,.flatpickr-day.prevMonthDay{color:rgba(57,57,57,.3);background:0 0;border-color:transparent;cursor:default}.flatpickr-day.disabled,.flatpickr-day.disabled:hover{cursor:not-allowed;color:rgba(57,57,57,.1)}.flatpickr-day.week.selected{border-radius:0;-webkit-box-shadow:-5px 0 0 #569ff7,5px 0 0 #569ff7;box-shadow:-5px 0 0 #569ff7,5px 0 0 #569ff7}.flatpickr-day.hidden{visibility:hidden}.rangeMode .flatpickr-day{margin-top:1px}.flatpickr-weekwrapper{display:inline-block;float:left}.flatpickr-weekwrapper .flatpickr-weeks{padding:0 12px;-webkit-box-shadow:1px 0 0 #e6e6e6;box-shadow:1px 0 0 #e6e6e6}.flatpickr-weekwrapper .flatpickr-weekday{float:none;width:100%;line-height:28px}.flatpickr-weekwrapper span.flatpickr-day,.flatpickr-weekwrapper span.flatpickr-day:hover{display:block;width:100%;max-width:none;color:rgba(57,57,57,.3);background:0 0;cursor:default;border:none}.flatpickr-innerContainer{display:block;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-sizing:border-box;box-sizing:border-box;overflow:hidden}.flatpickr-rContainer{display:inline-block;padding:0;-webkit-box-sizing:border-box;box-sizing:border-box}.flatpickr-time{text-align:center;outline:0;display:block;height:0;line-height:40px;max-height:40px;-webkit-box-sizing:border-box;box-sizing:border-box;overflow:hidden;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex}.flatpickr-time:after{content:\"\";display:table;clear:both}.flatpickr-time .numInputWrapper{-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;width:40%;height:40px;float:left}.flatpickr-time .numInputWrapper span.arrowUp:after{border-bottom-color:#393939}.flatpickr-time .numInputWrapper span.arrowDown:after{border-top-color:#393939}.flatpickr-time.hasSeconds .numInputWrapper{width:26%}.flatpickr-time.time24hr .numInputWrapper{width:49%}.flatpickr-time input{background:0 0;-webkit-box-shadow:none;box-shadow:none;border:0;border-radius:0;text-align:center;margin:0;padding:0;height:inherit;line-height:inherit;color:#393939;font-size:14px;position:relative;-webkit-box-sizing:border-box;box-sizing:border-box}.flatpickr-time input.flatpickr-hour{font-weight:700}.flatpickr-time input.flatpickr-minute,.flatpickr-time input.flatpickr-second{font-weight:400}.flatpickr-time input:focus{outline:0;border:0}.flatpickr-time .flatpickr-am-pm,.flatpickr-time .flatpickr-time-separator{height:inherit;display:inline-block;float:left;line-height:inherit;color:#393939;font-weight:700;width:2%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-align-self:center;-ms-flex-item-align:center;align-self:center}.flatpickr-time .flatpickr-am-pm{outline:0;width:18%;cursor:pointer;text-align:center;font-weight:400}.flatpickr-time .flatpickr-am-pm:focus,.flatpickr-time .flatpickr-am-pm:hover,.flatpickr-time input:focus,.flatpickr-time input:hover{background:#f3f3f3}.flatpickr-input[readonly]{cursor:pointer}@-webkit-keyframes fpFadeInDown{from{opacity:0;-webkit-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}to{opacity:1;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@keyframes fpFadeInDown{from{opacity:0;-webkit-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}to{opacity:1;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}.choices{position:relative;margin-bottom:24px;font-size:16px}.choices:focus{outline:0}.choices:last-child{margin-bottom:0}.choices.is-disabled .choices__inner,.choices.is-disabled .choices__input{background-color:#eaeaea;cursor:not-allowed;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.choices.is-disabled .choices__item{cursor:not-allowed}.choices[data-type*=select-one]{cursor:pointer}.choices[data-type*=select-one] .choices__inner{padding-bottom:7.5px}.choices[data-type*=select-one] .choices__input{display:block;width:100%;padding:10px;border-bottom:1px solid #ddd;background-color:#fff;margin:0}.choices[data-type*=select-one] .choices__button{background-image:url(../../../node_modules/formiojs/dist/icons/cross-inverse.svg);padding:0;background-size:8px;position:absolute;top:50%;right:0;margin-top:-10px;margin-right:25px;height:20px;width:20px;border-radius:10em;opacity:.5}.choices[data-type*=select-one] .choices__button:focus,.choices[data-type*=select-one] .choices__button:hover{opacity:1}.choices[data-type*=select-one] .choices__button:focus{box-shadow:0 0 0 2px #00bcd4}.choices[data-type*=select-one]:after{content:\"\";height:0;width:0;border-style:solid;border-color:#333 transparent transparent transparent;border-width:5px;position:absolute;right:11.5px;top:50%;margin-top:-2.5px;pointer-events:none}.choices[data-type*=select-one].is-open:after{border-color:transparent transparent #333 transparent;margin-top:-7.5px}.choices[data-type*=select-one][dir=rtl]:after{left:11.5px;right:auto}.choices[data-type*=select-one][dir=rtl] .choices__button{right:auto;left:0;margin-left:25px;margin-right:0}.choices[data-type*=select-multiple] .choices__inner,.choices[data-type*=text] .choices__inner{cursor:text}.choices[data-type*=select-multiple] .choices__button,.choices[data-type*=text] .choices__button{position:relative;display:inline-block;margin:0 -4px 0 8px;padding-left:16px;border-left:1px solid #008fa1;background-image:url(../../../node_modules/formiojs/dist/icons/cross.svg);background-size:8px;width:8px;line-height:1;opacity:.75}.choices[data-type*=select-multiple] .choices__button:focus,.choices[data-type*=select-multiple] .choices__button:hover,.choices[data-type*=text] .choices__button:focus,.choices[data-type*=text] .choices__button:hover{opacity:1}.choices__inner{display:inline-block;vertical-align:top;width:100%;background-color:#f9f9f9;padding:7.5px 7.5px 3.75px;border:1px solid #ddd;border-radius:2.5px;font-size:14px;min-height:44px;overflow:hidden}.is-focused .choices__inner,.is-open .choices__inner{border-color:#b7b7b7}.is-open .choices__inner{border-radius:2.5px 2.5px 0 0}.is-flipped.is-open .choices__inner{border-radius:0 0 2.5px 2.5px}.choices__list{margin:0;padding-left:0;list-style:none}.choices__list--single{display:inline-block;padding:4px 16px 4px 4px;width:100%}[dir=rtl] .choices__list--single{padding-right:4px;padding-left:16px}.choices__list--single .choices__item{width:100%}.choices__list--multiple{display:inline}.choices__list--multiple .choices__item{display:inline-block;vertical-align:middle;border-radius:20px;padding:4px 10px;font-size:12px;font-weight:500;margin-right:3.75px;margin-bottom:3.75px;background-color:#00bcd4;border:1px solid #00a5bb;color:#fff;word-break:break-all}.choices__list--multiple .choices__item[data-deletable]{padding-right:5px}[dir=rtl] .choices__list--multiple .choices__item{margin-right:0;margin-left:3.75px}.choices__list--multiple .choices__item.is-highlighted{background-color:#00a5bb;border:1px solid #008fa1}.is-disabled .choices__list--multiple .choices__item{background-color:#aaa;border:1px solid #919191}.choices__list--dropdown{display:none;z-index:1;position:absolute;width:100%;background-color:#fff;border:1px solid #ddd;top:100%;margin-top:-1px;border-bottom-left-radius:2.5px;border-bottom-right-radius:2.5px;overflow:hidden;word-break:break-all}.choices__list--dropdown.is-active{display:block}.is-open .choices__list--dropdown{border-color:#b7b7b7}.is-flipped .choices__list--dropdown{top:auto;bottom:100%;margin-top:0;margin-bottom:-1px;border-radius:.25rem .25rem 0 0}.choices__list--dropdown .choices__list{position:relative;max-height:300px;overflow:auto;-webkit-overflow-scrolling:touch;will-change:scroll-position}.choices__list--dropdown .choices__item{position:relative;padding:10px;font-size:14px}[dir=rtl] .choices__list--dropdown .choices__item{text-align:right}@media (min-width:640px){.choices__list--dropdown .choices__item--selectable{padding-right:100px}.choices__list--dropdown .choices__item--selectable:after{content:attr(data-select-text);font-size:12px;opacity:0;position:absolute;right:10px;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%)}[dir=rtl] .choices__list--dropdown .choices__item--selectable{text-align:right;padding-left:100px;padding-right:10px}[dir=rtl] .choices__list--dropdown .choices__item--selectable:after{right:auto;left:10px}}.choices__list--dropdown .choices__item--selectable.is-highlighted{background-color:#f2f2f2}.choices__list--dropdown .choices__item--selectable.is-highlighted:after{opacity:.5}.choices__item{cursor:default}.choices__item--selectable{cursor:pointer}.choices__item--disabled{cursor:not-allowed;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;opacity:.5}.choices__heading{font-weight:600;font-size:12px;padding:10px;border-bottom:1px solid #f7f7f7;color:gray}.choices__button{text-indent:-9999px;-webkit-appearance:none;-moz-appearance:none;appearance:none;border:0;background-color:transparent;background-repeat:no-repeat;background-position:center;cursor:pointer}.choices__button:focus{outline:0}.choices__input{display:inline-block;vertical-align:baseline;background-color:#f9f9f9;font-size:14px;margin-bottom:5px;border:0;border-radius:0;max-width:100%;padding:4px 0 4px 2px}.choices__input:focus{outline:0}[dir=rtl] .choices__input{padding-right:2px;padding-left:0}.choices__placeholder{opacity:.5}dialog{position:absolute;left:0;right:0;width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content;margin:auto;border:solid;padding:1em;background:#fff;color:#000;display:block}dialog:not([open]){display:none}dialog+.backdrop{position:fixed;top:0;right:0;bottom:0;left:0;background:rgba(0,0,0,.1)}._dialog_overlay{position:fixed;top:0;right:0;bottom:0;left:0}dialog.fixed{position:fixed;top:50%;transform:translate(0,-50%)}.formio-form{position:relative;min-height:80px}.formio-disabled-input .form-control.flatpickr-input{background-color:#eee}.formio-component.has-error .invalid-feedback{display:block}.formio-wysiwyg-editor{min-height:200px;background-color:#fff}.has-feedback .form-control{padding-right:10px}.has-feedback .form-control[type=hidden]{padding-right:0}.has-error.bg-danger{padding:4px}.ql-source:after{content:\"[source]\"}.quill-source-code{width:100%;margin:0;background:#1d1d1d;box-sizing:border-box;color:#ccc;font-size:15px;outline:0;padding:20px;line-height:24px;font-family:Consolas,Menlo,Monaco,\"Courier New\",monospace;position:absolute;top:0;bottom:0;border:none;display:none}.formio-component-tags tags{background-color:#fff}.field-required:after{content:\" *\";color:red}.glyphicon-spin{-webkit-animation:formio-spin 1s infinite linear;-moz-animation:formio-spin 1s infinite linear;-o-animation:formio-spin 1s infinite linear;animation:formio-spin 1s infinite linear}@-moz-keyframes formio-spin{from{-moz-transform:rotate(0)}to{-moz-transform:rotate(360deg)}}@-webkit-keyframes formio-spin{from{-webkit-transform:rotate(0)}to{-webkit-transform:rotate(360deg)}}@keyframes formio-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}.button-icon-right{margin-left:5px}.formio-component-submit .submit-success::after{font-family:'Glyphicons Halflings';content:'\e013';position:relative;right:-4px;top:1;line-height:1}.formio-component-submit .submit-fail::after{font-family:'Glyphicons Halflings';content:'\e014';position:relative;right:-4px;top:1;line-height:1}.formio-component-submit .submit-fail[disabled]{opacity:1}.form-control.flatpickr-input{background-color:#fff}td>.form-group{margin-bottom:0}.signature-pad{position:relative}.signature-pad-body{overflow:hidden}.signature-pad-canvas{border-radius:4px;box-shadow:0 0 5px rgba(0,0,0,.02) inset;border:1px solid #f4f4f4}.btn.signature-pad-refresh{position:absolute;left:0;top:0;z-index:1000;padding:3px;line-height:0}.choices__list--dropdown .choices__item--selectable{padding-right:0}.signature-pad-refresh img{height:1.2em}.signature-pad-footer{text-align:center;color:#c3c3c3}.loader-wrapper{z-index:1000;position:absolute;top:0;left:0;bottom:0;right:0;background-color:rgba(0,0,0,.1)}.loader{position:absolute;left:50%;top:50%;margin-left:-30px;margin-top:-30px;z-index:10000;display:inline-block;border:6px solid #f3f3f3;border-top:6px solid #3498db;border-radius:50%;width:60px;height:60px;animation:spin 2s linear infinite}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}.choices__list--dropdown{z-index:100}.choices__list--multiple .choices__item{border-radius:0;padding:2px 8px;line-height:1em;margin-bottom:6px}.choices__list--single{padding:0}.choices__input{padding:2px}.formio-component-file .fileSelector{padding:15px;border:2px dashed #ddd;text-align:center}.formio-component-file .fileSelector.fileDragOver{border-color:#127abe}.formio-component-file .fileSelector .fa,.formio-component-file .fileSelector .glyphicon{font-size:20px;margin-right:5px}.formio-component-file .fileSelector .browse{cursor:pointer}@-webkit-keyframes formio-dialog-fadeout{0%{opacity:1}100%{opacity:0}}@keyframes formio-dialog-fadeout{0%{opacity:1}100%{opacity:0}}@-webkit-keyframes formio-dialog-fadein{0%{opacity:0}100%{opacity:1}}@keyframes formio-dialog-fadein{0%{opacity:0}100%{opacity:1}}.formio-dialog{box-sizing:border-box;font-size:.8em;color:#666}.formio-dialog *,.formio-dialog :after,.formio-dialog :before{box-sizing:inherit}.formio-dialog{position:fixed;overflow:auto;-webkit-overflow-scrolling:touch;z-index:10000;top:0;right:0;bottom:0;left:0;background:rgba(0,0,0,.4);animation:formio-dialog-fadein .5s}.formio-dialog.formio-dialog-disabled-animation,.formio-dialog.formio-dialog-disabled-animation .formio-dialog-content,.formio-dialog.formio-dialog-disabled-animation .formio-dialog-overlay{-webkit-animation:none!important;animation:none!important}.formio-dialog-overlay{position:fixed;top:0;right:0;bottom:0;left:0;-webkit-backface-visibility:hidden;-webkit-animation:formio-dialog-fadein .5s;animation:formio-dialog-fadein .5s;margin-right:15px;background:0 0}.formio-dialog-no-overlay{pointer-events:none}.formio-dialog.formio-dialog-closing .formio-dialog-overlay{-webkit-backface-visibility:hidden;-webkit-animation:formio-dialog-fadeout .5s;animation:formio-dialog-fadeout .5s}.formio-dialog-content{background:#fff;-webkit-backface-visibility:hidden;-webkit-animation:formio-dialog-fadein .5s;animation:formio-dialog-fadein .5s;pointer-events:all}.formio-dialog.formio-dialog-closing .formio-dialog-content{-webkit-backface-visibility:hidden;-webkit-animation:formio-dialog-fadeout .5s;animation:formio-dialog-fadeout .5s}.formio-dialog-close:before{font-family:Helvetica,Arial,sans-serif;content:'×';cursor:pointer}body.formio-dialog-open,html.formio-dialog-open{overflow:hidden}@-webkit-keyframes formio-dialog-flyin{0%{opacity:0;-webkit-transform:translateY(-40px);transform:translateY(-40px)}100%{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}}@keyframes formio-dialog-flyin{0%{opacity:0;-webkit-transform:translateY(-40px);transform:translateY(-40px)}100%{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}}@-webkit-keyframes formio-dialog-flyout{0%{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}100%{opacity:0;-webkit-transform:translateY(-40px);transform:translateY(-40px)}}@keyframes formio-dialog-flyout{0%{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}100%{opacity:0;-webkit-transform:translateY(-40px);transform:translateY(-40px)}}.formio-dialog.formio-dialog-theme-default{padding-bottom:160px;padding-top:160px}.formio-dialog.formio-dialog-theme-default.formio-dialog-closing .formio-dialog-content{-webkit-animation:formio-dialog-flyout .5s;animation:formio-dialog-flyout .5s}.formio-dialog.formio-dialog-theme-default .formio-dialog-content{-webkit-animation:formio-dialog-flyin .5s;animation:formio-dialog-flyin .5s;background:#f0f0f0;border-radius:5px;font-family:Helvetica,sans-serif;font-size:1.1em;line-height:1.5em;margin:0 auto;max-width:100%;padding:1em;position:relative;width:65%}.formio-dialog.formio-dialog-theme-default .formio-dialog-close{border:none;background:0 0;cursor:pointer;position:absolute;right:0;top:0}.formio-clickable{cursor:pointer}.component-settings .nav>li>a{padding:8px 10px}.formio-dialog.formio-dialog-theme-default .formio-dialog-close:before{display:block;padding:3px;background:0 0;color:#bbb;content:'×';font-size:26px;font-weight:400;line-height:26px;text-align:center}.formio-dialog.formio-dialog-theme-default .formio-dialog-close:active:before,.formio-dialog.formio-dialog-theme-default .formio-dialog-close:hover:before{color:#777}.formio-dialog.formio-dialog-theme-default .formio-dialog-message{margin-bottom:.5em}.formio-dialog.formio-dialog-theme-default .formio-dialog-input{margin-bottom:1em}.formio-dialog.formio-dialog-theme-default .formio-dialog-input input[type=email],.formio-dialog.formio-dialog-theme-default .formio-dialog-input input[type=password],.formio-dialog.formio-dialog-theme-default .formio-dialog-input input[type=text],.formio-dialog.formio-dialog-theme-default .formio-dialog-input input[type=url],.formio-dialog.formio-dialog-theme-default .formio-dialog-input textarea{background:#fff;border:0;border-radius:3px;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0 0 .25em;min-height:2.5em;padding:.25em .67em;width:100%}.formio-dialog.formio-dialog-theme-default .formio-dialog-input input[type=email]:focus,.formio-dialog.formio-dialog-theme-default .formio-dialog-input input[type=password]:focus,.formio-dialog.formio-dialog-theme-default .formio-dialog-input input[type=text]:focus,.formio-dialog.formio-dialog-theme-default .formio-dialog-input input[type=url]:focus,.formio-dialog.formio-dialog-theme-default .formio-dialog-input textarea:focus{box-shadow:inset 0 0 0 2px #8dbdf1;outline:0}.formio-dialog.formio-dialog-theme-default .formio-dialog-buttons{*zoom:1}.formio-dialog.formio-dialog-theme-default .formio-dialog-buttons:after{content:'';display:table;clear:both}.formio-dialog.formio-dialog-theme-default .formio-dialog-button{border:0;border-radius:3px;cursor:pointer;float:right;font-family:inherit;font-size:.8em;letter-spacing:.1em;line-height:1em;margin:0 0 0 .5em;padding:.75em 2em;text-transform:uppercase}.formio-dialog.formio-dialog-theme-default .formio-dialog-button:focus{-webkit-animation:formio-dialog-pulse 1.1s infinite;animation:formio-dialog-pulse 1.1s infinite;outline:0}@media (max-width:568px){.formio-dialog.formio-dialog-theme-default .formio-dialog-button:focus{-webkit-animation:none;animation:none}}.formio-dialog.formio-dialog-theme-default .formio-dialog-button.formio-dialog-button-primary{background:#3288e6;color:#fff}.formio-dialog.formio-dialog-theme-default .formio-dialog-button.formio-dialog-button-secondary{background:#e0e0e0;color:#777}.formio-dialog-content .panel{margin:0}.formio-placeholder{position:absolute;color:#999}.formio-dialog .formio-dialog-close{cursor:pointer}.formio-iframe{border:none;width:100%;height:1000px}.inline-form-button{margin-right:10px}.tooltip{opacity:1}.tooltip[x-placement=right] .tooltip-arrow{border-right:5px solid #000}.tooltip[x-placement=right] .tooltip-inner{margin-left:8px}.control-label--bottom{margin-bottom:0;margin-top:5px}.formio-component-label-hidden{position:relative}.control-label--hidden{position:absolute;top:6px;right:5px;font-size:1.5em}.formio-component-datetime .control-label--hidden.field-required{right:45px;z-index:3}.formio-component-selectboxes .control-label--hidden.field-required,.formio-component-survey .control-label--hidden.field-required{top:0}.formio-component-resource .control-label--hidden.field-required,.formio-component-select .control-label--hidden.field-required{right:40px;z-index:2}.checkbox-inline label,.radio-inline label{font-weight:400;cursor:pointer}.editgrid-listgroup{margin-bottom:10px}.formio-component-submit .has-error{display:none}.formio-component-submit button[disabled]+.has-error{display:block}.formio-choices.form-group{margin-bottom:0}.formio-choices[data-type=select-multiple] .form-control{height:auto}.form-control.formio-multiple-mask-select{width:15%;z-index:4}.form-control.formio-multiple-mask-input{width:85%}.input-group.formio-multiple-mask-container{width:100%}.formio-component .table{margin-bottom:0}.formio-hide-label-panel-tooltip{margin-top:-10px;margin-left:-10px}.is-disabled .choices__list--multiple .choices__item{padding:5px 10px}.is-disabled .choices__list--multiple .choices__item .choices__button{display:none}.formio-collapse-icon{cursor:pointer;color:#666;font-size:.6em;border:1px solid #ccc;border-radius:.3em;padding:.2em .4em;vertical-align:top;margin-right:4px;margin-top:1px}"],
                    encapsulation: core.ViewEncapsulation.None
                },] },
    ];
    /** @nocollapse */
    FormioComponent.ctorParameters = function () { return [
        { type: FormioLoader },
        { type: FormioAppConfig, decorators: [{ type: core.Optional }] }
    ]; };
    FormioComponent.propDecorators = {
        form: [{ type: core.Input }],
        submission: [{ type: core.Input }],
        src: [{ type: core.Input }],
        url: [{ type: core.Input }],
        service: [{ type: core.Input }],
        options: [{ type: core.Input }],
        formioOptions: [{ type: core.Input }],
        renderOptions: [{ type: core.Input }],
        readOnly: [{ type: core.Input }],
        viewOnly: [{ type: core.Input }],
        hideComponents: [{ type: core.Input }],
        refresh: [{ type: core.Input }],
        error: [{ type: core.Input }],
        success: [{ type: core.Input }],
        language: [{ type: core.Input }],
        hooks: [{ type: core.Input }],
        render: [{ type: core.Output }],
        customEvent: [{ type: core.Output }],
        submit: [{ type: core.Output }],
        prevPage: [{ type: core.Output }],
        nextPage: [{ type: core.Output }],
        beforeSubmit: [{ type: core.Output }],
        change: [{ type: core.Output }],
        invalid: [{ type: core.Output }],
        errorChange: [{ type: core.Output }],
        formLoad: [{ type: core.Output }],
        ready: [{ type: core.Output }],
        formioElement: [{ type: core.ViewChild, args: ['formio',] }]
    };
    return FormioComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var FormBuilderComponent = /** @class */ (function () {
    function FormBuilderComponent(config) {
        var _this = this;
        this.config = config;
        if (this.config) {
            formiojs.Formio.setBaseUrl(this.config.apiUrl);
            formiojs.Formio.setProjectUrl(this.config.appUrl);
        }
        else {
            console.warn('You must provide an AppConfig within your application!');
        }
        this.change = new core.EventEmitter();
        this.ready = new Promise(function (resolve) {
            _this.readyResolve = resolve;
        });
    }
    /**
     * @param {?} display
     * @return {?}
     */
    FormBuilderComponent.prototype.setDisplay = /**
     * @param {?} display
     * @return {?}
     */
    function (display) {
        return this.builder.setDisplay(display);
    };
    /**
     * @param {?} form
     * @return {?}
     */
    FormBuilderComponent.prototype.buildForm = /**
     * @param {?} form
     * @return {?}
     */
    function (form) {
        var _this = this;
        if (!form || !this.builderElement || !this.builderElement.nativeElement) {
            return;
        }
        if (this.builder) {
            return this.builder.instance.form = form;
        }
        this.builder = new formiojs.Formio.FormBuilder(this.builderElement.nativeElement, form, _.assign({ icons: 'fontawesome' }, this.options || {}));
        this.builder.render().then(function (instance) {
            _this.formio = instance;
            instance.on('saveComponent', function () { return _this.change.emit({
                type: 'saveComponent',
                form: instance.schema
            }); });
            instance.on('updateComponent', function () { return _this.change.emit({
                type: 'updateComponent',
                form: instance.schema
            }); });
            instance.on('deleteComponent', function () { return _this.change.emit({
                type: 'deleteComponent',
                form: instance.schema
            }); });
            _this.readyResolve(instance);
            return instance;
        });
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    FormBuilderComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes.form && changes.form.currentValue) {
            this.buildForm(changes.form.currentValue || { components: [] });
        }
    };
    /**
     * @return {?}
     */
    FormBuilderComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        this.buildForm(this.form);
    };
    FormBuilderComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'form-builder',
                    template: "<div #builder></div> ",
                    styles: [".flatpickr-calendar{background:0 0;opacity:0;display:none;text-align:center;visibility:hidden;padding:0;-webkit-animation:none;animation:none;direction:ltr;border:0;font-size:14px;line-height:24px;border-radius:5px;position:absolute;width:307.875px;-webkit-box-sizing:border-box;box-sizing:border-box;-ms-touch-action:manipulation;touch-action:manipulation;background:#fff;-webkit-box-shadow:1px 0 0 #e6e6e6,-1px 0 0 #e6e6e6,0 1px 0 #e6e6e6,0 -1px 0 #e6e6e6,0 3px 13px rgba(0,0,0,.08);box-shadow:1px 0 0 #e6e6e6,-1px 0 0 #e6e6e6,0 1px 0 #e6e6e6,0 -1px 0 #e6e6e6,0 3px 13px rgba(0,0,0,.08)}.flatpickr-calendar.inline,.flatpickr-calendar.open{opacity:1;max-height:640px;visibility:visible}.flatpickr-calendar.open{display:inline-block;z-index:99999}.flatpickr-calendar.animate.open{-webkit-animation:fpFadeInDown .3s cubic-bezier(.23,1,.32,1);animation:fpFadeInDown .3s cubic-bezier(.23,1,.32,1)}.flatpickr-calendar.inline{display:block;position:relative;top:2px}.flatpickr-calendar.static{position:absolute;top:calc(100% + 2px)}.flatpickr-calendar.static.open{z-index:999;display:block}.flatpickr-calendar.multiMonth .flatpickr-days .dayContainer:nth-child(n+1) .flatpickr-day.inRange:nth-child(7n+7){-webkit-box-shadow:none!important;box-shadow:none!important}.flatpickr-calendar.multiMonth .flatpickr-days .dayContainer:nth-child(n+2) .flatpickr-day.inRange:nth-child(7n+1){-webkit-box-shadow:-2px 0 0 #e6e6e6,5px 0 0 #e6e6e6;box-shadow:-2px 0 0 #e6e6e6,5px 0 0 #e6e6e6}.flatpickr-calendar .hasTime .dayContainer,.flatpickr-calendar .hasWeeks .dayContainer{border-bottom:0;border-bottom-right-radius:0;border-bottom-left-radius:0}.flatpickr-calendar .hasWeeks .dayContainer{border-left:0}.flatpickr-calendar.showTimeInput.hasTime .flatpickr-time{height:40px;border-top:1px solid #e6e6e6}.flatpickr-calendar.noCalendar.hasTime .flatpickr-time{height:auto}.flatpickr-calendar:after,.flatpickr-calendar:before{position:absolute;display:block;pointer-events:none;border:solid transparent;content:'';height:0;width:0;left:22px}.flatpickr-calendar.rightMost:after,.flatpickr-calendar.rightMost:before{left:auto;right:22px}.flatpickr-calendar:before{border-width:5px;margin:0 -5px}.flatpickr-calendar:after{border-width:4px;margin:0 -4px}.flatpickr-calendar.arrowTop:after,.flatpickr-calendar.arrowTop:before{bottom:100%}.flatpickr-calendar.arrowTop:before{border-bottom-color:#e6e6e6}.flatpickr-calendar.arrowTop:after{border-bottom-color:#fff}.flatpickr-calendar.arrowBottom:after,.flatpickr-calendar.arrowBottom:before{top:100%}.flatpickr-calendar.arrowBottom:before{border-top-color:#e6e6e6}.flatpickr-calendar.arrowBottom:after{border-top-color:#fff}.flatpickr-calendar:focus{outline:0}.flatpickr-wrapper{position:relative;display:inline-block}.flatpickr-months{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex}.flatpickr-months .flatpickr-month{background:0 0;color:rgba(0,0,0,.9);fill:rgba(0,0,0,.9);height:28px;line-height:1;text-align:center;position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;overflow:hidden;-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1}.flatpickr-months .flatpickr-next-month,.flatpickr-months .flatpickr-prev-month{text-decoration:none;cursor:pointer;position:absolute;top:0;line-height:16px;height:28px;padding:10px;z-index:3;color:rgba(0,0,0,.9);fill:rgba(0,0,0,.9)}.flatpickr-months .flatpickr-next-month.disabled,.flatpickr-months .flatpickr-prev-month.disabled{display:none}.flatpickr-months .flatpickr-next-month i,.flatpickr-months .flatpickr-prev-month i{position:relative}.flatpickr-months .flatpickr-next-month.flatpickr-prev-month,.flatpickr-months .flatpickr-prev-month.flatpickr-prev-month{left:0}.flatpickr-months .flatpickr-next-month.flatpickr-next-month,.flatpickr-months .flatpickr-prev-month.flatpickr-next-month{right:0}.flatpickr-months .flatpickr-next-month:hover,.flatpickr-months .flatpickr-prev-month:hover{color:#959ea9}.flatpickr-months .flatpickr-next-month:hover svg,.flatpickr-months .flatpickr-prev-month:hover svg{fill:#f64747}.flatpickr-months .flatpickr-next-month svg,.flatpickr-months .flatpickr-prev-month svg{width:14px;height:14px}.flatpickr-months .flatpickr-next-month svg path,.flatpickr-months .flatpickr-prev-month svg path{-webkit-transition:fill .1s;transition:fill .1s;fill:inherit}.numInputWrapper{position:relative;height:auto}.numInputWrapper input,.numInputWrapper span{display:inline-block}.numInputWrapper input{width:100%}.numInputWrapper input::-ms-clear{display:none}.numInputWrapper span{position:absolute;right:0;width:14px;padding:0 4px 0 2px;height:50%;line-height:50%;opacity:0;cursor:pointer;border:1px solid rgba(57,57,57,.15);-webkit-box-sizing:border-box;box-sizing:border-box}.numInputWrapper span:hover{background:rgba(0,0,0,.1)}.numInputWrapper span:active{background:rgba(0,0,0,.2)}.numInputWrapper span:after{display:block;content:\"\";position:absolute}.numInputWrapper span.arrowUp{top:0;border-bottom:0}.numInputWrapper span.arrowUp:after{border-left:4px solid transparent;border-right:4px solid transparent;border-bottom:4px solid rgba(57,57,57,.6);top:26%}.numInputWrapper span.arrowDown{top:50%}.numInputWrapper span.arrowDown:after{border-left:4px solid transparent;border-right:4px solid transparent;border-top:4px solid rgba(57,57,57,.6);top:40%}.numInputWrapper span svg{width:inherit;height:auto}.numInputWrapper span svg path{fill:rgba(0,0,0,.5)}.numInputWrapper:hover{background:rgba(0,0,0,.05)}.numInputWrapper:hover span{opacity:1}.flatpickr-current-month{font-size:135%;line-height:inherit;font-weight:300;color:inherit;position:absolute;width:75%;left:12.5%;padding:6.16px 0 0 0;line-height:1;height:28px;display:inline-block;text-align:center;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}.flatpickr-current-month span.cur-month{font-family:inherit;font-weight:700;color:inherit;display:inline-block;margin-left:.5ch;padding:0}.flatpickr-current-month span.cur-month:hover{background:rgba(0,0,0,.05)}.flatpickr-current-month .numInputWrapper{width:6ch;width:7ch\0;display:inline-block}.flatpickr-current-month .numInputWrapper span.arrowUp:after{border-bottom-color:rgba(0,0,0,.9)}.flatpickr-current-month .numInputWrapper span.arrowDown:after{border-top-color:rgba(0,0,0,.9)}.flatpickr-current-month input.cur-year{background:0 0;-webkit-box-sizing:border-box;box-sizing:border-box;color:inherit;cursor:text;padding:0 0 0 .5ch;margin:0;display:inline-block;font-size:inherit;font-family:inherit;font-weight:300;line-height:inherit;height:auto;border:0;border-radius:0;vertical-align:initial}.flatpickr-current-month input.cur-year:focus{outline:0}.flatpickr-current-month input.cur-year[disabled],.flatpickr-current-month input.cur-year[disabled]:hover{font-size:100%;color:rgba(0,0,0,.5);background:0 0;pointer-events:none}.flatpickr-weekdays{background:0 0;text-align:center;overflow:hidden;width:100%;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;height:28px}.flatpickr-weekdays .flatpickr-weekdaycontainer{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1}span.flatpickr-weekday{cursor:default;font-size:90%;background:0 0;color:rgba(0,0,0,.54);line-height:1;margin:0;text-align:center;display:block;-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;font-weight:bolder}.dayContainer,.flatpickr-weeks{padding:1px 0 0 0}.flatpickr-days{position:relative;overflow:hidden;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:start;-webkit-align-items:flex-start;-ms-flex-align:start;align-items:flex-start;width:307.875px}.flatpickr-days:focus{outline:0}.dayContainer{padding:0;outline:0;text-align:left;width:307.875px;min-width:307.875px;max-width:307.875px;-webkit-box-sizing:border-box;box-sizing:border-box;display:inline-block;display:-ms-flexbox;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-flex-wrap:wrap;flex-wrap:wrap;-ms-flex-wrap:wrap;-ms-flex-pack:justify;-webkit-justify-content:space-around;justify-content:space-around;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0);opacity:1}.dayContainer+.dayContainer{-webkit-box-shadow:-1px 0 0 #e6e6e6;box-shadow:-1px 0 0 #e6e6e6}.flatpickr-day{background:0 0;border:1px solid transparent;border-radius:150px;-webkit-box-sizing:border-box;box-sizing:border-box;color:#393939;cursor:pointer;font-weight:400;width:14.2857143%;-webkit-flex-basis:14.2857143%;-ms-flex-preferred-size:14.2857143%;flex-basis:14.2857143%;max-width:39px;height:39px;line-height:39px;margin:0;display:inline-block;position:relative;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;text-align:center}.flatpickr-day.inRange,.flatpickr-day.nextMonthDay.inRange,.flatpickr-day.nextMonthDay.today.inRange,.flatpickr-day.nextMonthDay:focus,.flatpickr-day.nextMonthDay:hover,.flatpickr-day.prevMonthDay.inRange,.flatpickr-day.prevMonthDay.today.inRange,.flatpickr-day.prevMonthDay:focus,.flatpickr-day.prevMonthDay:hover,.flatpickr-day.today.inRange,.flatpickr-day:focus,.flatpickr-day:hover{cursor:pointer;outline:0;background:#e6e6e6;border-color:#e6e6e6}.flatpickr-day.today{border-color:#959ea9}.flatpickr-day.today:focus,.flatpickr-day.today:hover{border-color:#959ea9;background:#959ea9;color:#fff}.flatpickr-day.endRange,.flatpickr-day.endRange.inRange,.flatpickr-day.endRange.nextMonthDay,.flatpickr-day.endRange.prevMonthDay,.flatpickr-day.endRange:focus,.flatpickr-day.endRange:hover,.flatpickr-day.selected,.flatpickr-day.selected.inRange,.flatpickr-day.selected.nextMonthDay,.flatpickr-day.selected.prevMonthDay,.flatpickr-day.selected:focus,.flatpickr-day.selected:hover,.flatpickr-day.startRange,.flatpickr-day.startRange.inRange,.flatpickr-day.startRange.nextMonthDay,.flatpickr-day.startRange.prevMonthDay,.flatpickr-day.startRange:focus,.flatpickr-day.startRange:hover{background:#569ff7;-webkit-box-shadow:none;box-shadow:none;color:#fff;border-color:#569ff7}.flatpickr-day.endRange.startRange,.flatpickr-day.selected.startRange,.flatpickr-day.startRange.startRange{border-radius:50px 0 0 50px}.flatpickr-day.endRange.endRange,.flatpickr-day.selected.endRange,.flatpickr-day.startRange.endRange{border-radius:0 50px 50px 0}.flatpickr-day.endRange.startRange+.endRange:not(:nth-child(7n+1)),.flatpickr-day.selected.startRange+.endRange:not(:nth-child(7n+1)),.flatpickr-day.startRange.startRange+.endRange:not(:nth-child(7n+1)){-webkit-box-shadow:-10px 0 0 #569ff7;box-shadow:-10px 0 0 #569ff7}.flatpickr-day.endRange.startRange.endRange,.flatpickr-day.selected.startRange.endRange,.flatpickr-day.startRange.startRange.endRange{border-radius:50px}.flatpickr-day.inRange{border-radius:0;-webkit-box-shadow:-5px 0 0 #e6e6e6,5px 0 0 #e6e6e6;box-shadow:-5px 0 0 #e6e6e6,5px 0 0 #e6e6e6}.flatpickr-day.disabled,.flatpickr-day.disabled:hover,.flatpickr-day.nextMonthDay,.flatpickr-day.notAllowed,.flatpickr-day.notAllowed.nextMonthDay,.flatpickr-day.notAllowed.prevMonthDay,.flatpickr-day.prevMonthDay{color:rgba(57,57,57,.3);background:0 0;border-color:transparent;cursor:default}.flatpickr-day.disabled,.flatpickr-day.disabled:hover{cursor:not-allowed;color:rgba(57,57,57,.1)}.flatpickr-day.week.selected{border-radius:0;-webkit-box-shadow:-5px 0 0 #569ff7,5px 0 0 #569ff7;box-shadow:-5px 0 0 #569ff7,5px 0 0 #569ff7}.flatpickr-day.hidden{visibility:hidden}.rangeMode .flatpickr-day{margin-top:1px}.flatpickr-weekwrapper{display:inline-block;float:left}.flatpickr-weekwrapper .flatpickr-weeks{padding:0 12px;-webkit-box-shadow:1px 0 0 #e6e6e6;box-shadow:1px 0 0 #e6e6e6}.flatpickr-weekwrapper .flatpickr-weekday{float:none;width:100%;line-height:28px}.flatpickr-weekwrapper span.flatpickr-day,.flatpickr-weekwrapper span.flatpickr-day:hover{display:block;width:100%;max-width:none;color:rgba(57,57,57,.3);background:0 0;cursor:default;border:none}.flatpickr-innerContainer{display:block;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-sizing:border-box;box-sizing:border-box;overflow:hidden}.flatpickr-rContainer{display:inline-block;padding:0;-webkit-box-sizing:border-box;box-sizing:border-box}.flatpickr-time{text-align:center;outline:0;display:block;height:0;line-height:40px;max-height:40px;-webkit-box-sizing:border-box;box-sizing:border-box;overflow:hidden;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex}.flatpickr-time:after{content:\"\";display:table;clear:both}.flatpickr-time .numInputWrapper{-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;width:40%;height:40px;float:left}.flatpickr-time .numInputWrapper span.arrowUp:after{border-bottom-color:#393939}.flatpickr-time .numInputWrapper span.arrowDown:after{border-top-color:#393939}.flatpickr-time.hasSeconds .numInputWrapper{width:26%}.flatpickr-time.time24hr .numInputWrapper{width:49%}.flatpickr-time input{background:0 0;-webkit-box-shadow:none;box-shadow:none;border:0;border-radius:0;text-align:center;margin:0;padding:0;height:inherit;line-height:inherit;color:#393939;font-size:14px;position:relative;-webkit-box-sizing:border-box;box-sizing:border-box}.flatpickr-time input.flatpickr-hour{font-weight:700}.flatpickr-time input.flatpickr-minute,.flatpickr-time input.flatpickr-second{font-weight:400}.flatpickr-time input:focus{outline:0;border:0}.flatpickr-time .flatpickr-am-pm,.flatpickr-time .flatpickr-time-separator{height:inherit;display:inline-block;float:left;line-height:inherit;color:#393939;font-weight:700;width:2%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-align-self:center;-ms-flex-item-align:center;align-self:center}.flatpickr-time .flatpickr-am-pm{outline:0;width:18%;cursor:pointer;text-align:center;font-weight:400}.flatpickr-time .flatpickr-am-pm:focus,.flatpickr-time .flatpickr-am-pm:hover,.flatpickr-time input:focus,.flatpickr-time input:hover{background:#f3f3f3}.flatpickr-input[readonly]{cursor:pointer}@-webkit-keyframes fpFadeInDown{from{opacity:0;-webkit-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}to{opacity:1;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@keyframes fpFadeInDown{from{opacity:0;-webkit-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}to{opacity:1;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}.choices{position:relative;margin-bottom:24px;font-size:16px}.choices:focus{outline:0}.choices:last-child{margin-bottom:0}.choices.is-disabled .choices__inner,.choices.is-disabled .choices__input{background-color:#eaeaea;cursor:not-allowed;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.choices.is-disabled .choices__item{cursor:not-allowed}.choices[data-type*=select-one]{cursor:pointer}.choices[data-type*=select-one] .choices__inner{padding-bottom:7.5px}.choices[data-type*=select-one] .choices__input{display:block;width:100%;padding:10px;border-bottom:1px solid #ddd;background-color:#fff;margin:0}.choices[data-type*=select-one] .choices__button{background-image:url(../../../node_modules/formiojs/dist/icons/cross-inverse.svg);padding:0;background-size:8px;position:absolute;top:50%;right:0;margin-top:-10px;margin-right:25px;height:20px;width:20px;border-radius:10em;opacity:.5}.choices[data-type*=select-one] .choices__button:focus,.choices[data-type*=select-one] .choices__button:hover{opacity:1}.choices[data-type*=select-one] .choices__button:focus{box-shadow:0 0 0 2px #00bcd4}.choices[data-type*=select-one]:after{content:\"\";height:0;width:0;border-style:solid;border-color:#333 transparent transparent transparent;border-width:5px;position:absolute;right:11.5px;top:50%;margin-top:-2.5px;pointer-events:none}.choices[data-type*=select-one].is-open:after{border-color:transparent transparent #333 transparent;margin-top:-7.5px}.choices[data-type*=select-one][dir=rtl]:after{left:11.5px;right:auto}.choices[data-type*=select-one][dir=rtl] .choices__button{right:auto;left:0;margin-left:25px;margin-right:0}.choices[data-type*=select-multiple] .choices__inner,.choices[data-type*=text] .choices__inner{cursor:text}.choices[data-type*=select-multiple] .choices__button,.choices[data-type*=text] .choices__button{position:relative;display:inline-block;margin:0 -4px 0 8px;padding-left:16px;border-left:1px solid #008fa1;background-image:url(../../../node_modules/formiojs/dist/icons/cross.svg);background-size:8px;width:8px;line-height:1;opacity:.75}.choices[data-type*=select-multiple] .choices__button:focus,.choices[data-type*=select-multiple] .choices__button:hover,.choices[data-type*=text] .choices__button:focus,.choices[data-type*=text] .choices__button:hover{opacity:1}.choices__inner{display:inline-block;vertical-align:top;width:100%;background-color:#f9f9f9;padding:7.5px 7.5px 3.75px;border:1px solid #ddd;border-radius:2.5px;font-size:14px;min-height:44px;overflow:hidden}.is-focused .choices__inner,.is-open .choices__inner{border-color:#b7b7b7}.is-open .choices__inner{border-radius:2.5px 2.5px 0 0}.is-flipped.is-open .choices__inner{border-radius:0 0 2.5px 2.5px}.choices__list{margin:0;padding-left:0;list-style:none}.choices__list--single{display:inline-block;padding:4px 16px 4px 4px;width:100%}[dir=rtl] .choices__list--single{padding-right:4px;padding-left:16px}.choices__list--single .choices__item{width:100%}.choices__list--multiple{display:inline}.choices__list--multiple .choices__item{display:inline-block;vertical-align:middle;border-radius:20px;padding:4px 10px;font-size:12px;font-weight:500;margin-right:3.75px;margin-bottom:3.75px;background-color:#00bcd4;border:1px solid #00a5bb;color:#fff;word-break:break-all}.choices__list--multiple .choices__item[data-deletable]{padding-right:5px}[dir=rtl] .choices__list--multiple .choices__item{margin-right:0;margin-left:3.75px}.choices__list--multiple .choices__item.is-highlighted{background-color:#00a5bb;border:1px solid #008fa1}.is-disabled .choices__list--multiple .choices__item{background-color:#aaa;border:1px solid #919191}.choices__list--dropdown{display:none;z-index:1;position:absolute;width:100%;background-color:#fff;border:1px solid #ddd;top:100%;margin-top:-1px;border-bottom-left-radius:2.5px;border-bottom-right-radius:2.5px;overflow:hidden;word-break:break-all}.choices__list--dropdown.is-active{display:block}.is-open .choices__list--dropdown{border-color:#b7b7b7}.is-flipped .choices__list--dropdown{top:auto;bottom:100%;margin-top:0;margin-bottom:-1px;border-radius:.25rem .25rem 0 0}.choices__list--dropdown .choices__list{position:relative;max-height:300px;overflow:auto;-webkit-overflow-scrolling:touch;will-change:scroll-position}.choices__list--dropdown .choices__item{position:relative;padding:10px;font-size:14px}[dir=rtl] .choices__list--dropdown .choices__item{text-align:right}@media (min-width:640px){.choices__list--dropdown .choices__item--selectable{padding-right:100px}.choices__list--dropdown .choices__item--selectable:after{content:attr(data-select-text);font-size:12px;opacity:0;position:absolute;right:10px;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%)}[dir=rtl] .choices__list--dropdown .choices__item--selectable{text-align:right;padding-left:100px;padding-right:10px}[dir=rtl] .choices__list--dropdown .choices__item--selectable:after{right:auto;left:10px}}.choices__list--dropdown .choices__item--selectable.is-highlighted{background-color:#f2f2f2}.choices__list--dropdown .choices__item--selectable.is-highlighted:after{opacity:.5}.choices__item{cursor:default}.choices__item--selectable{cursor:pointer}.choices__item--disabled{cursor:not-allowed;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;opacity:.5}.choices__heading{font-weight:600;font-size:12px;padding:10px;border-bottom:1px solid #f7f7f7;color:gray}.choices__button{text-indent:-9999px;-webkit-appearance:none;-moz-appearance:none;appearance:none;border:0;background-color:transparent;background-repeat:no-repeat;background-position:center;cursor:pointer}.choices__button:focus{outline:0}.choices__input{display:inline-block;vertical-align:baseline;background-color:#f9f9f9;font-size:14px;margin-bottom:5px;border:0;border-radius:0;max-width:100%;padding:4px 0 4px 2px}.choices__input:focus{outline:0}[dir=rtl] .choices__input{padding-right:2px;padding-left:0}.choices__placeholder{opacity:.5}dialog{position:absolute;left:0;right:0;width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content;margin:auto;border:solid;padding:1em;background:#fff;color:#000;display:block}dialog:not([open]){display:none}dialog+.backdrop{position:fixed;top:0;right:0;bottom:0;left:0;background:rgba(0,0,0,.1)}._dialog_overlay{position:fixed;top:0;right:0;bottom:0;left:0}dialog.fixed{position:fixed;top:50%;transform:translate(0,-50%)}.gu-mirror{position:fixed!important;margin:0!important;z-index:9999!important;opacity:.8;-ms-filter:\"progid:DXImageTransform.Microsoft.Alpha(Opacity=80)\";filter:alpha(opacity=80)}.gu-hide{display:none!important}.gu-unselectable{-webkit-user-select:none!important;-moz-user-select:none!important;-ms-user-select:none!important;user-select:none!important}.gu-transit{opacity:.2;-ms-filter:\"progid:DXImageTransform.Microsoft.Alpha(Opacity=20)\";filter:alpha(opacity=20)}.formio-form{position:relative;min-height:80px}.formio-disabled-input .form-control.flatpickr-input{background-color:#eee}.formio-component.has-error .invalid-feedback{display:block}.formio-wysiwyg-editor{min-height:200px;background-color:#fff}.has-feedback .form-control{padding-right:10px}.has-feedback .form-control[type=hidden]{padding-right:0}.has-error.bg-danger{padding:4px}.ql-source:after{content:\"[source]\"}.quill-source-code{width:100%;margin:0;background:#1d1d1d;box-sizing:border-box;color:#ccc;font-size:15px;outline:0;padding:20px;line-height:24px;font-family:Consolas,Menlo,Monaco,\"Courier New\",monospace;position:absolute;top:0;bottom:0;border:none;display:none}.formio-component-tags tags{background-color:#fff}.field-required:after{content:\" *\";color:red}.glyphicon-spin{-webkit-animation:formio-spin 1s infinite linear;-moz-animation:formio-spin 1s infinite linear;-o-animation:formio-spin 1s infinite linear;animation:formio-spin 1s infinite linear}@-moz-keyframes formio-spin{from{-moz-transform:rotate(0)}to{-moz-transform:rotate(360deg)}}@-webkit-keyframes formio-spin{from{-webkit-transform:rotate(0)}to{-webkit-transform:rotate(360deg)}}@keyframes formio-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}.button-icon-right{margin-left:5px}.formio-component-submit .submit-success::after{font-family:'Glyphicons Halflings';content:'\e013';position:relative;right:-4px;top:1;line-height:1}.formio-component-submit .submit-fail::after{font-family:'Glyphicons Halflings';content:'\e014';position:relative;right:-4px;top:1;line-height:1}.formio-component-submit .submit-fail[disabled]{opacity:1}.form-control.flatpickr-input{background-color:#fff}td>.form-group{margin-bottom:0}.signature-pad{position:relative}.signature-pad-body{overflow:hidden}.signature-pad-canvas{border-radius:4px;box-shadow:0 0 5px rgba(0,0,0,.02) inset;border:1px solid #f4f4f4}.btn.signature-pad-refresh{position:absolute;left:0;top:0;z-index:1000;padding:3px;line-height:0}.choices__list--dropdown .choices__item--selectable{padding-right:0}.signature-pad-refresh img{height:1.2em}.signature-pad-footer{text-align:center;color:#c3c3c3}.loader-wrapper{z-index:1000;position:absolute;top:0;left:0;bottom:0;right:0;background-color:rgba(0,0,0,.1)}.loader{position:absolute;left:50%;top:50%;margin-left:-30px;margin-top:-30px;z-index:10000;display:inline-block;border:6px solid #f3f3f3;border-top:6px solid #3498db;border-radius:50%;width:60px;height:60px;animation:spin 2s linear infinite}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}.choices__list--dropdown{z-index:100}.choices__list--multiple .choices__item{border-radius:0;padding:2px 8px;line-height:1em;margin-bottom:6px}.choices__list--single{padding:0}.choices__input{padding:2px}.formio-component-file .fileSelector{padding:15px;border:2px dashed #ddd;text-align:center}.formio-component-file .fileSelector.fileDragOver{border-color:#127abe}.formio-component-file .fileSelector .fa,.formio-component-file .fileSelector .glyphicon{font-size:20px;margin-right:5px}.formio-component-file .fileSelector .browse{cursor:pointer}@-webkit-keyframes formio-dialog-fadeout{0%{opacity:1}100%{opacity:0}}@keyframes formio-dialog-fadeout{0%{opacity:1}100%{opacity:0}}@-webkit-keyframes formio-dialog-fadein{0%{opacity:0}100%{opacity:1}}@keyframes formio-dialog-fadein{0%{opacity:0}100%{opacity:1}}.formio-dialog{box-sizing:border-box;font-size:.8em;color:#666}.formio-dialog *,.formio-dialog :after,.formio-dialog :before{box-sizing:inherit}.formio-dialog{position:fixed;overflow:auto;-webkit-overflow-scrolling:touch;z-index:10000;top:0;right:0;bottom:0;left:0;background:rgba(0,0,0,.4);animation:formio-dialog-fadein .5s}.formio-dialog.formio-dialog-disabled-animation,.formio-dialog.formio-dialog-disabled-animation .formio-dialog-content,.formio-dialog.formio-dialog-disabled-animation .formio-dialog-overlay{-webkit-animation:none!important;animation:none!important}.formio-dialog-overlay{position:fixed;top:0;right:0;bottom:0;left:0;-webkit-backface-visibility:hidden;-webkit-animation:formio-dialog-fadein .5s;animation:formio-dialog-fadein .5s;margin-right:15px;background:0 0}.formio-dialog-no-overlay{pointer-events:none}.formio-dialog.formio-dialog-closing .formio-dialog-overlay{-webkit-backface-visibility:hidden;-webkit-animation:formio-dialog-fadeout .5s;animation:formio-dialog-fadeout .5s}.formio-dialog-content{background:#fff;-webkit-backface-visibility:hidden;-webkit-animation:formio-dialog-fadein .5s;animation:formio-dialog-fadein .5s;pointer-events:all}.formio-dialog.formio-dialog-closing .formio-dialog-content{-webkit-backface-visibility:hidden;-webkit-animation:formio-dialog-fadeout .5s;animation:formio-dialog-fadeout .5s}.formio-dialog-close:before{font-family:Helvetica,Arial,sans-serif;content:'×';cursor:pointer}body.formio-dialog-open,html.formio-dialog-open{overflow:hidden}@-webkit-keyframes formio-dialog-flyin{0%{opacity:0;-webkit-transform:translateY(-40px);transform:translateY(-40px)}100%{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}}@keyframes formio-dialog-flyin{0%{opacity:0;-webkit-transform:translateY(-40px);transform:translateY(-40px)}100%{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}}@-webkit-keyframes formio-dialog-flyout{0%{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}100%{opacity:0;-webkit-transform:translateY(-40px);transform:translateY(-40px)}}@keyframes formio-dialog-flyout{0%{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}100%{opacity:0;-webkit-transform:translateY(-40px);transform:translateY(-40px)}}.formio-dialog.formio-dialog-theme-default{padding-bottom:160px;padding-top:160px}.formio-dialog.formio-dialog-theme-default.formio-dialog-closing .formio-dialog-content{-webkit-animation:formio-dialog-flyout .5s;animation:formio-dialog-flyout .5s}.formio-dialog.formio-dialog-theme-default .formio-dialog-content{-webkit-animation:formio-dialog-flyin .5s;animation:formio-dialog-flyin .5s;background:#f0f0f0;border-radius:5px;font-family:Helvetica,sans-serif;font-size:1.1em;line-height:1.5em;margin:0 auto;max-width:100%;padding:1em;position:relative;width:65%}.formio-dialog.formio-dialog-theme-default .formio-dialog-close{border:none;background:0 0;cursor:pointer;position:absolute;right:0;top:0}.formio-clickable{cursor:pointer}.component-settings .nav>li>a{padding:8px 10px}.formio-dialog.formio-dialog-theme-default .formio-dialog-close:before{display:block;padding:3px;background:0 0;color:#bbb;content:'×';font-size:26px;font-weight:400;line-height:26px;text-align:center}.formio-dialog.formio-dialog-theme-default .formio-dialog-close:active:before,.formio-dialog.formio-dialog-theme-default .formio-dialog-close:hover:before{color:#777}.formio-dialog.formio-dialog-theme-default .formio-dialog-message{margin-bottom:.5em}.formio-dialog.formio-dialog-theme-default .formio-dialog-input{margin-bottom:1em}.formio-dialog.formio-dialog-theme-default .formio-dialog-input input[type=email],.formio-dialog.formio-dialog-theme-default .formio-dialog-input input[type=password],.formio-dialog.formio-dialog-theme-default .formio-dialog-input input[type=text],.formio-dialog.formio-dialog-theme-default .formio-dialog-input input[type=url],.formio-dialog.formio-dialog-theme-default .formio-dialog-input textarea{background:#fff;border:0;border-radius:3px;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0 0 .25em;min-height:2.5em;padding:.25em .67em;width:100%}.formio-dialog.formio-dialog-theme-default .formio-dialog-input input[type=email]:focus,.formio-dialog.formio-dialog-theme-default .formio-dialog-input input[type=password]:focus,.formio-dialog.formio-dialog-theme-default .formio-dialog-input input[type=text]:focus,.formio-dialog.formio-dialog-theme-default .formio-dialog-input input[type=url]:focus,.formio-dialog.formio-dialog-theme-default .formio-dialog-input textarea:focus{box-shadow:inset 0 0 0 2px #8dbdf1;outline:0}.formio-dialog.formio-dialog-theme-default .formio-dialog-buttons{*zoom:1}.formio-dialog.formio-dialog-theme-default .formio-dialog-buttons:after{content:'';display:table;clear:both}.formio-dialog.formio-dialog-theme-default .formio-dialog-button{border:0;border-radius:3px;cursor:pointer;float:right;font-family:inherit;font-size:.8em;letter-spacing:.1em;line-height:1em;margin:0 0 0 .5em;padding:.75em 2em;text-transform:uppercase}.formio-dialog.formio-dialog-theme-default .formio-dialog-button:focus{-webkit-animation:formio-dialog-pulse 1.1s infinite;animation:formio-dialog-pulse 1.1s infinite;outline:0}@media (max-width:568px){.formio-dialog.formio-dialog-theme-default .formio-dialog-button:focus{-webkit-animation:none;animation:none}}.formio-dialog.formio-dialog-theme-default .formio-dialog-button.formio-dialog-button-primary{background:#3288e6;color:#fff}.formio-dialog.formio-dialog-theme-default .formio-dialog-button.formio-dialog-button-secondary{background:#e0e0e0;color:#777}.formio-dialog-content .panel{margin:0}.formio-placeholder{position:absolute;color:#999}.formio-dialog .formio-dialog-close{cursor:pointer}.formio-iframe{border:none;width:100%;height:1000px}.inline-form-button{margin-right:10px}.tooltip{opacity:1}.tooltip[x-placement=right] .tooltip-arrow{border-right:5px solid #000}.tooltip[x-placement=right] .tooltip-inner{margin-left:8px}.control-label--bottom{margin-bottom:0;margin-top:5px}.formio-component-label-hidden{position:relative}.control-label--hidden{position:absolute;top:6px;right:5px;font-size:1.5em}.formio-component-datetime .control-label--hidden.field-required{right:45px;z-index:3}.formio-component-selectboxes .control-label--hidden.field-required,.formio-component-survey .control-label--hidden.field-required{top:0}.formio-component-resource .control-label--hidden.field-required,.formio-component-select .control-label--hidden.field-required{right:40px;z-index:2}.checkbox-inline label,.radio-inline label{font-weight:400;cursor:pointer}.editgrid-listgroup{margin-bottom:10px}.formio-component-submit .has-error{display:none}.formio-component-submit button[disabled]+.has-error{display:block}.formio-choices.form-group{margin-bottom:0}.formio-choices[data-type=select-multiple] .form-control{height:auto}.form-control.formio-multiple-mask-select{width:15%;z-index:4}.form-control.formio-multiple-mask-input{width:85%}.input-group.formio-multiple-mask-container{width:100%}.formio-component .table{margin-bottom:0}.formio-hide-label-panel-tooltip{margin-top:-10px;margin-left:-10px}.is-disabled .choices__list--multiple .choices__item{padding:5px 10px}.is-disabled .choices__list--multiple .choices__item .choices__button{display:none}.formio-collapse-icon{cursor:pointer;color:#666;font-size:.6em;border:1px solid #ccc;border-radius:.3em;padding:.2em .4em;vertical-align:top;margin-right:4px;margin-top:1px}.formbuilder{position:relative}.drag-container{padding:10px;border:dotted 2px #e8e8e8}.drag-container:hover{cursor:move;border:dotted 2px #ccc}.component-btn-group{position:absolute;right:0;z-index:1000;margin-top:-2px}.formio-component:not(:hover) .component-btn-group{display:none}.builder-group-button{background-color:transparent;white-space:normal;text-align:left}.form-builder-group-header{padding:0}.formio-dialog .tab-content{padding-top:12px}.component-btn-group .component-settings-button{float:right;z-index:1001;margin:4px 4px 0 0;z-index:1001;-webkit-box-shadow:0 0 10px 1px rgba(48,113,169,.6);-moz-box-shadow:0 0 10px 1px rgba(48,113,169,.6);box-shadow:0 0 10px 1px rgba(48,113,169,.6)}.formbuilder .formio-component-form,.formbuilder .formio-component-hidden{border:2px dashed #ddd}.formbuilder .formio-component-hidden{height:3em;text-align:center;color:#aaa;padding-top:.5em}.formbuilder .row.formio-component-columns{margin-left:0;margin-right:0}.btn-group-xxs>.btn,.btn-xxs,.component-btn-group .component-settings-button{padding:2px 2px;font-size:10px;line-height:1.2em;border-radius:0;width:18px;height:18px}.formcomponents .formcomponent{text-align:left;padding:5px 5px 5px 8px;margin-top:.2rem;font-size:.8em;line-height:1.2;border-radius:.3em}.form-builder-panel .panel-body{padding:5px}.formio-pdf-builder{position:relative}.formio-drop-zone{display:none;position:absolute;z-index:10;background-color:#0d87e9;opacity:.1}.formio-drop-zone.enabled{display:inherit}.component-settings-button-paste{display:none}.builder-paste-mode .component-settings-button-paste{display:inherit}.wizard-page-label{cursor:pointer}.panel-body .drag-and-drop-alert{margin-bottom:0}"],
                    encapsulation: core.ViewEncapsulation.None
                },] },
    ];
    /** @nocollapse */
    FormBuilderComponent.ctorParameters = function () { return [
        { type: FormioAppConfig, decorators: [{ type: core.Optional }] }
    ]; };
    FormBuilderComponent.propDecorators = {
        form: [{ type: core.Input }],
        options: [{ type: core.Input }],
        change: [{ type: core.Output }],
        builderElement: [{ type: core.ViewChild, args: ['builder',] }]
    };
    return FormBuilderComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var FormioAlertsComponent = /** @class */ (function () {
    function FormioAlertsComponent() {
        this.alerts = new FormioAlerts();
    }
    FormioAlertsComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'formio-alerts',
                    template: "<div *ngFor=\"let alert of alerts.alerts\" class=\"alert alert-{{ alert.type }}\" role=\"alert\">{{ alert.message }}</div> "
                },] },
    ];
    /** @nocollapse */
    FormioAlertsComponent.ctorParameters = function () { return []; };
    FormioAlertsComponent.propDecorators = {
        alerts: [{ type: core.Input }]
    };
    return FormioAlertsComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var FormioLoaderComponent = /** @class */ (function () {
    function FormioLoaderComponent(loader) {
        this.loader = loader;
    }
    FormioLoaderComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'formio-loader',
                    styles: [".formio-loader-wrapper { position: absolute; top: 0px; bottom: 0px; left: 0px; right: 0px; } .formio-loader { position: absolute; left: 50%; top: 50%; margin-left: -30px; margin-top: -30px; z-index: 10000; display: inline-block; border: 6px solid #f3f3f3; border-top: 6px solid #3498db; border-radius: 50%; width: 60px; height: 60px; animation: spin 2s linear infinite; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } "],
                    template: "<div *ngIf=\"loader.loading\" style=\"position:relative;height:200px\"> <div class=\"formio-loader-wrapper\"> <div class=\"formio-loader\"></div> </div> </div> "
                },] },
    ];
    /** @nocollapse */
    FormioLoaderComponent.ctorParameters = function () { return [
        { type: FormioLoader }
    ]; };
    return FormioLoaderComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var FormioModule = /** @class */ (function () {
    function FormioModule() {
    }
    FormioModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [
                        FormioComponent,
                        FormBuilderComponent,
                        FormioLoaderComponent,
                        FormioAlertsComponent
                    ],
                    imports: [
                        common.CommonModule
                    ],
                    exports: [
                        FormioComponent,
                        FormBuilderComponent,
                        FormioLoaderComponent,
                        FormioAlertsComponent
                    ],
                    providers: [
                        FormioLoader,
                        FormioAlerts
                    ],
                    entryComponents: [
                        FormioComponent,
                        FormBuilderComponent
                    ]
                },] },
    ];
    return FormioModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var GridHeaderComponent = /** @class */ (function () {
    function GridHeaderComponent() {
        this.headers = [];
        this.sort = new core.EventEmitter();
    }
    Object.defineProperty(GridHeaderComponent.prototype, "numHeaders", {
        get: /**
         * @return {?}
         */
        function () {
            return this.headers.length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} formio
     * @param {?=} query
     * @return {?}
     */
    GridHeaderComponent.prototype.load = /**
     * @param {?} formio
     * @param {?=} query
     * @return {?}
     */
    function (formio, query) {
        return Promise.resolve([]);
    };
    GridHeaderComponent.propDecorators = {
        sort: [{ type: core.Output }],
        template: [{ type: core.ViewChild, args: [core.TemplateRef,] }]
    };
    return GridHeaderComponent;
}());

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var FormGridHeaderComponent = /** @class */ (function (_super) {
    __extends(FormGridHeaderComponent, _super);
    function FormGridHeaderComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?=} formio
     * @return {?}
     */
    FormGridHeaderComponent.prototype.load = /**
     * @param {?=} formio
     * @return {?}
     */
    function (formio) {
        this.header = {
            label: 'Title',
            key: 'title',
            sort: 'asc'
        };
        this.headers = [this.header];
        return Promise.resolve(this.headers);
    };
    Object.defineProperty(FormGridHeaderComponent.prototype, "numHeaders", {
        get: /**
         * @return {?}
         */
        function () {
            return 2;
        },
        enumerable: true,
        configurable: true
    });
    FormGridHeaderComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'form-grid-header',
                    template: "<ng-template> <thead> <tr> <th> <div class=\"row\"> <div class=\"col-sm-8\"> <a (click)=\"sort.emit(header)\"> {{ header.label }}&nbsp;<span [ngClass]=\"{'glyphicon-triangle-top fa-caret-up': (header.sort === 'asc'), 'glyphicon-triangle-bottom fa-caret-down': (header.sort === 'desc')}\" class=\"glyphicon fa\" *ngIf=\"header.sort\"></span> </a> </div> <div class=\"col-sm-4\"> Operations </div> </div> </th> </tr> </thead> </ng-template> "
                },] },
    ];
    return FormGridHeaderComponent;
}(GridHeaderComponent));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var GridBodyComponent = /** @class */ (function () {
    function GridBodyComponent() {
        this.firstItem = 0;
        this.lastItem = 0;
        this.skip = 0;
        this.total = 0;
        this.rowSelect = new core.EventEmitter();
        this.rowAction = new core.EventEmitter();
        this.loading = true;
    }
    /**
     * @param {?} formio
     * @param {?=} query
     * @return {?}
     */
    GridBodyComponent.prototype.load = /**
     * @param {?} formio
     * @param {?=} query
     * @return {?}
     */
    function (formio, query) {
        return Promise.resolve({});
    };
    /**
     * @param {?} event
     * @param {?} row
     * @return {?}
     */
    GridBodyComponent.prototype.onRowSelect = /**
     * @param {?} event
     * @param {?} row
     * @return {?}
     */
    function (event, row) {
        event.preventDefault();
        this.rowSelect.emit(row);
    };
    /**
     * @param {?} event
     * @param {?} row
     * @param {?} action
     * @return {?}
     */
    GridBodyComponent.prototype.onRowAction = /**
     * @param {?} event
     * @param {?} row
     * @param {?} action
     * @return {?}
     */
    function (event, row, action) {
        event.preventDefault();
        this.rowAction.emit({ row: row, action: action });
    };
    /**
     * Set the rows for this Grid body.
     *
     * @param query
     * @param items
     * @return any
     */
    /**
     * Set the rows for this Grid body.
     *
     * @param {?} query
     * @param {?} items
     * @return {?} any
     */
    GridBodyComponent.prototype.setRows = /**
     * Set the rows for this Grid body.
     *
     * @param {?} query
     * @param {?} items
     * @return {?} any
     */
    function (query, items) {
        var _this = this;
        this.rows = [];
        this.firstItem = query.skip + 1;
        this.lastItem = this.firstItem + items.length - 1;
        this.total = items.serverCount;
        this.skip = Math.floor(items.skip / query.limit) + 1;
        this.loading = false;
        _.each(items, function (item) {
            _this.rows.push(item);
        });
        return this.rows;
    };
    GridBodyComponent.propDecorators = {
        header: [{ type: core.Input }],
        rowSelect: [{ type: core.Output }],
        rowAction: [{ type: core.Output }],
        template: [{ type: core.ViewChild, args: [core.TemplateRef,] }]
    };
    return GridBodyComponent;
}());

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var FormGridBodyComponent = /** @class */ (function (_super) {
    __extends$1(FormGridBodyComponent, _super);
    function FormGridBodyComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} formio
     * @param {?=} query
     * @return {?}
     */
    FormGridBodyComponent.prototype.load = /**
     * @param {?} formio
     * @param {?=} query
     * @return {?}
     */
    function (formio, query) {
        var _this = this;
        query = query || {};
        return formio.loadForms({ params: query }).then(function (forms$$1) { return _this.setRows(query, forms$$1); });
    };
    FormGridBodyComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'form-grid-body',
                    styles: [".form-btn { font-size: 0.75rem; } "],
                    template: "<ng-template> <tbody *ngIf=\"rows\"> <tr *ngFor=\"let form of rows\"> <td> <div class=\"row\"> <div class=\"col-sm-8\"> <a href=\"#\" (click)=\"onRowSelect($event, form)\"><h5>{{ form.title }}</h5></a> </div> <div class=\"col-sm-4\"> <button class=\"btn btn-secondary btn-sm form-btn\" (click)=\"onRowAction($event, form, 'view')\"><span class=\"fa fa-pencil\"></span> Enter Data</button>&nbsp; <button class=\"btn btn-secondary btn-sm form-btn\" (click)=\"onRowAction($event, form, 'submission')\"><span class=\"fa fa-list-alt\"></span> View Data</button>&nbsp; <button class=\"btn btn-secondary btn-sm form-btn\" (click)=\"onRowAction($event, form, 'edit')\"><span class=\"fa fa-edit\"></span> Edit Form</button>&nbsp; <button class=\"btn btn-secondary btn-sm form-btn\" (click)=\"onRowAction($event, form, 'delete')\"><span class=\"fa fa-trash\"></span></button> </div> </div> </td> </tr> </tbody> </ng-template> "
                },] },
    ];
    return FormGridBodyComponent;
}(GridBodyComponent));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var GridFooterComponent = /** @class */ (function () {
    function GridFooterComponent() {
        this.pageChanged = new core.EventEmitter();
        this.createItem = new core.EventEmitter();
    }
    GridFooterComponent.propDecorators = {
        header: [{ type: core.Input }],
        body: [{ type: core.Input }],
        createText: [{ type: core.Input }],
        pageChanged: [{ type: core.Output }],
        createItem: [{ type: core.Output }],
        template: [{ type: core.ViewChild, args: [core.TemplateRef,] }]
    };
    return GridFooterComponent;
}());

var __extends$2 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var FormGridFooterComponent = /** @class */ (function (_super) {
    __extends$2(FormGridFooterComponent, _super);
    function FormGridFooterComponent() {
        return _super.call(this) || this;
    }
    /**
     * @return {?}
     */
    FormGridFooterComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        if (!this.createText) {
            this.createText = 'Create Form';
        }
    };
    FormGridFooterComponent.decorators = [
        { type: core.Component, args: [{
                    template: "<ng-template> <tfoot class=\"formio-grid-footer\"> <tr> <td *ngIf=\"header\" [colSpan]=\"header.numHeaders\"> <button class=\"btn btn-primary pull-left float-left\" (click)=\"createItem.emit('form')\"><i class=\"glyphicon glyphicon-plus fa fa-plus\"></i> {{ createText }}</button> <span class=\"pull-right float-right item-counter\"><span class=\"page-num\">{{ body.firstItem }} - {{ body.lastItem }}</span> / {{ body.total }} total</span> <pagination [totalItems]=\"body.total\" [(ngModel)]=\"body.skip\" (pageChanged)=\"pageChanged.emit($event)\" class=\"justify-content-center pagination-sm\"></pagination> </td> </tr> </tfoot> </ng-template> ",
                    styles: ["tfoot.formio-grid-footer td { padding: 0.3rem; } tfoot.formio-grid-footer .page-num { font-size: 1.4em; } tfoot.formio-grid-footer ul.pagination { margin-top: 5px; margin-bottom: 0; } "],
                    encapsulation: core.ViewEncapsulation.None
                },] },
    ];
    /** @nocollapse */
    FormGridFooterComponent.ctorParameters = function () { return []; };
    return FormGridFooterComponent;
}(GridFooterComponent));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var FormComponents = {
    header: FormGridHeaderComponent,
    body: FormGridBodyComponent,
    footer: FormGridFooterComponent
};

var __extends$3 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var SubmissionGridHeaderComponent = /** @class */ (function (_super) {
    __extends$3(SubmissionGridHeaderComponent, _super);
    function SubmissionGridHeaderComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} formio
     * @param {?=} query
     * @return {?}
     */
    SubmissionGridHeaderComponent.prototype.load = /**
     * @param {?} formio
     * @param {?=} query
     * @return {?}
     */
    function (formio, query) {
        var _this = this;
        query = query || {};
        return formio.loadForm({ params: query }).then(function (form) {
            _this.headers = [];
            formiojs.Utils.eachComponent(form.components, function (component) {
                if (component.input && component.tableView) {
                    _this.headers.push({
                        label: component.label,
                        key: 'data.' + component.key,
                        sort: '',
                        component: formiojs.Components.create(component, null, null, true)
                    });
                }
            });
            return _this.headers;
        });
    };
    SubmissionGridHeaderComponent.decorators = [
        { type: core.Component, args: [{
                    template: "<ng-template> <thead> <tr> <th *ngFor=\"let header of headers\"> <a (click)=\"sort.emit(header)\"> {{ header.label }}&nbsp;<span [ngClass]=\"{'glyphicon-triangle-top': (header.sort === 'asc'), 'glyphicon-triangle-bottom': (header.sort === 'desc')}\" class=\"glyphicon\" *ngIf=\"header.sort\"></span> </a> </th> </tr> </thead> </ng-template> "
                },] },
    ];
    return SubmissionGridHeaderComponent;
}(GridHeaderComponent));

var __extends$4 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var SubmissionGridBodyComponent = /** @class */ (function (_super) {
    __extends$4(SubmissionGridBodyComponent, _super);
    function SubmissionGridBodyComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} formio
     * @param {?=} query
     * @return {?}
     */
    SubmissionGridBodyComponent.prototype.load = /**
     * @param {?} formio
     * @param {?=} query
     * @return {?}
     */
    function (formio, query) {
        var _this = this;
        query = query || {};
        return formio.loadSubmissions({ params: query })
            .then(function (submissions) { return _this.setRows(query, submissions); });
    };
    /**
     * Render the cell data.
     *
     * @param row
     * @param header
     * @return any
     */
    /**
     * Render the cell data.
     *
     * @param {?} row
     * @param {?} header
     * @return {?} any
     */
    SubmissionGridBodyComponent.prototype.view = /**
     * Render the cell data.
     *
     * @param {?} row
     * @param {?} header
     * @return {?} any
     */
    function (row, header) {
        /** @type {?} */
        var cellValue = _.get(row, header.key);
        if (typeof header.component.getView === 'function') {
            return header.component.getView(cellValue);
        }
        return header.component.asString(cellValue);
    };
    SubmissionGridBodyComponent.decorators = [
        { type: core.Component, args: [{
                    template: "<ng-template> <tbody> <tr *ngFor=\"let row of rows\" (click)=\"onRowSelect($event, row)\"> <td *ngFor=\"let rowHeader of header.headers\" [innerHTML]=\"view(row, rowHeader)\"></td> </tr> </tbody> </ng-template> "
                },] },
    ];
    return SubmissionGridBodyComponent;
}(GridBodyComponent));

var __extends$5 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var SubmissionGridFooterComponent = /** @class */ (function (_super) {
    __extends$5(SubmissionGridFooterComponent, _super);
    function SubmissionGridFooterComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SubmissionGridFooterComponent.decorators = [
        { type: core.Component, args: [{
                    template: "<ng-template> <tfoot class=\"formio-grid-footer\"> <tr> <td *ngIf=\"header\" [colSpan]=\"header.numHeaders\"> <button class=\"btn btn-primary pull-left float-left\" (click)=\"createItem.emit('form')\"><i class=\"glyphicon glyphicon-plus fa fa-plus\"></i> {{ createText }}</button> <span class=\"pull-right float-right item-counter\"><span class=\"page-num\">{{ body.firstItem }} - {{ body.lastItem }}</span> / {{ body.total }} total</span> <pagination [totalItems]=\"body.total\" [(ngModel)]=\"body.skip\" (pageChanged)=\"pageChanged.emit($event)\" class=\"justify-content-center pagination-sm\"></pagination> </td> </tr> </tfoot> </ng-template> ",
                    styles: ["tfoot.formio-grid-footer td { padding: 0.3rem; } tfoot.formio-grid-footer .page-num { font-size: 1.4em; } tfoot.formio-grid-footer ul.pagination { margin-top: 5px; margin-bottom: 0; } "],
                    encapsulation: core.ViewEncapsulation.None
                },] },
    ];
    return SubmissionGridFooterComponent;
}(GridFooterComponent));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var SubmissionComponents = {
    header: SubmissionGridHeaderComponent,
    body: SubmissionGridBodyComponent,
    footer: SubmissionGridFooterComponent
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var FormioGridComponent = /** @class */ (function () {
    function FormioGridComponent(loader, alerts, resolver, ref) {
        this.loader = loader;
        this.alerts = alerts;
        this.resolver = resolver;
        this.ref = ref;
        this.page = 0;
        this.isLoading = false;
        this.initialized = false;
        this.select = this.rowSelect = new core.EventEmitter();
        this.rowAction = new core.EventEmitter();
        this.createItem = new core.EventEmitter();
        this.error = new core.EventEmitter();
        this.loader.loading = true;
    }
    /**
     * @param {?} property
     * @param {?} component
     * @return {?}
     */
    FormioGridComponent.prototype.createComponent = /**
     * @param {?} property
     * @param {?} component
     * @return {?}
     */
    function (property, component) {
        /** @type {?} */
        var factory = this.resolver.resolveComponentFactory(component);
        /** @type {?} */
        var componentRef = property.createComponent(factory);
        return componentRef.instance;
    };
    /**
     * @param {?=} src
     * @return {?}
     */
    FormioGridComponent.prototype.loadGrid = /**
     * @param {?=} src
     * @return {?}
     */
    function (src) {
        var _this = this;
        // If no source is provided, then skip.
        if (!src && !this.formio) {
            return;
        }
        // Do not double load.
        if (this.formio && this.src && (src === this.src)) {
            return;
        }
        if (src) {
            this.src = src;
            this.formio = new formiojs.Formio(this.src, { formOnly: true });
        }
        // Load the header.
        this.header.load(this.formio)
            .then(function () { return _this.setPage(0); })
            .catch(function (error) { return _this.onError(error); });
    };
    /**
     * @return {?}
     */
    FormioGridComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var comps = this.components || ((this.gridType === 'form') ? FormComponents : SubmissionComponents);
        this.header = this.createComponent(this.headerElement, comps.header);
        this.header.sort.subscribe(function (header) { return _this.sortColumn(header); });
        this.body = this.createComponent(this.bodyElement, comps.body);
        this.body.header = this.header;
        this.body.rowSelect.subscribe(function (row) { return _this.rowSelect.emit(row); });
        this.body.rowAction.subscribe(function (action) { return _this.rowAction.emit(action); });
        this.footer = this.createComponent(this.footerElement, comps.footer);
        this.footer.header = this.header;
        this.footer.body = this.body;
        this.footer.createText = this.createText;
        this.footer.pageChanged.subscribe(function (page) { return _this.pageChanged(page); });
        this.footer.createItem.subscribe(function (item) { return _this.createItem.emit(item); });
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    FormioGridComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (this.initialized &&
            ((changes.src && changes.src.currentValue) ||
                (changes.formio && changes.formio.currentValue))) {
            this.loadGrid(changes.src.currentValue);
        }
    };
    /**
     * @return {?}
     */
    FormioGridComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.alerts.setAlerts([]);
        this.query = this.query || {};
        if (this.refresh) {
            this.refresh.subscribe(function (query) { return _this.refreshGrid(query); });
        }
        this.loadGrid(this.src);
        this.initialized = true;
        this.ref.detectChanges();
    };
    Object.defineProperty(FormioGridComponent.prototype, "loading", {
        set: /**
         * @param {?} _loading
         * @return {?}
         */
        function (_loading) {
            this.loader.loading = this.isLoading = _loading;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} error
     * @return {?}
     */
    FormioGridComponent.prototype.onError = /**
     * @param {?} error
     * @return {?}
     */
    function (error) {
        this.loading = false;
        this.error.emit(error);
        this.alerts.setAlert({
            type: 'danger',
            message: error
        });
    };
    /**
     * @param {?=} query
     * @return {?}
     */
    FormioGridComponent.prototype.refreshGrid = /**
     * @param {?=} query
     * @return {?}
     */
    function (query) {
        var _this = this;
        this.alerts.setAlerts([]);
        query = query || {};
        query = _.assign(query, this.query);
        if (!query.hasOwnProperty('limit')) {
            query.limit = 10;
        }
        if (!query.hasOwnProperty('skip')) {
            query.skip = 0;
        }
        this.loading = true;
        this.ref.detectChanges();
        this.body.load(this.formio, this.query).then(function (info) {
            _this.loading = false;
            _this.initialized = true;
            _this.ref.detectChanges();
        }).catch(function (error) { return _this.onError(error); });
    };
    /**
     * @param {?=} num
     * @return {?}
     */
    FormioGridComponent.prototype.setPage = /**
     * @param {?=} num
     * @return {?}
     */
    function (num) {
        if (num === void 0) { num = -1; }
        if (this.isLoading) {
            return;
        }
        this.page = num !== -1 ? num : this.page;
        if (!this.query.hasOwnProperty('limit')) {
            this.query.limit = 10;
        }
        if (!this.query.hasOwnProperty('skip')) {
            this.query.skip = 0;
        }
        this.query.skip = this.page * this.query.limit;
        this.refreshGrid();
    };
    /**
     * @param {?} header
     * @return {?}
     */
    FormioGridComponent.prototype.sortColumn = /**
     * @param {?} header
     * @return {?}
     */
    function (header) {
        // Reset all other column sorts.
        _.each(this.header.headers, function (col) {
            if (col.key !== header.key) {
                col.sort = '';
            }
        });
        switch (header.sort) {
            case 'asc':
                header.sort = 'desc';
                this.query.sort = '-' + header.key;
                break;
            case 'desc':
                header.sort = '';
                delete this.query.sort;
                break;
            case '':
                header.sort = 'asc';
                this.query.sort = header.key;
                break;
        }
        this.refreshGrid();
    };
    /**
     * @param {?} page
     * @return {?}
     */
    FormioGridComponent.prototype.pageChanged = /**
     * @param {?} page
     * @return {?}
     */
    function (page) {
        this.setPage(page.page - 1);
    };
    FormioGridComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'formio-grid',
                    styles: [".formio-grid { position: relative; width: 100%; } .grid-refresh { height: 400px; width: 100%; } "],
                    template: "<ng-template #headerTemplate></ng-template> <ng-template #bodyTemplate></ng-template> <ng-template #footerTemplate></ng-template> <div class=\"formio-grid\"> <formio-alerts [alerts]=\"alerts\"></formio-alerts> <table class=\"table table-bordered table-striped table-hover\"> <ng-container *ngIf=\"initialized\" [ngTemplateOutlet]=\"header.template\"></ng-container> <formio-loader></formio-loader> <ng-container *ngIf=\"initialized\" [ngTemplateOutlet]=\"body.template\"></ng-container> <ng-container *ngIf=\"initialized\" [ngTemplateOutlet]=\"footer.template\"></ng-container> </table> </div> "
                },] },
    ];
    /** @nocollapse */
    FormioGridComponent.ctorParameters = function () { return [
        { type: FormioLoader },
        { type: FormioAlerts },
        { type: core.ComponentFactoryResolver },
        { type: core.ChangeDetectorRef }
    ]; };
    FormioGridComponent.propDecorators = {
        src: [{ type: core.Input }],
        onForm: [{ type: core.Input }],
        query: [{ type: core.Input }],
        refresh: [{ type: core.Input }],
        gridType: [{ type: core.Input }],
        components: [{ type: core.Input }],
        formio: [{ type: core.Input }],
        createText: [{ type: core.Input }],
        select: [{ type: core.Output }],
        rowSelect: [{ type: core.Output }],
        rowAction: [{ type: core.Output }],
        createItem: [{ type: core.Output }],
        error: [{ type: core.Output }],
        headerElement: [{ type: core.ViewChild, args: ['headerTemplate', { read: core.ViewContainerRef },] }],
        bodyElement: [{ type: core.ViewChild, args: ['bodyTemplate', { read: core.ViewContainerRef },] }],
        footerElement: [{ type: core.ViewChild, args: ['footerTemplate', { read: core.ViewContainerRef },] }]
    };
    return FormioGridComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var FormioGrid = /** @class */ (function () {
    function FormioGrid() {
    }
    FormioGrid.decorators = [
        { type: core.NgModule, args: [{
                    imports: [
                        common.CommonModule,
                        forms.FormsModule,
                        FormioModule,
                        pagination.PaginationModule.forRoot()
                    ],
                    declarations: [
                        FormioGridComponent,
                        FormGridHeaderComponent,
                        FormGridBodyComponent,
                        FormGridFooterComponent,
                        SubmissionGridHeaderComponent,
                        SubmissionGridBodyComponent,
                        SubmissionGridFooterComponent
                    ],
                    exports: [
                        FormioGridComponent
                    ],
                    entryComponents: [
                        FormGridHeaderComponent,
                        FormGridBodyComponent,
                        FormGridFooterComponent,
                        SubmissionGridHeaderComponent,
                        SubmissionGridBodyComponent,
                        SubmissionGridFooterComponent
                    ],
                    providers: [
                        FormioLoader,
                        FormioAlerts
                    ]
                },] },
    ];
    return FormioGrid;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @param {?} Class
 * @param {?} config
 * @param {?} ClassRoutes
 * @return {?}
 */
function extendRouter(Class, config, ClassRoutes) {
    _.each(Class.decorators, function (decorator) {
        _.each(decorator.args, function (arg) {
            if (arg.declarations) {
                _.each(config, function (component) { return arg.declarations.push(component); });
            }
            if (arg.imports) {
                _.each(arg.imports, function (_import, index) {
                    if ((_import.ngModule && (_import.ngModule.name === 'RouterModule')) ||
                        (_import.name === 'RouterModule')) {
                        arg.imports[index] = router.RouterModule.forChild(ClassRoutes(config));
                    }
                });
            }
        });
    });
    return Class;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var FormioResource = /** @class */ (function () {
    function FormioResource() {
    }
    /**
     * @param {?=} config
     * @return {?}
     */
    FormioResource.forChild = /**
     * @param {?=} config
     * @return {?}
     */
    function (config) {
        return extendRouter(FormioResource, config, FormioResourceRoutes);
    };
    /**
     * @param {?=} config
     * @return {?}
     */
    FormioResource.forRoot = /**
     * @param {?=} config
     * @return {?}
     */
    function (config) {
        return extendRouter(FormioResource, config, FormioResourceRoutes);
    };
    FormioResource.decorators = [
        { type: core.NgModule, args: [{
                    imports: [
                        common.CommonModule,
                        FormioModule,
                        FormioGrid,
                        router.RouterModule
                    ],
                    declarations: [
                        FormioResourceComponent,
                        FormioResourceCreateComponent,
                        FormioResourceIndexComponent,
                        FormioResourceViewComponent,
                        FormioResourceEditComponent,
                        FormioResourceDeleteComponent
                    ]
                },] },
    ];
    return FormioResource;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

exports.FormioResourceConfig = FormioResourceConfig;
exports.FormioResources = FormioResources;
exports.FormioResourceService = FormioResourceService;
exports.FormioResourceComponent = FormioResourceComponent;
exports.FormioResourceViewComponent = FormioResourceViewComponent;
exports.FormioResourceEditComponent = FormioResourceEditComponent;
exports.FormioResourceDeleteComponent = FormioResourceDeleteComponent;
exports.FormioResourceCreateComponent = FormioResourceCreateComponent;
exports.FormioResourceIndexComponent = FormioResourceIndexComponent;
exports.FormioResourceRoutes = FormioResourceRoutes;
exports.FormioResource = FormioResource;

Object.defineProperty(exports, '__esModule', { value: true });

})));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { EventEmitter, Injectable } from '@angular/core';
import { FormioAuthConfig } from './auth.config';
import { FormioAppConfig } from '../formio.config';
import { get, each } from 'lodash';
import { Formio } from 'formiojs';
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
            Formio.setBaseUrl(this.appConfig.apiUrl);
            Formio.setProjectUrl(this.appConfig.appUrl);
            Formio.formOnly = !!this.appConfig.formOnly;
        }
        else {
            console.error('You must provide an AppConfig within your application!');
        }
        this.loginForm =
            this.appConfig.appUrl +
                '/' +
                get(this.config, 'login.form', 'user/login');
        this.registerForm =
            this.appConfig.appUrl +
                '/' +
                get(this.config, 'register.form', 'user/login');
        this.onLogin = new EventEmitter();
        this.onLogout = new EventEmitter();
        this.onRegister = new EventEmitter();
        this.onUser = new EventEmitter();
        this.onError = new EventEmitter();
        this.ready = new Promise(function (resolve, reject) {
            _this.readyResolve = resolve;
            _this.readyReject = reject;
        });
        // Register for the core events.
        Formio.events.on('formio.badToken', function () { return _this.logoutError(); });
        Formio.events.on('formio.sessionExpired', function () { return _this.logoutError(); });
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
        this.projectReady = Formio.makeStaticRequest(this.appConfig.appUrl).then(function (project) {
            each(project.access, function (access) {
                _this.formAccess[access.type] = access.roles;
            });
        }, function () {
            _this.formAccess = {};
            return null;
        });
        // Get the access for this project.
        this.accessReady = Formio.makeStaticRequest(this.appConfig.appUrl + '/access').then(function (access) {
            each(access.forms, function (form) {
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
        this.userReady = Formio.currentUser().then(function (user) {
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
            Formio.clearCache();
            Formio.setUser(null);
        }
        this.authenticated = !!Formio.getToken();
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
                each(_this.roles, function (role, roleName) {
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
        Formio.logout()
            .then(function () { return _this.onLogout.emit(); })
            .catch(function () { return _this.logoutError(); });
    };
    FormioAuthService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    FormioAuthService.ctorParameters = function () { return [
        { type: FormioAppConfig },
        { type: FormioAuthConfig }
    ]; };
    return FormioAuthService;
}());
export { FormioAuthService };
if (false) {
    /** @type {?} */
    FormioAuthService.prototype.user;
    /** @type {?} */
    FormioAuthService.prototype.authenticated;
    /** @type {?} */
    FormioAuthService.prototype.loginForm;
    /** @type {?} */
    FormioAuthService.prototype.onLogin;
    /** @type {?} */
    FormioAuthService.prototype.onLogout;
    /** @type {?} */
    FormioAuthService.prototype.registerForm;
    /** @type {?} */
    FormioAuthService.prototype.onRegister;
    /** @type {?} */
    FormioAuthService.prototype.onUser;
    /** @type {?} */
    FormioAuthService.prototype.onError;
    /** @type {?} */
    FormioAuthService.prototype.ready;
    /** @type {?} */
    FormioAuthService.prototype.readyResolve;
    /** @type {?} */
    FormioAuthService.prototype.readyReject;
    /** @type {?} */
    FormioAuthService.prototype.projectReady;
    /** @type {?} */
    FormioAuthService.prototype.accessReady;
    /** @type {?} */
    FormioAuthService.prototype.userReady;
    /** @type {?} */
    FormioAuthService.prototype.formAccess;
    /** @type {?} */
    FormioAuthService.prototype.submissionAccess;
    /** @type {?} */
    FormioAuthService.prototype.roles;
    /** @type {?} */
    FormioAuthService.prototype.is;
    /** @type {?} */
    FormioAuthService.prototype.appConfig;
    /** @type {?} */
    FormioAuthService.prototype.config;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Observable } from 'rxjs';
import { Formio } from 'formiojs';
var FormioService = /** @class */ (function () {
    function FormioService(url, options) {
        this.url = url;
        this.options = options;
        this.formio = new Formio(this.url, this.options);
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
        return Observable.create(function (observer) {
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
export { FormioService };
if (false) {
    /** @type {?} */
    FormioService.prototype.formio;
    /** @type {?} */
    FormioService.prototype.url;
    /** @type {?} */
    FormioService.prototype.options;
}

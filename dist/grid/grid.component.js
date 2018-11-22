/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, ViewChild, ViewContainerRef, ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';
import { FormioLoader } from '../components/loader/formio.loader';
import { FormioAlerts } from '../components/alerts/formio.alerts';
import { assign, each } from 'lodash';
import { Formio } from 'formiojs';
import FormComponents from './form/index';
import SubmissionComponents from './submission/index';
var FormioGridComponent = /** @class */ (function () {
    function FormioGridComponent(loader, alerts, resolver, ref) {
        this.loader = loader;
        this.alerts = alerts;
        this.resolver = resolver;
        this.ref = ref;
        this.page = 0;
        this.isLoading = false;
        this.initialized = false;
        this.select = this.rowSelect = new EventEmitter();
        this.rowAction = new EventEmitter();
        this.createItem = new EventEmitter();
        this.error = new EventEmitter();
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
            this.formio = new Formio(this.src, { formOnly: true });
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
        query = assign(query, this.query);
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
        each(this.header.headers, function (col) {
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
        { type: Component, args: [{
                    selector: 'formio-grid',
                    styles: [".formio-grid { position: relative; width: 100%; } .grid-refresh { height: 400px; width: 100%; } "],
                    template: "<ng-template #headerTemplate></ng-template> <ng-template #bodyTemplate></ng-template> <ng-template #footerTemplate></ng-template> <div class=\"formio-grid\"> <formio-alerts [alerts]=\"alerts\"></formio-alerts> <table class=\"table table-bordered table-striped table-hover\"> <ng-container *ngIf=\"initialized\" [ngTemplateOutlet]=\"header.template\"></ng-container> <formio-loader></formio-loader> <ng-container *ngIf=\"initialized\" [ngTemplateOutlet]=\"body.template\"></ng-container> <ng-container *ngIf=\"initialized\" [ngTemplateOutlet]=\"footer.template\"></ng-container> </table> </div> "
                },] },
    ];
    /** @nocollapse */
    FormioGridComponent.ctorParameters = function () { return [
        { type: FormioLoader },
        { type: FormioAlerts },
        { type: ComponentFactoryResolver },
        { type: ChangeDetectorRef }
    ]; };
    FormioGridComponent.propDecorators = {
        src: [{ type: Input }],
        onForm: [{ type: Input }],
        query: [{ type: Input }],
        refresh: [{ type: Input }],
        gridType: [{ type: Input }],
        components: [{ type: Input }],
        formio: [{ type: Input }],
        createText: [{ type: Input }],
        select: [{ type: Output }],
        rowSelect: [{ type: Output }],
        rowAction: [{ type: Output }],
        createItem: [{ type: Output }],
        error: [{ type: Output }],
        headerElement: [{ type: ViewChild, args: ['headerTemplate', { read: ViewContainerRef },] }],
        bodyElement: [{ type: ViewChild, args: ['bodyTemplate', { read: ViewContainerRef },] }],
        footerElement: [{ type: ViewChild, args: ['footerTemplate', { read: ViewContainerRef },] }]
    };
    return FormioGridComponent;
}());
export { FormioGridComponent };
if (false) {
    /** @type {?} */
    FormioGridComponent.prototype.src;
    /** @type {?} */
    FormioGridComponent.prototype.onForm;
    /** @type {?} */
    FormioGridComponent.prototype.query;
    /** @type {?} */
    FormioGridComponent.prototype.refresh;
    /** @type {?} */
    FormioGridComponent.prototype.gridType;
    /** @type {?} */
    FormioGridComponent.prototype.components;
    /** @type {?} */
    FormioGridComponent.prototype.formio;
    /** @type {?} */
    FormioGridComponent.prototype.createText;
    /** @type {?} */
    FormioGridComponent.prototype.select;
    /** @type {?} */
    FormioGridComponent.prototype.rowSelect;
    /** @type {?} */
    FormioGridComponent.prototype.rowAction;
    /** @type {?} */
    FormioGridComponent.prototype.createItem;
    /** @type {?} */
    FormioGridComponent.prototype.error;
    /** @type {?} */
    FormioGridComponent.prototype.headerElement;
    /** @type {?} */
    FormioGridComponent.prototype.bodyElement;
    /** @type {?} */
    FormioGridComponent.prototype.footerElement;
    /** @type {?} */
    FormioGridComponent.prototype.page;
    /** @type {?} */
    FormioGridComponent.prototype.isLoading;
    /** @type {?} */
    FormioGridComponent.prototype.initialized;
    /** @type {?} */
    FormioGridComponent.prototype.header;
    /** @type {?} */
    FormioGridComponent.prototype.body;
    /** @type {?} */
    FormioGridComponent.prototype.footer;
    /** @type {?} */
    FormioGridComponent.prototype.loader;
    /** @type {?} */
    FormioGridComponent.prototype.alerts;
    /** @type {?} */
    FormioGridComponent.prototype.resolver;
    /** @type {?} */
    FormioGridComponent.prototype.ref;
}

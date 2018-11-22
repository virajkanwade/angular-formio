/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormManagerService } from '../form-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormManagerConfig } from '../form-manager.config';
import { FormBuilderComponent } from '../../components/formbuilder/formbuilder.component';
import _ from 'lodash';
var FormManagerEditComponent = /** @class */ (function () {
    function FormManagerEditComponent(service, router, route, config, ref) {
        this.service = service;
        this.router = router;
        this.route = route;
        this.config = config;
        this.ref = ref;
        this.form = { components: [] };
        this.formReady = false;
        this.loading = false;
        this.editMode = false;
    }
    /**
     * @return {?}
     */
    FormManagerEditComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.route.url.subscribe(function (url) {
            // See if we are editing a form or creating one.
            if (url[0].path === 'edit') {
                _this.loading = true;
                _this.ref.detectChanges();
                _this.editMode = true;
                _this.formReady = _this.service.formio.loadForm().then(function (form) {
                    _this.form = form;
                    _this.builder.buildForm(form);
                    _this.loading = false;
                    _this.ref.detectChanges();
                    _this.formTitle.nativeElement.value = form.title;
                    _this.formType.nativeElement.value = form.display || 'form';
                });
            }
            _this.formType.nativeElement.addEventListener('change', function () {
                _this.builder.setDisplay(_this.formType.nativeElement.value);
            });
        });
    };
    /**
     * @return {?}
     */
    FormManagerEditComponent.prototype.onSave = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.loading = true;
        this.form.title = this.formTitle.nativeElement.value;
        this.form.display = this.formType.nativeElement.value;
        this.form.components = this.builder.formio.schema.components;
        if (this.config.tag) {
            this.form.tags = this.form.tags || [];
            this.form.tags.push(this.config.tag);
        }
        if (!this.form._id) {
            this.form.name = _.camelCase(this.form.title).toLowerCase();
            this.form.path = this.form.name;
        }
        this.service.formio.saveForm(this.form).then(function (form) {
            _this.form = form;
            _this.loading = false;
            if (_this.editMode) {
                _this.router.navigate(['../', 'view'], { relativeTo: _this.route });
            }
            else {
                _this.router.navigate(['../', form._id, 'view'], { relativeTo: _this.route });
            }
        });
    };
    FormManagerEditComponent.decorators = [
        { type: Component, args: [{
                    template: "<div class=\"loader\" *ngIf=\"loading\"></div> <div class=\"form-group row\"> <div class=\"col-sm-8\"> <input type=\"text\" class=\"form-control\" id=\"formTitle\" placeholder=\"Enter a Title\" #title> </div> <div class=\"col-sm-2\"> <select class=\"form-control\" id=\"formSelect\" #type> <option value=\"form\">Form</option> <option value=\"wizard\">Wizard</option> <option value=\"pdf\">PDF</option> </select> </div> <div class=\"col-sm-2\"> <button class=\"btn btn-primary btn-block\" (click)=\"onSave()\">Save Form</button> </div> </div> <form-builder [form]=\"form\" #builder></form-builder> <button class=\"btn btn-primary\" style=\"margin-top: 10px;\" (click)=\"onSave()\">Save Form</button> "
                },] },
    ];
    /** @nocollapse */
    FormManagerEditComponent.ctorParameters = function () { return [
        { type: FormManagerService },
        { type: Router },
        { type: ActivatedRoute },
        { type: FormManagerConfig },
        { type: ChangeDetectorRef }
    ]; };
    FormManagerEditComponent.propDecorators = {
        builder: [{ type: ViewChild, args: [FormBuilderComponent,] }],
        formTitle: [{ type: ViewChild, args: ['title',] }],
        formType: [{ type: ViewChild, args: ['type',] }]
    };
    return FormManagerEditComponent;
}());
export { FormManagerEditComponent };
if (false) {
    /** @type {?} */
    FormManagerEditComponent.prototype.builder;
    /** @type {?} */
    FormManagerEditComponent.prototype.formTitle;
    /** @type {?} */
    FormManagerEditComponent.prototype.formType;
    /** @type {?} */
    FormManagerEditComponent.prototype.form;
    /** @type {?} */
    FormManagerEditComponent.prototype.loading;
    /** @type {?} */
    FormManagerEditComponent.prototype.formReady;
    /** @type {?} */
    FormManagerEditComponent.prototype.editMode;
    /** @type {?} */
    FormManagerEditComponent.prototype.service;
    /** @type {?} */
    FormManagerEditComponent.prototype.router;
    /** @type {?} */
    FormManagerEditComponent.prototype.route;
    /** @type {?} */
    FormManagerEditComponent.prototype.config;
    /** @type {?} */
    FormManagerEditComponent.prototype.ref;
}

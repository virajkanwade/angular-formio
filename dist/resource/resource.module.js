/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormioModule } from '../formio.module';
import { FormioGrid } from '../grid/grid.module';
import { FormioResourceComponent } from './resource.component';
import { FormioResourceViewComponent } from './view/view.component';
import { FormioResourceEditComponent } from './edit/edit.component';
import { FormioResourceDeleteComponent } from './delete/delete.component';
import { FormioResourceCreateComponent } from './create/create.component';
import { FormioResourceIndexComponent } from './index/index.component';
import { FormioResourceRoutes } from './resource.routes';
import { extendRouter } from '../formio.utils';
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
        { type: NgModule, args: [{
                    imports: [
                        CommonModule,
                        FormioModule,
                        FormioGrid,
                        RouterModule
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
export { FormioResource };

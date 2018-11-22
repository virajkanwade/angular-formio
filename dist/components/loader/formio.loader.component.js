/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component } from '@angular/core';
import { FormioLoader } from './formio.loader';
var FormioLoaderComponent = /** @class */ (function () {
    function FormioLoaderComponent(loader) {
        this.loader = loader;
    }
    FormioLoaderComponent.decorators = [
        { type: Component, args: [{
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
export { FormioLoaderComponent };
if (false) {
    /** @type {?} */
    FormioLoaderComponent.prototype.loader;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { RouterModule } from '@angular/router';
import { each } from 'lodash';
/**
 * @param {?} Class
 * @param {?} config
 * @param {?} ClassRoutes
 * @return {?}
 */
export function extendRouter(Class, config, ClassRoutes) {
    each(Class.decorators, function (decorator) {
        each(decorator.args, function (arg) {
            if (arg.declarations) {
                each(config, function (component) { return arg.declarations.push(component); });
            }
            if (arg.imports) {
                each(arg.imports, function (_import, index) {
                    if ((_import.ngModule && (_import.ngModule.name === 'RouterModule')) ||
                        (_import.name === 'RouterModule')) {
                        arg.imports[index] = RouterModule.forChild(ClassRoutes(config));
                    }
                });
            }
        });
    });
    return Class;
}

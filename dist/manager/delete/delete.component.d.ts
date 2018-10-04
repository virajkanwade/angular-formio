import { FormManagerService } from '../form-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
export declare class FormManagerDeleteComponent {
    service: FormManagerService;
    router: Router;
    route: ActivatedRoute;
    constructor(service: FormManagerService, router: Router, route: ActivatedRoute);
    onDelete(): void;
    onCancel(): void;
}

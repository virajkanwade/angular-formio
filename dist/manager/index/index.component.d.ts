import { OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormManagerService } from '../form-manager.service';
import { FormManagerConfig } from '../form-manager.config';
export declare class FormManagerIndexComponent implements OnInit {
    service: FormManagerService;
    route: ActivatedRoute;
    router: Router;
    config: FormManagerConfig;
    constructor(service: FormManagerService, route: ActivatedRoute, router: Router, config: FormManagerConfig);
    ngOnInit(): void;
    onAction(action: any): void;
    onSelect(row: any): void;
    onCreateItem(): void;
}

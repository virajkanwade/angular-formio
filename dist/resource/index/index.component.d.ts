import { OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormioResourceService } from '../resource.service';
import { FormioResourceConfig } from '../resource.config';
export declare class FormioResourceIndexComponent implements OnInit {
    service: FormioResourceService;
    route: ActivatedRoute;
    router: Router;
    config: FormioResourceConfig;
    private ref;
    gridSrc?: string;
    gridQuery: any;
    formTitle: String;
    constructor(service: FormioResourceService, route: ActivatedRoute, router: Router, config: FormioResourceConfig, ref: ChangeDetectorRef);
    ngOnInit(): void;
    onSelect(row: any): void;
    onCreateItem(): void;
}

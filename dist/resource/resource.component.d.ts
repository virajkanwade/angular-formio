import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormioResourceService } from './resource.service';
export declare class FormioResourceComponent implements OnInit {
    service: FormioResourceService;
    route: ActivatedRoute;
    constructor(service: FormioResourceService, route: ActivatedRoute);
    ngOnInit(): void;
}

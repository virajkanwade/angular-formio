import { OnInit } from '@angular/core';
import { FormManagerService } from '../form-manager.service';
import { ActivatedRoute } from '@angular/router';
export declare class FormManagerFormComponent implements OnInit {
    service: FormManagerService;
    route: ActivatedRoute;
    constructor(service: FormManagerService, route: ActivatedRoute);
    ngOnInit(): void;
}

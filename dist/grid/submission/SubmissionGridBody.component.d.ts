import { Formio } from 'formiojs';
import { GridBodyComponent } from '../GridBodyComponent';
export declare class SubmissionGridBodyComponent extends GridBodyComponent {
    load(formio: Formio, query?: any): any;
    /**
     * Render the cell data.
     *
     * @param row
     * @param header
     * @return any
     */
    view(row: any, header: any): any;
}

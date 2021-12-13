import { DTO } from "../DTO";
import { FormTask } from "../Requests/FormTask";

export class FormTaskData extends DTO {
    tasks: FormTask[] = [];
}
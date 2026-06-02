import { DocType } from "./DocType";

export type User = {
	user_id: number;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	doc_type: DocType;
	document: string;
};

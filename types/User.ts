import { DocType } from "./DocType";

export type User = {
	user_id: number;
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
	doc_type: DocType;
	document: string;
};

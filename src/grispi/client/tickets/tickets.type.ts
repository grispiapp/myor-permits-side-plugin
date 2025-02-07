export type Ticket = {
  key: string;
  callMergeStatus: any;
  channel: string;
  form: Form;
  createdAt: number;
  updatedAt: number;
  solvedAt: any;
  comments: Comment[];
  fieldMap: {
    [key: string]: FieldMap;
  };
  relation: any[];
  resolution: any;
};

type Form = {
  id: number;
  name: string;
  description: string;
  permission: string;
  consent: any;
  enabled: boolean;
  endUserForm: boolean;
  fields: Field[];
};

type FieldMap = {
  id: any;
  value: any;
  serializedValue: string | null;
  userFriendlyValue: string;
  type: string;
  key: string;
};

type Role = {
  authority: string;
  impliedAuthorities: string[];
  teamUser: boolean;
};

export type User = {
  role: Role;
  groups: any[];
  id: number;
  email: string;
  emails: any[];
  fullName: string;
  firstName: string;
  lastName: string;
  phone: string;
  phones: any[];
  organization: any;
  language: any;
  tags: any[];
  enabled: boolean;
  profilePicture: string;
  createdAt: number;
  updatedAt: number;
  fields: any[];
};

type Attachment = {
  id: number;
  filename: string;
  objectKey: string;
  objectThumbKey: string;
  bucket: string;
  mimeType: string;
  size: number;
  userId: number;
  objectThumbUrl: string;
  objectUrl: string;
};

type Comment = {
  attachments: Attachment[];
  id: number;
  body: string;
  publicVisible: boolean;
  ticketKey: string;
  createdAt: number;
  creator: User;
  call: any;
  toId: any;
  toEmail: any;
  commentCCs: any[];
  mentionedUsers: any[];
  channel: string;
  externalId: string;
};

export type Field = {
  key: string;
  conditions: any[];
  required: {
    type: string;
    ids: any[];
  };
};

export type Agent = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
};

export type Requester = {
  id: number;
  fullName: string;
  email?: string;
  phone?: string;
};

export type SetFieldPayload = {
  key: string;
  value: string | boolean | number;
};

export type UpdateCommentPayload = {
  body: string;
  publicVisible: boolean;
  creator: SetFieldPayload[];
};

export type UpdateTicketPayload = {
  fields?: SetFieldPayload[];
  comment?: UpdateCommentPayload;
};

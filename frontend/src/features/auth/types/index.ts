export type AuthUser = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
};

export type LoginPayload = {
  username: string;
  password: string;
};

export type LoginResponse = {
  access: string;
  refresh: string;
  user: AuthUser;
};

export type RefreshResponse = {
  access: string;
  refresh?: string;
};

export type UpdateMePayload = {
  email: string;
  first_name: string;
  last_name: string;
};

export type ChangePasswordPayload = {
  current_password: string;
  new_password: string;
  new_password_confirm: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  uid: string;
  token: string;
  new_password: string;
  new_password_confirm: string;
};

export type MessageResponse = {
  detail: string;
};

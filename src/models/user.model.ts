export interface IUser{
  id: string,
  name: string
}

export interface IUserToken{
  access_token: string,
  refresh_token: string,

  /**
   * timestamp
   */
  expires_at: string
}

interface IDefaultLoginParam {
  device_uuid?: string;
  device_type?: string;
  device_signature?: string;
}

export interface ILoginWithPassword extends IDefaultLoginParam{
  user_email: string;
  password: string;
}

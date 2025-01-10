export interface User {
  ID: number;
  FirstName: string;
  LastName: string;
  Email: string;
  CompanyID: number;
  IsCCS: boolean;
  IsActive: boolean;
  IsWorking: boolean;
  UserRoleID: number;
  CurrentProjectID: number;
  UserName: string;
  Password: string;
  AuthCode: string;
}

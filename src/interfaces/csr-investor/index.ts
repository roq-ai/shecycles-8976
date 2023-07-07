import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface CsrInvestorInterface {
  id?: string;
  branding_details?: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface CsrInvestorGetQueryInterface extends GetQueryInterface {
  id?: string;
  branding_details?: string;
  user_id?: string;
}

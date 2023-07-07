import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface GovSubsidyProviderInterface {
  id?: string;
  subsidy_details?: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface GovSubsidyProviderGetQueryInterface extends GetQueryInterface {
  id?: string;
  subsidy_details?: string;
  user_id?: string;
}

import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface CarbonOffsetInvestorInterface {
  id?: string;
  photo_details?: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface CarbonOffsetInvestorGetQueryInterface extends GetQueryInterface {
  id?: string;
  photo_details?: string;
  user_id?: string;
}

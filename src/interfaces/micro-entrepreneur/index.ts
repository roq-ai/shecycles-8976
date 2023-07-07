import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface MicroEntrepreneurInterface {
  id?: string;
  station_details?: string;
  location?: string;
  annual_revenue_potential?: number;
  annual_expenditure?: number;
  roi?: number;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface MicroEntrepreneurGetQueryInterface extends GetQueryInterface {
  id?: string;
  station_details?: string;
  location?: string;
  user_id?: string;
}

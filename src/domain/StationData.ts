import { MainModule } from './modules/MainModule';
import { User } from './User';

export interface StationData {
  devices: MainModule[];
  user: User;
}
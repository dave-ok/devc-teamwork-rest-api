import DBModel from './dbmodel';


export default class Feed extends DBModel {
  static viewTable() { return 'vw_feed'; }
}

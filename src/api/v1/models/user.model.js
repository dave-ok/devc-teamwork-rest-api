import DBModel from './dbmodel';

class User extends DBModel {
    constructor(){
        this._userid = -1;
        this._firstname = '';
        this._lastname = '';
        this._email = '';
        this._password = '';
        this._gender = '';
        this._jobrole = '';
        this._department = '';
        this._address = '';        //specify properties here with underscore
    }

    static pkfield = 'userid'; //primary key field
    static viewTable = 'users'; //prejoin in db as view for lookup fields
    static modifyTable = 'users'; //table meant to write to
    
    //fields to be written to
    static modifyFields = [
        'firstname',
        'lastname',
        'email',
        'password',
        'gender',
        'jobrole',
        'department',
        'address'
    ]; 
}
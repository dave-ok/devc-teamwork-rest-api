import db from "../../db";
import { 
    genAndClause, 
    joinColumns, 
    genInsertValuesClause, 
    buildValuesArray, 
    genSetClause
} from "../../utils/modelUtils";

export default class DBModel {

    //TO-DO: data validation on save
    
    //==================================================================>
    // OVERWRITE THESE IN CHILDREN
    //===================================================================>
    static pkfield = ''; //primary key field
    static viewTable = ''; //prejoin in db as view for lookup fields
    static modifyTable = ''; //table meant to write to
    static modifyFields = []; //fields to be written to
    //====================================================================>
    

    //======================================================================>
    // AUTO GETTER AND SETTER
    //======================================================================>

    get [field] (){
        //computed getter
        return this[`_${field}`];
    }
    set [field] (value){
        //computed setter
        this[`_${field}`] = value;
    }
    //======================================================================>


    //========================================================================>
    // GET SINGLE RECORD BY ID
    //========================================================================>

    static async getbyId(id, returnCols = []){
        //query db by id

        //check if optional return columns are specified
        //otherwise return all (*)
        const selCols = returnCols == '' ? '*' : joinColumns(returnCols);

        //build query string to return one record matching pk field
        const queryString = `
            select ${selCols} 
            from ${this.viewTable} 
            where ${this.pkfield} = ${id} limit 1`;  

        //run query
        const result = await db.query(queryString);

        return result.rows[0];            
    }
    //===================================================================>


    //===================================================================>
    // GET SEVERAL RECORDS WITH CUSTOM OUTPUT
    //===================================================================>

    static getAll(whereObject = {}, returnCols = [], orderbyArray = []){
        //query db with flexible query
        
        let whereClause = '';

        //check if whereclause object specified
        //if specified build where clause using key/pair separated by AND
        if (Object.keys(whereObject).length) {
            whereClause = `where ${genAndClause(whereObject)}`;
        }

        //if no order by specified, order by PK field
        let orderClause = `${this.pkfield} asc`;
        
        //if specified join various order-by phrases with commas
        if (orderby.length) {
           orderClause = joinColumns(orderbyArray); 
        }

        //check if optional return columns are specified
        //otherwise return all (*)
        const selCols = returnCols == '' ? '*' : joinColumns(returnCols); 
        
        //build select query string
        const queryString = `
            select ${selCols} 
            from ${this.viewTable} ${whereClause} 
            order by ${orderClause};
        `;  
        
        //run query
        const result = await db.query(queryString);

        return result.rows; 
    }
    //=====================================================================>


    //===================================================================>
    // SAVE AS INSERT FOR NEW RECORDS OR UPDATE FOR EXISTING RECORDS
    //===================================================================>

    async save() {
        if(this._userid <= 0){
            //an insert
            //generate Insert fields clause
            const insertFields = joinColumns(this.constructor.modifyFields);

            //build insert query string
            const queryString = `
                insert into ${this.constructor.modifyTable} (${insertFields})
                values (${genInsertValuesClause(this.constructor.modifyFields)}) 
                returning ${this.constructor.pkfield};
            `;

            //run insert query
            const result = await db.query(
                queryString, 
                buildValuesArray(this, this.constructor.modifyFields)
            );

            //update userid to new autogenerated value
            this[this.constructor.pkfield] = result.rows[0][this.constructor.pkfield];
        }

        else {
            //this is an update cos pk field has value  
            
            //build update query string speciying pk field matching record
            const queryString = `
                update ${this.constructor.modifyTable} 
                set ${genSetClause(this.constructor.modifyFields)}                    
                where ${this.constructor.pkfield} = ${this[this.constructor.pkfield]};
            `;

            //run update query
            const result = await db.query(
                queryString, 
                buildValuesArray(this, this.constructor.modifyFields)
            );


        }
    }

    //==========================================================================>


    //==========================================================================>
    // DELETE THIS RECORD
    //===========================================================================>

    async delete() {
        //build query string to delete record
        const queryString = `
            delete from ${this.constructor.modifyTable} 
            where ${this.constructor.pkfield} = $1;
        `;
        
        //run delete query
        await db.query(queryString, [this[this.constructor.pkfield]]);

        //empty object fields
        Object.keys(this).forEach((key) => this[key] = '');

        //reset pk field
        this[this.constructor.pkfield] = -1;
    }

    //======================================================================>
}
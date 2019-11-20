export default class Migration {
    constructor(migrationid, objname, createsql, dropsql, seed){
        this.migrationid = migrationid;
        this.objname = objname;
        this.createsql = createsql;
        this.dropsql = dropsql;
        this.seed = seed || '';
    }

    up(){
        return this.createsql;
    }

    down(){
        return this.dropsql;
    }

    id(){
        return this.id;
    }

    objname(){
        return this.objname;
    }
}
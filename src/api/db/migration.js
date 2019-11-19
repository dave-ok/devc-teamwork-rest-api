export default class Migration {
    constructor(migrationid, objname, createsql, dropsql){
        this.migrationid = migrationid;
        this.objname = objname;
        this.createsql = createsql;
        this.dropsql = dropsql;
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
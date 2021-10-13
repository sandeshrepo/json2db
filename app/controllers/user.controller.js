require('dotenv').config()
const sql = require("../models/db.js");
const db = require("../models");
const sequelize = require('sequelize');
const DataTypes = require('sequelize');
const UserModel = db.userModel;
const DigSingleValModel = db.dig_single_valModel;
const Op = require('sequelize').Op;
var moment = require('moment'); 
class UserController {

    static postuserdetails = async (req, res) => {
              
        const userDetails =await UserModel.build({  
            name: req.body.name,
            dateofbirth: req.body.dateofbirth,
            address: req.body.address,
            mobile_number: req.body.mobile_number,
            
         });
     await userDetails.save()
     if(!userDetails){
        return res.status(200).send({
            status: 404,
            message: 'No data found'   
        });
    }
    res.status(200).send({
        status: 200,
        message: 'Data Save Successfully' 
    });
} 

static postDigSingleVal = async (req, res) => {
              
    const postDigSingleVal =await DigSingleValModel.build({  
        report_date: req.body.report_date,
        report_date_str: req.body.report_date_str,
        application: req.body.application,
        avail_a: req.body.avail_a,
        avail_b: req.body.avail_b,
        errors_a: req.body.errors_a,
        errors_b: req.body.errors_b,
        tpm_a: req.body.tpm_a,
        tpm_b: req.body.tpm_b,
        created_at: req.body.created_at,
     });
 await postDigSingleVal.save()
 if(!postDigSingleVal){
    return res.status(200).send({
        status: 404,
        message: 'No data found'   
    });
}
res.status(200).send({
    status: 200,
    message: 'Data Save Successfully' 
});
} 

catch(error){
    console.log(error)
    return res.status(400).send({
        message:'Unable to insert data',
        errors: error,
        status: 400
    });
}
    static getuserdetails = async (req, res) => {
        const userDetails = await UserModel.findAll()
    if(!userDetails){
        return res.status(200).send({
            status: 404,
            message: 'No data found'   
        });
    }
    const qi = sql.getQueryInterface()
    try {
        await qi.createTable('Person', {
            name: DataTypes.STRING,
            isBetaMember: {
              type: DataTypes.BOOLEAN,
              defaultValue: false,
              allowNull: false
            }
        });
    
        await qi.addColumn('Person', 'sanName', { type: DataTypes.STRING });
      }
      catch(e) {
        console.log('Error executing ', e)
      }


    res.status(200).send({
        status: "added",
        message: userDetails
    });
    } 
    catch(error){
    console.log(error)
    return res.status(400).send({
        message:'Unable to find data',
        errors: error,
        status: 400
    });
    }
    static updatedetails = async (req, res) => {
        
        const id=req.body.id;
        
        const userDetails =await UserModel.update({  
            name: req.body.name,
            dateofbirth: req.body.dateofbirth,
            address: req.body.address,
            mobile_number: req.body.mobile_number,
        },
            {where: {id: req.body.id} 
        });
     if(!userDetails){
        return res.status(200).send({
            status: 404,
            message: 'No data found'   
        });
    }
    res.status(200).send({
        status: 200,
        message: 'Data Update Successfully' 
    });
} 
catch(error){
    console.log(error)
    return res.status(400).send({
        message:'Unable to update data',
        errors: error,
        status: 400
    });
}
    static deletedetails = async (req, res) => {
        const id= req.body.id;
        const userDetails = await UserModel.destroy({
            where: { id: id }
        });
    if(!userDetails){
        return res.status(200).send({
            status: 404,
            message: 'No data found'   
        });
    }
    res.status(200).send({
        status: 200,
        message: 'Data Delete Successfully' 
    });
    } 
    catch(error){
    console.log(error)
    return res.status(400).send({
        message:'Unable to Delete data',
        errors: error,
        status: 400
    });
    }

    static getRecord = async (req, res) => {
        var name = req.params.name

        var counts = 0
        counts = await db.sequelize.query("SELECT * FROM refdata where name='"+name+"'", { type: sequelize.QueryTypes.SELECT });
        console.log('counts ' +JSON.stringify(counts));
        if(null!=counts){  
            console.log(counts[0]["value\|text"]);
            res.status(200).send(counts[0]["value\|text"]);
        }
    
    }

    catch(error){
        console.log(error)
        return res.status(400).send({
            message:'Unable to retrieve data',
            errors: error,
            status: 400
        });
    }

    /*static getRecord = async (req, res) => {
        this.record(req,res)
    }*/

    static recordWithBody = async (req, res) => {
        this.record(req,res)
    }

    static record = async (req, res) => {
        var name = req.params.name
        var value = req.params.value
        var body = req.body
        var valueToBeSaved = "";
        
        console.log(JSON.stringify(body))
        if(null!=body && body!=undefined){
            if(typeof body == 'object'){
                valueToBeSaved = JSON.stringify(body)
            }else{
                valueToBeSaved = body
            }           
        }

        if(null!=value && value!=undefined){
            valueToBeSaved = value
        }

        console.log(">>>> ",JSON.stringify(valueToBeSaved))

        if(null==name || undefined==name || null==valueToBeSaved || undefined ==valueToBeSaved){
            return res.status(400).send({
                message:'Invalid data passed; Format is <host:port>/record/<name>/<value> or <host:port>/record/name value in body; value in body can be json too',
                status: 400
            });
        }
        var newObj = {};

        newObj["tableName"] = "refdata";
        newObj["unique"] = ["name"]
        newObj["items"] = [{"name": name, "value|text": valueToBeSaved}]
        req.body = newObj
        this.push(req,res)
    }
    catch(error){
        console.log(error)
        return res.status(400).send({
            message:'Unable to process',
            errors: error,
            status: 400
        });
    }
    //Custom Pushing endpoint to handle any JSON object and save to database
    static push = async (req, res) => {
    try{
    const qi = sql.getQueryInterface()
    console.log(JSON.stringify(req.body))
    var obj = req.body;
    var tablePushed = [];
    var totalRecords = 0;
    var recordsUpdated = 0;
    //var obj = JSON.parse(obj)
    var tableName = null;
    var fields = {}
    var items = {}
    var hasId = false
    var hasCreatedAt = false
    var unique = []
    for (var k in obj) {
        console.log(k+" - "+obj[k])
        if(k === 'tableName'){
            tableName = obj[k];
        }
        if(k === 'items' || k === 'item'){
            items = obj[k];
        }
        if(k === 'unique'){
            if(obj[k]!=null){
                if(Array.isArray(obj[k])){
                    unique = obj[k];
                }else{
                    unique.push(obj[k]);
                }
            }
        }
    } 

    if(tableName == null || tableName ==undefined || Object.keys(items).length === 0 && items.constructor === Object){
        return res.status(400).send({
            message:'Unable to find tableName or missing items',
            status: 400
        });
    }

    if(null!=items && undefined!=items && items.length > 0){
        for (var k in items[0]) {
            var added = false
            k = k.toLowerCase()
            console.log(k+" - "+items[0][k])            
            if(k=="id"){
                hasId = true
                fields[k] = { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
                added = true
            }
            if(k=="createdAt" || k=="createdat"){
                hasCreatedAt = true
                fields["createdat"] = { type: DataTypes.TIME }
                added = true
            }
            if(added===false){
                //fields[k] = DataTypes.STRING
                if(k.indexOf("|")>0){
                    var arr = k.split("|");
                    if(arr[1].toLowerCase()=="text"){
                        fields[k] = DataTypes.TEXT
                    }else if(arr[1].toLowerCase()=="date"){
                        fields[k] = { type: DataTypes.DATE }
                    }else if(arr[1].toLowerCase()=="time"){
                        fields[k] = { type: DataTypes.DATE }
                    }else if(arr[1].toLowerCase()=="float"){
                        fields[k] = DataTypes.FLOAT
                    }
                }else{
                    fields[k] = DataTypes.STRING
                }
            }
        }
    }else{
        return res.status(400).send({
            message:'Unable to find items or items is 0 length',
            status: 400
        });
    }
    if(hasId==false){
        fields["id"] = { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
    }
    if(hasCreatedAt==false){
        fields["createdat"] = { type: DataTypes.DATE }
    }

    var counts = 0
    counts = await db.sequelize.query("SELECT COUNT(*) FROM pg_tables where tablename='"+tableName+"'", { type: sequelize.QueryTypes.SELECT });
    console.log('creating ' +fields);
    console.log('counts ' +JSON.stringify(counts));
    if(null!=counts && null!=counts[0] && counts[0].count  == 0 || counts[0].count=='0'){   
        //creating if table does not exist  
        console.log("Creating table "+tableName)  
        await qi.createTable(tableName, fields);
        tablePushed.push(tableName)
    }else{
        console.log("Already present table: "+tableName)  
        //check if all columns are present else create missing columns
        //await qi.addColumn('Person', 'sanName', { type: DataTypes.STRING });
        //ALTER TABLE teachers ADD COLUMN IF NOT EXISTS name2 VARCHAR(100)
        var results = await db.sequelize.query("SELECT column_name FROM information_schema.columns WHERE table_name='"+tableName+"'", { type: sequelize.QueryTypes.SELECT });
        var columns = []
        if(null!=results && results.length > 0){
            for (var i = 0; i < results.length; i++) {
                columns.push(results[i].column_name.toLowerCase())
            }
        }
        console.log(JSON.stringify(results))
        console.log("---> ",JSON.stringify(unique))

        for( var f in fields){
            f = f.toLowerCase()
            if(f!="id"){
                try{
                    if(Array.isArray(columns) && columns.includes(f) == true){
                        console.log(f," exists")
                    }else{
                        console.log(f," <+> adding")
                        if(f=="createdat"){
                            qi.addColumn(tableName, f, { type: DataTypes.DATE });
                        }else{
                            qi.addColumn(tableName, f, { type: DataTypes.STRING });
                        }
                    } 
                    
                }catch(error){
                    console.log("--")
                }
            }
        }
        //check if all columns
                //VALIDATE if there is wrong columns passed in unique
                if(Array.isArray(unique) && unique.length>0){
                    for(var x=0; x<unique.length; x++){
                        if(columns.includes(unique[x].toLowerCase())==false){
                            return res.status(400).send({
                                message:'Invalid columns passed for attribute unique, use same column names as database columns being passed',
                                status: 400
                            });
                        }
                    }
                }
                //VALIDATE
    }
    const Model = await db.sequelize.define(tableName, fields,{timestamps: false});

    //const jane = await Model.create({ name: "Nas" });
    //console.log("Auto-generated ID:", jane.id);
    if(null!=items && undefined!=items && items.length > 0){
        for (var i = 0; i < items.length; i++) {
                //delete existing records with passed unique as tuple
                totalRecords++;
                var deleteVars = []
                if(Array.isArray(unique) && unique.length>0){
                    for(var j=0; j < unique.length; j++){
                        var field = unique[j];
                        var obj = {};
                        obj[field] = items[i][field].toString()
                        deleteVars.push(obj); 
                    }
                }
                try{
                console.log("Deleting ",deleteVars)
                if( null!=deleteVars && deleteVars.length>0){
                    var delresult = await Model.destroy({
                        where: {
                            [Op.and]: [
                                deleteVars
                            ]
                        }
                    });
                    console.log("DELERES -> ", JSON.stringify(delresult))
                    recordsUpdated = delresult
                }
                 //delete existing records with passed unique as tuple
                console.log(JSON.stringify(items[i]))
                delete items[i].id
                items[i].createdat = "2010-01-01 01:59:59";//moment().format('YYYY-MM-DD HH:mm:ss')
                console.log(JSON.stringify(items[i]))
                const addedObject = await Model.create(items[i]);
                console.log("Auto-generated ID:", addedObject.id," createdat:", addedObject.createdat);
            }catch(error){
                console.log("Error while inserting ",error)
            }
        }
    }
    }
    catch(error){
        console.log(error)
        return res.status(400).send({
            message:'Unable to update data',
            errors: error,
            status: 400
        });
    }
    //select count(*) from pg_tables where tablename='users'
    

    res.status(200).send({
        status: "success",
        counts: counts,
        totalRecords: totalRecords,
        recordsUpdated: recordsUpdated,
        tablePushed: tablePushed
    });
    }
    catch(error){
        console.log(error)
        return res.status(400).send({
            message:'Unable to process',
            errors: error,
            status: 400
        });
    }
    //Custom
}

module.exports = UserController
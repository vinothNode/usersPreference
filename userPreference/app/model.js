const mysql = require('mysql'); 
const express = require('express');
const userRouter = express.Router();
const { get, first } = require('lodash'); 

let  _get = (object, path, defaultValue='') => get(object, path, defaultValue)

let _first = (array) => first(array);

const DBConnectionDetails = {
    TEST: {
        host: 'gcs-velogic.cqugpyqvawm7.us-east-1.rds.amazonaws.com',
        user: 'gcs_velogic',
        password: 'Tymeplus.test$2023',
    },
    LIVE: {
        host: 'tymeplus-live.cjidhmpdfztz.af-south-1.rds.amazonaws.com',
        user: 'gcs_velogic',
        password: 'Tymeplus.live$2023$protected$2023',
    },
    RONGAI :{
        host: 'rongai-tymeplus-live-db.cjidhmpdfztz.af-south-1.rds.amazonaws.com',
        user: 'gcs_velogic',
        password: 'rongaitymeplus',
    }
};

const SERVER = 'RONGAI';

var connection = mysql.createConnection({

    host: DBConnectionDetails[SERVER].host,
    user: DBConnectionDetails[SERVER].user,
    password: DBConnectionDetails[SERVER].password,
    database: 'tymeplus',
    dateStrings: true,
});

const executeQuery = (query, parameters) => {
    return new Promise(function(resolve, reject) {
        try {
            connection.query(query, parameters, function (error, results, fields) {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        } catch (err) {
            console.log(JSON.stringify(err))
            reject(err);
        }
    });
};


const getUserDetails = async(req,res)=>{
  try{
        // const body = req.body
        let responseValue = {};
        let user_id = [];
        let qry = '';
        let qryRes = '';
         qry = `SELECT user_department.user_id FROM user_department 
         WHERE status_id = 1 AND role_id IN (1, 2, 3) 
         GROUP BY user_department.user_id;`
         qryRes = await executeQuery(qry,[]);
         user_id.push(qryRes)
        user_id = Object.values(qryRes)
          console.log(user_id)
         user_id.forEach(async(data)=>{
            let qry = '';
            let qryRes = '';
            console.log("userdata =>", data);
//  REPORT 1 => attence Report
            qry = `INSERT INTO user_preference (user_preference_id, user_id, report_id, status_name) VALUES ('', ${data.user_id}, 1, 'true');`
            
            qryRes = await executeQuery(qry,[])
            console.log(qry)
//  REPORT 2 => OverTime Report
            qry = 
            `INSERT INTO user_preference (user_preference_id, user_id, report_id, status_name) VALUES ('', ${data.user_id}, 2, 'true');`
            qryRes = await executeQuery(qry,[])
            console.log(qry)
//  REPORT 3 => latCheckin Report
            qry = 
            `INSERT INTO user_preference (user_preference_id, user_id, report_id, status_name) VALUES ('', ${data.user_id}, 3, 'true');`
            qryRes = await executeQuery(qry,[])
            console.log(qry)
//  REPORT 4 => earlyCheckOut
            qry = 
            `INSERT INTO user_preference (user_preference_id, user_id, report_id, status_name) VALUES ('', ${data.user_id}, 4, 'true');`
            qryRes = await executeQuery(qry,[])
            console.log(qry)
//  REPORT 5 => absent Report
            qry = 
            `INSERT INTO user_preference (user_preference_id, user_id, report_id, status_name) VALUES ('', ${data.user_id}, 5, 'true');`
            qryRes = await executeQuery(qry,[])
            console.log(qry)
         })

        // const annual = {
        //     available: await isStaffHavingAnnualLeaves(body.user_id)
        //     }

        responseValue ={
            // remainingAnnualLeaves : annual.available,
            // user_id : body.user_id
            success : true,
            data : user_id
        }
        
        return await res.status(200).json({
            success : true,
            data:responseValue
        })
    
        
  }catch(error){
    return res.status(403).json({
        success:false,
        data:error
    })
  }
}

userRouter.get('/',getUserDetails);
module.exports= userRouter
//Requires
const dotenv = require("dotenv");
dotenv.config();
var moment = require('moment');
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const { validationResult } = require('express-validator');
const { connectionReady, connectionLost } = require('./connection')
const dbSequelize = require('../config/database_sequelize.js');
const { generateImage,  createClient } = require('./handle')
const Excel = require('xlsx');

const sequelize = dbSequelize.sequelize;
const fs = require('fs');
//**SESSION WHATSAPP */
const SESSION_FILE_PATH = './session.json';
var client;
var sessionData;
//Imports
const general_services = require('../services/general.js');
 
let flags=false;
let messageWhatssap=[];
let codQR;
 


const createComment=async(req,res,next)=>{
  try {
    const result = await general_services.createComment(req);
    if (result.status === 200) {
      res.status(result.status).json(result.message);
    } else {
      res.status(result.status).json(result.message);
    }
    next();
  } catch (e) {
    console.log('Error', e);
    res.status(500).json({
      message: 'Por favor, valida los datos ingresados e intenta nuevamente.',
    });
  }
};

// const withSession = () => {
//   console.log(`Validando session con Whatsapp...`)
//   sessionData = require(SESSION_FILE_PATH);
//   client = new Client(createClient(sessionData, true));

//   client.on('ready', () => {
//       connectionReady()
//       // listenMessage()
//   });

//   client.on('auth_failure', () => connectionLost())

//   client.initialize();
// }

/**
 * Generamos un QRCODE para iniciar sesion
 */
 const withOutSession =async(req,res,next) => {
  console.log('No tenemos session guardada');
  console.log(['🙌 El core de whatsapp se esta actualizando','🙌 Ten paciencia se esta generando el QR CODE','________________________',].join('\n'));
   
  client = new Client(createClient());

  client.on('qr', qr => generateImage(qr, () => {
      //console.log("el qr",qr )
        //qrcode.generate(qr, { small: true });
        res.status(200).json(qr)
      
  })) 
  client.on('ready', (a) => {
      connectionReady()
     // listenMessage()
       
  });


 client.on('message', async msg => {
    const { from, body, hasMedia } = msg; 
    if (from === 'status@broadcast' ) {
      return
    }
     let objectMessage ={from:from,body:body,hasMedia:hasMedia};
    message = body.toLowerCase();
    messageWhatssap = [];
    
   let manana= moment().add(0,'days');
    let search = await dbSequelize.message.findOne({ where: { clientNumber: objectMessage.from } });
    let resta =manana.diff(search?search.createdAt:0);
    if (search && objectMessage.body!="" && resta>=180000000) {
      let Users = await dbSequelize.user.findAll({ where: { Role_idRole: 2 }, order: [['count', 'ASC']] });
      let userAsign = await dbSequelize.user.update({ count: Users[0].count + 1 }, { where: { idUser: Users[0].idUser, } });
      let dataSend = { body: objectMessage.hasMedia?"El Cliente a enviado contenido multimedia":objectMessage.body, clientNumber: objectMessage.from, idUser: Users[0].idUser, status: 0 }
      await dbSequelize.message.create(dataSend);
    }
    else { 
    // if(!search){ 
      if(objectMessage.body!="" || objectMessage.hasMedia){
        var hoy = new Date();
        dia = hoy.getDate();
        mes = (hoy.getMonth() + 1);
        anio = hoy.getFullYear();
        let fecha_actual = String(anio + "-" + ((mes > 9 ? '' : '0') + mes) + "-" + ((dia > 9 ? '' : '0') + dia));
        let Users = await dbSequelize.user.findAll({ where: { Role_idRole: 2 }, order: [['count', 'ASC']] });
         
          let messageSearch = await dbSequelize.message.findOne({ where: { clientNumber:objectMessage.from } })
               
          if (!messageSearch) {
           
              let userAsign = await dbSequelize.user.update({ count: Users[0].count + 1 }, { where: { idUser: Users[0].idUser, } });
              let dataSend = { body: objectMessage.hasMedia?"El Cliente a enviado contenido multimedia":objectMessage.body, clientNumber: objectMessage.from, idUser: Users[0].idUser, status: 0 }
              await dbSequelize.message.create(dataSend)
            
            // console.log("salio una vez")
          } 
      
        } 
    }
   objectMessage=[];
    const allChats = await client.getChats();
    const lastFiftyChats = allChats.splice(0,10);
    
    lastFiftyChats.forEach(async(element)=>{
       // console.log(element.isGroup,typeof(element.isGroup));
      if(!element.isGroup){
         //let Users = await dbSequelize.user.findAll({ where: { Role_idRole: 2 }, order: [['count', 'ASC']] });
         const status=await dbSequelize.message.findOne({ where: { clientNumber: `${element.id.user}@c.us` } });
         if(!status){
              let Users = await dbSequelize.user.findAll({ where: { Role_idRole: 2 }, order: [['count', 'ASC']] });
              let userAsign = await dbSequelize.user.update({ count: Users[0].count + 1 }, { where: { idUser: Users[0].idUser, } });
              let dataSend = { body: "Vi esto en Facebook....", clientNumber: `${element.id.user}@c.us`, idUser: Users[0].idUser, status: 0 }
              await dbSequelize.message.create(dataSend)
         }
        
      }
       
    })

  
  });
  


  if(codQR){res.status(200).json(codQR)}
  client.on('auth_failure', (e) => {
      // console.log(e)
      // connectionLost()
  });

  client.on('authenticated', (session) => {
      sessionData = session;
      if (sessionData) {
          fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
              if (err) {
                  console.log(`Ocurrio un error con el archivo: `, err);
              }
          });
      }
  }); 
  client.initialize(); 
  
};
const createUser = async (req, res, next) => {
  //Validate input
  const errors = validationResult(req); 
  if (!errors.isEmpty()) {
    res.status(422).json({ message: errors.errors[0].msg });
    return;
  }
  
  try {
    const result = await general_services.createUser(req);
    if (result.status === 200) {
      res.status(result.status).json(result.message);
    } else {
      res.status(result.status).json(result.message);
    }
    next();
  } catch (e) {
    console.log('Error', e);
    res.status(500).json({
      message: 'Por favor, valida los datos ingresados e intenta nuevamente.',
    });
  }
};
const AllUser=async(req,res,next)=>{
  try {  
    let dataSend=[]
    const result = await general_services.AllUser();
    if (result.status === 200) {
      result.data.forEach(element => {
        dataSend.push({idUser:element.idUser,email:element.email,name:element.name,phoneNumber:element.phoneNumber,role:element.Rol.roleName,count:element.count});
      });
      res.status(result.status).json(dataSend);
    } else {
      res.status(result.status).json(result.message);
    }
    next();
  } catch (e) {
    res.status(500).json('No es posible obtener la información en este momento.');
  }

};
const makeLogin = async (req, res, next) => {

  //Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ message: errors.errors[0].msg });
    return;
  }
  const { email, password } = req.body;
  //console.log(email,password)
  var ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
  if (email !== "" && password !== "") {
    try {
      const result = await general_services.login(email, password);
      if (result.status === 200) {
          //console.log(result)
          res.status(result.status).json(result.data);
      } else { //console.log(result)
        res.status(result.status).json({ message: result.message });
      } next();
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "No es posible realizar el login en este momento." });
    };
  } else {
    res.status(400).json({ message: "Ingrese correctamente los datos, por favor." });
  }
};
const AllComment=async(req,res,next)=>{
  try {   
    const result = await general_services.AllComment();
    if (result.status === 200) {
       res.status(result.status).json(result.data);
    } else {
      res.status(result.status).json(result.message);
    }
    next();
  } catch (e) {
    res.status(500).json('No es posible obtener la información en este momento.');
  }
};
const EdithMessage=async(req,res,next)=>{
  try {
    const result = await general_services.EdithMessage(req);
    if (result.status === 200) {
      res.status(result.status).json(result.message);
    } else {
      res.status(result.status).json(result.message);
    }
    next();
  } catch (e) {
    console.log('Error', e);
    res.status(500).json({
      message: 'Por favor, valida los datos ingresados e intenta nuevamente.',
    });
  }
};
const EdithMessageStatus=async(req,res,next)=>{
  try {
    const result = await general_services.EdithMessageStatus(req);
    if (result.status === 200) {
      res.status(result.status).json(result.message);
    } else {
      res.status(result.status).json(result.message);
    }
    next();
  } catch (e) {
    console.log('Error', e);
    res.status(500).json({
      message: 'Por favor, valida los datos ingresados e intenta nuevamente.',
    });
  }
};
const AllMessage=async(req,res,next)=>{
  try {  
    let dataSend=[]
    const result = await general_services.AllMessage();
    if (result.status === 200) {
      // console.log(result.data);
        result.data.forEach(element => { 
         // console.log(element)
         dataSend.push({idMessage:element.idMessage,body:element.body,clientNumber:element.clientNumber,status:element.status ,createdAt:element.createdAt,asesora:element.User.name,comment:element.comment?element.comment.name:"",colour:element.comment?element.comment.colour:"",phoneAsesor:element.User.phoneNumber});
        });
        //console.log(dataSend)
      res.status(result.status).json(dataSend);
    } else {
      res.status(result.status).json(result.message);
    }
    next(); 
  } catch (e) {
    res.status(500).json('No es posible obtener la información en este momento.');
  }

};
const AllMessageUser=async(req,res,next)=>{
  try {  
    let dataSend=[]
    const result = await general_services.AllMessageUser(req);
    if (result.status === 200) {
      //console.log(result.data);
        result.data.forEach(element => {
         dataSend.push({idMessage:element.idMessage,body:element.body,clientNumber:element.clientNumber,status:element.status ,createdAt:element.createdAt,asesora:element.User.name,comment:element.comment,comment:element.comment?element.comment.name:"",colour:element.comment?element.comment.colour:"",phoneAsesor:element.User.phoneNumber});
        });
      res.status(result.status).json(dataSend);
    } else {
      res.status(result.status).json(result.message);
    }
    next(); 
  } catch (e) {
    res.status(500).json('No es posible obtener la información en este momento.');
  }

};
const userInformation=async(req,res,next)=>{
  try {
    const result = await general_services.userInformation(req);
    if (result.status === 200) {
      res.status(result.status).json(result.data);
    } else {
      res.status(result.status).json(result.message);
    }
    next();
  } catch (e) {
    res.status(500).json('No es posible obtener la información en este momento.');
  }
};
const EdithComment=async(req,res,next)=>{
  try {
    const result = await general_services.EdithComment(req);
    if (result.status === 200) {
      res.status(result.status).json(result.message);
    } else {
      res.status(result.status).json(result.message);
    }
    next();
  } catch (e) {
    console.log('Error', e);
    res.status(500).json({
      message: 'Por favor, valida los datos ingresados e intenta nuevamente.',
    });
  }
};
const EliminarComment=async(req,res,next)=>{
  try {
    const result = await general_services.EliminarComment(req);
    if (result.status === 200) {
      res.status(result.status).json(result.message);
    } else {
      res.status(result.status).json(result.message);
    }
    next();
  } catch (e) {
    console.log('Error', e);
    res.status(500).json({
      message: 'Por favor, valida los datos ingresados e intenta nuevamente.',
    });
  }
};
const Downoload=async(req,res,next)=>{
  try {
  const {id}=req.headers;
  let array =id.split(','); 
  let dataSend=[];
  const Message= await dbSequelize.message.findAll({where:{idMessage:array}, include: [ { model: dbSequelize.user,required:true },{ model: dbSequelize.comment } ]
  }); 
  Message.forEach(element => {
    dataSend.push({idMessage:element.idMessage,Mensaje:element.body==""?"Contenido Multimedia":element.body,NumeroCliente:element.clientNumber,status:element.status=="1"?"leido":"No Leido" ,Fecha_Enviado:element.createdAt,asesora:element.User.name,Comentario:element.comment?element.comment.name:"No Registrado",Numero_Asesor:element.User.phoneNumber});
  });
  if(dataSend.length>0){ 
    let workbook = Excel.utils.book_new();
     
    workbook.Props = {
      Title: "Reporte de Mensajes",
      Author: "Accotienda",
      createdAt: new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" }),
    };  
    workbook.SheetNames.push("Reporte");

    // const processData = processReportByRRHHData(result.data);
    let final_woorkbook = Excel.utils.json_to_sheet(dataSend);

    workbook.Sheets["Reporte"] = final_woorkbook;

    let date = new Date();

    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();

    let url = "../../files/ReporteMensajes" + "_" + day + "-" + month + "-" + year + ".xlsx";

    let workbookAbout = Excel.writeFile(workbook, url , { bookType: 'xlsx', type: 'binary' });
    
   
    if (url) {
       res.status(200).json(fs.readFileSync(url, 'base64'));
    }else{
      res.status(400).json("Ha ocurrido un error");
    }
  }
  
  } catch (e) {
    console.log('Error', e);
    res.status(500).json({
      message: 'Por favor, valida los datos ingresados e intenta nuevamente.',
    });
  }

};
module.exports = { Downoload,withOutSession,EliminarComment,EdithComment,userInformation,EdithMessageStatus,AllMessageUser, AllMessage,createComment, AllComment,AllUser,createUser,makeLogin,EdithMessage}

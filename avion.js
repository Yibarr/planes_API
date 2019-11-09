const mongoose = require('mongoose');

const URL_MONGO = "mongodb+srv://cyn2903:1234567.@cluster0-iqsf0.mongodb.net/test?retryWrites=true&w=majority"

mongoose.connect(URL_MONGO,{ useNewUrlParser:true },(err) => {
    if(!err){ 
        console.log('Conexión exitosa en MongoDB')
    }else{
        console.log(err)
    };
    
});

const Schema = mongoose.Schema;


const avionSchema = new Schema({
    SN:String,
    model:String,
    capacity:Number,
    classification:{
        type:String,
        enum:['S','N','J']
    },
    vuelos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Vuelo'
        }
    ]
},{ timestamps:true });


const vuelosSchema = new Schema({
    origin:{
        type:String,
        enum:['MEX','CHI',"CMB","ESP"]
    },
    destiny:{
        type:String,
        enum:['MEX','CHI',"CMB","ESP"]
    },
    flightTime:String,
    petFriendly:Boolean
},{ timestamps: true});

const Avion = mongoose.model( 'Avion', avionSchema );

const Vuelo = mongoose.model( 'Vuelo', vuelosSchema);

module.exports = {
    Avion,
    Vuelo
}
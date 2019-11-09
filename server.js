//REST API
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Avion, Vuelo } = require('./avion');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const PORT = process.env.PORT || 4000;

app.get('/',(request,response)=>{
    response.send({message:'Server on'})
});

app.post('/create/avion',(request, response) => {
    const { 
        SN,
        model,
        capacity,
        classification,
        vuelos 
    } = request.body;

    const newAvion = Avion({
        SN,
        model,
        capacity,
        classification,
        vuelos 
    })

    newAvion.save((err, avion)=>{
        if(!err){
            response.status(201).send({message:'Se ha creado el avión exitosamente.', avion:avion})
        }else{
            response.status(409).send({message:'Error al crear avión.',error:err})
        }
    });
});

app.get('/avion/:id', (req,res) => {
    const { id } = req.params;

    Avion.findById(id)
    .populate('vuelos')
    .exec()
    .then(avion => res.status(200).send(avion))
    .catch(error => res.status(409).send(error))
})

app.get('/all/aviones',(req,res)=>{
    Avion.find()
    .populate('vuelos')
    .exec()
    .then(aviones => res.status(200).send(aviones))
    .catch(error => res.status(409).send(error))
});

app.patch('/asignar/vuelo/:vueloId/avion/:avionId',(req,res)=>{
    const { vueloId, avionId } = req.params;

    Avion.findByIdAndUpdate(avionId,{$push:{vuelos:vueloId}},{new:true})
    .exec()
    .then(avion => res.status(200).send({message:'Se ha asignado un nuevo vuelo',avion:avion}))
    .catch(error => res.status(409).send(error))
});


app.delete('/delete/avion/:id',(req,res)=>{
    const { id } = req.params

    Avion.findByIdAndDelete(id)
    .exec()
    .then(avion => res.status(200).send({message:'Se ha borrado el avión exitosamente',avion:avion}))
    .catch(error => res.status(409).send(error))
});


//------------------------------------------------------
app.post('/create/vuelo',(req,res)=>{
    const {
        origin,
        destiny,
        flightTime,
        petFriendly
    } = req.body;

    const newVuelo = Vuelo({
        origin,
        destiny,
        flightTime,
        petFriendly
    })

    newVuelo.save((err,vuelo)=>{
        !err
        ? res.status(201).send({message:'Vuelo creado con éxito', vuelo:vuelo})
        : res.status(409).send({message:'Hubo un error al crear el vuelo',error:err})
    });
});

app.get('/all/vuelos',(req,res)=>{
    Vuelo.find()
    .exec()
    .then(vuelos => res.status(200).send(vuelos))
    .catch(error => res.status(409).send(error))
});



app.listen(PORT,() => {
    console.log(`Server has been initialized on port:${PORT}`)
});



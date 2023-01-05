const fs= require('fs');

const axios = require('axios');

class Busquedas {

    historial = [];
    dbPath = './db/database.json';

    constructor(){

        this.leerDB();
    }

    get paramsMapbox(){
        return {

                'access_token': process.env.MAPBOX_KEY,
                'limit':5,
                'language': 'es'

        }
    }

    get paramsWeather(){
        return{
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang:'es'
        }
    }

    async ciudad( lugar =''){

        try {
            

        //peticion http

        const instance = axios.create({
            baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
            params: this.paramsMapbox
                
            
        });

        const resp = await instance.get();
        
        return resp.data.features.map( lugar => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1],

        }));

        //const resp = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/yer.json?access_token=pk.eyJ1IjoibXJraWtlMyIsImEiOiJja3U3amQzbHIwaTB0MndtbnAxbXZqN2x4In0.8qNapQ4J2r3NEvhJ6RFPnA&limit=5&language=es');
        console.log(resp.data);

        return [];// retornar los lugares 

        } catch (error) {
            return[];
        }
        
    }

    async climaLugar( lat, lon ){
        try {

            //instance axios.create()

            const instance = axios.create({
            baseURL:`https://api.openweathermap.org/data/2.5/weather`,
            params:  { ...this.paramsWeather, lat, lon }

            });

            const resp = await instance.get();

            const {weather, main} = resp.data;

            return {
                desc: weather[0].description,
                temperatura: main.temp,
                max: main.temp_max,
                min: main.temp_min
            }
        
         
         return
            
        } catch (error) {
            return
        }
    }

    agregarHistorial(lugar = '' ){
        if(this.historial.includes(lugar.toLocaleLowerCase() )){
            return;
        };
        this.historial.unshift( lugar.toLocaleLowerCase() );

        //grabar en DB
        this.guardarDB();


    }

    guardarDB(){

        const payload ={
         historial: this.historial
        };

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));

    }

    leerDB(){
        if ( !fs.existsSync(this.dbPath)) return;

        const info = fs.readFileSync( this.dbPath, {encoding:'utf-8'});
        const data = JSON.parse( info );

        this.historial = data.historial;




    }

}


module.exports = Busquedas;
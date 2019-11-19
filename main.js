// This is the main Node.js source code file of your actor.
// It is referenced from the "scripts" section of the package.json file,
// so that it can be started by running "npm start".

// Include Apify SDK. For more information, see https://sdk.apify.com/
const Apify = require('apify');
const moment = require('moment');
const timezone = require('moment-timezone');
moment.locale('es');
Apify.main(async () => {


    // Get input of the actor (here only for demonstration purposes).
    // If you'd like to have your input checked and have Apify display
    // a user interface for it, add INPUT_SCHEMA.json file to your actor.
    // For more information, see https://apify.com/docs/actor/input-schema
    // const input = await Apify.getInput();
    // if (!input || !input.url) throw new Error('Input must be a JSON object with the "url" field!');
    const input = await Apify.getValue('INPUT');
    console.log("INPUT:" + JSON.stringify(input));
    const offset = input && input.offset ? input.offset : -5; //diferencia horaria contra el servidor de apify respecto a la hora de cuba
    const tz = input && input.timeZoneName ? input.timeZoneName : "America/Havana";


    const now = moment() .tz(tz);
    console.log(">> NOW: " + now.format());
    const baseUrl = 'http://www.flalottery.com/';

    const requestList = new Apify.RequestList({
        sources: [
            {url: baseUrl + 'pick3'},
            {url: baseUrl + 'pick4'}
        ],
    });
    await requestList.initialize();
    const result = {
        pick3: [],
        pick4: [],
        dateString: "",
        midWin: "",
        midBody: "",
        sigs: [],
        sigsHashTags: [],
        eveWin: "",
        eveBody: "",
        eveBody: "",
    };
    const charada = ["Caballo", "Mariposa, Dinero", "Marinero, Niño Chiquito", "Gato, Diente", "Monja, Mar", "Jicotea",
        "Caracol y Mierda", "Muerto", "Elefante, Lengua", "Pescado Grande", "Gallo", "Ramera", "Pavo Real",
        "Cementerio, Gato Tigre", "Perro, Niña bonita", "Toro", "San Lázaro, Luna", "Pescado chico",
        "Lombriz, Bandera", "Gato fino, Tibor", "Majá, Dinero", "Sapo", "Vapor", "Paloma",
        "Piedra fina, Casa Nueva", "Anguila, Medico Nuevo", "Avispa", "Chivo", "Ratón", "Camarón", "Venado",
        "Cochino", "Tiñosa", "Mono", "Araña", "Cachimba", "Bruja, Gallina Prieta y Hormiga", "Macao y Dinero",
        "Conejo y Culebra", "Cura y Sangre", "Lagartija", "Pato y País Lejano", "Alacrán", "Año del cuero",
        "Tiburón y Presidente", "Guagua y Humo", "Pájaro", "Cucaracha y Abanico", "Borracho", "Policía", "Soldado",
        "Bicicleta", "Luz eléctrica", "Flores", "Cangrejo y Murciélago", "Merengue y Reina", "Cama y Telegrama",
        "Retrato, Cuchillo y Adulterio", "Loco", "Payaso y Huevo", "Caballo grande", "Matrimonio", "Asesino",
        "Muerto grande", "Comida", "Tarro, Pareja de yeguas", "Puñalada", "Cementerio", "Pozo", "Coco", "Río",
        "Buey viejo, Jicota y Collar", "Maleta", "Papalote y Militar", "Corbata y Guitarra", "Bailarina", "Muletas",
        "Sarcófago", "Tren de carga y Lagarto", "Médico viejo y Desesperado", "Teatro", "Madre", "Tragedia",
        "Sangre y Banquero", "Espejo y Reloj", "Tijeras y Manguera", "Plátano", "Miguel Mariano, Espejuelos y Gusano",
        "Mucha agua y Casa Vieja", "Viejo", "Alpargata y Comunista", "Puerco grande, Avión y Globo", "Sortija",
        "Machete Y Habana", "Guerra", "Zapato y Puta Vieja", "Mosquito y Grillo", "Piano", "Serrucho, Gallo, Carbonero",
        "Inodoro y Automóvil"];
    const sigs = [];

    const crawler = new Apify.CheerioCrawler({
        requestList,
        handlePageFunction: async ({request, response, html, $}) => {
            const game = request.url.substr(baseUrl.length, 5);
            if ('pick3' == game || 'pick4' == game) {
                console.log(`>> Processing ${request.url}...`);
                const title = $('title').text();
                console.log(">> Page: " + title);

                $('.gamePageNumbers').each(function () {
                    var scope = $(this),
                        rs = {
                            digits: [],
                            date: moment(new Date($($('.regWeight', scope).siblings('p')[1]).text())).tz(tz)
                        };
                    $('.gamePageBalls .balls', scope).each(function () {
                        rs.digits.push($(this).text());
                    });
                    result[game].push(rs);

                });
            }


        }
    });

    // Run the crawler and wait for it to finish.
    await crawler.run();

    console.log(">> PICK3: " + JSON.stringify(result.pick3));
    console.log(">> PICK4: " + JSON.stringify(result.pick4));


    console.log(">> PIC3 length: " + result.pick3.length);
    console.log(">> PIC3 dateCOMPARE: " + result.pick3[0].date.format("YMD"));
    console.log(">> NOW dateCOMPRARE: " + now.format("YMD"));



    if (result.pick3.length > 1 && result.pick3[0].date.format("YMD") == now.format("YMD")) {
        console.log("*************AKI*************");
        const midHtml = [];
        var m1 = '' + result.pick3[0].digits[0] + result.pick3[0].digits[1] + result.pick3[0].digits[2],
            m2 = '' + result.pick4[0].digits[0] + result.pick4[0].digits[1],
            m3 = '' + result.pick4[0].digits[2] + result.pick4[0].digits[3];

        result.dateString = now.format("dddd LL");

        result.midWin = m1 + '-' + m2 + '-' + m3;
        midHtml.push('🌞 GANADOR DEL MEDIO DIA️: ' + m1 + '-' + m2 + '-' + m3);

        if (parseInt(m1) < 100)
            sigs.push(parseInt(m1));
        else {
            if (parseInt(m1[0]) > 0)
                sigs.push(parseInt(m1[0]));
            if (sigs.indexOf(parseInt(m1[1] + '' + m1[2])) == -1)
                sigs.push(parseInt(m1[1] + '' + m1[2]));
        }
        if (parseInt(m2) > 0 && sigs.indexOf(parseInt(m2)) == -1)
            sigs.push(parseInt(m2));
        if (parseInt(m3) > 0 && sigs.indexOf(parseInt(m3)) == -1)
            sigs.push(parseInt(m3));

        result.midBody = midHtml.length > 0 ? midHtml.join("<br>") : ''
    }

    if (result.pick4.length > 1 && result.pick3[1].date.format("YMD") == now.format("YMD")) {
        const evHtml = [];
        var e1 = '' + result.pick3[1].digits[0] + result.pick3[1].digits[1] + result.pick3[1].digits[2],
            e2 = '' + result.pick4[1].digits[0] + result.pick4[1].digits[1],
            e3 = '' + result.pick4[1].digits[2] + result.pick4[1].digits[3];
        evHtml.push('🌜 GANADOR DE LA NOCHE:  ' + e1 + '-' + e2 + '-' + e3);
        result.eveWin = e1 + '-' + e2 + '-' + e3;

        if (parseInt(e1) < 100) {
            if (sigs.indexOf(parseInt(e1)) == -1)
                sigs.push(parseInt(e1));
        } else {
            if (parseInt(e1) > 0 && sigs.indexOf(parseInt(e1[0])) == -1)
                sigs.push(parseInt(e1[0]));
            if (sigs.indexOf(parseInt(e1[1] + '' + e1[2])) == -1)
                sigs.push(parseInt(e1[1] + '' + e1[2]));
        }
        if (parseInt(e2) > 0 && sigs.indexOf(parseInt(e2)) == -1)
            sigs.push(parseInt(e2));

        if (parseInt(e3) > 0 && sigs.indexOf(parseInt(e3)) == -1)
            sigs.push(parseInt(e3));


        result.eveBody = eveBody.length > 0 ? eveBody.join("<br>") : ''

    }
    sigs.sort().forEach(function (i) {
        if (i > 0) {
            result.sigs.push(' - ' + i + ' : ' + charada[i - 1]);
            result.sigsHashTags.push("#CHARADA-" + i + "-" + charada[i - 1].replace(/,/gi, "").replace(/\s/gi, "-").toUpperCase())
        }
    });

    await Apify.setValue('OUTPUT', {
        result,
    });

    if ("" != result.midBody)
        console.log("****** " + result.midBody + " ******");
    if ("" != result.eveBody)
        console.log("****** " + result.eveBody + " ******");
    console.log('Done.');
});

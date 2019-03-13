var ConvergeLib = require('./converge');
var convergeLib = new ConvergeLib('007109', 'webpage', '0EMMGX', true);
var request = require('request');
var xml2js = require('xml2js');


// convergeLib.collectPayment2Debit('','','','4032769999999992', '12', '20', '123','206' ,'','')
//     .then(function(response){
//         console.log(response);
//     })
//     .catch(function(err){
//         console.error('error',err);

// });

// convergeLib.collectPayment2('','','','4124939999999990', '12', '20', '123','206' ,'','')
//     .then(function(response){
//         console.log(response);
//     })
//     .catch(function(err){
//         console.error('error',err);

// });

// convergeLib.collectPayment2('','','','4124939999999990', '12', '20', '123','217' ,'','')
//     .then(function(response){
//         console.log(response);
//     })
//     .catch(function(err){
//         console.error('error',err);

//     });

    convergeLib.foreignCurrPayment('8ed42a515e7c4121a6eb42ccce05e9b101641260','N','216')
        .then(function(response){
            console.log(response);
        })
        .catch(function(err){
            console.error('error',err);
    
        });



// convergeLib.refundPayment('040219A42-2CD1186A-9BE5-4327-B01A-D8337CCDF19F',50)
//     .then(function(response){
//         console.log(response);
//     })
//     .catch(function(err){
//         console.error('error',err);
//
//     });
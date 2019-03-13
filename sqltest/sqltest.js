const encryptDecrypt = require ('./encrypt-decrypt');
const Sequelize = require ('sequelize');
//Azure SQL Credetials and Connection String Details
const sequelize = new Sequelize ('{database}', '{user}', '{password}', {
      host: {hostname},
      dialect: 'mssql',
      operatorsAliases: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      dialectOptions: {
        encrypt: true,
      },
});

sequelize
  .authenticate ()
  .then (() => {
    console.log ('Connection has been established successfully.');
  })
  .catch (err => {
    console.error ('Unable to connect to the database:', err);
});

const User = sequelize.define ('user', {
  firstName: {
    type: Sequelize.STRING,
  },
  lastName: {
    type: Sequelize.STRING,
  },
});

//To be run while inserting data
// force: true will drop the table if it already exists
 User.sync({force: false}).then(() => {
  let encryptedFirstname = encryptDecrypt.encryptData({firstName});
  let encryptedLastname = encryptDecrypt.encryptData({lastName});
  console.log ('Encryption Start');
  return User.create({
    firstName: encryptedFirstname,
    lastName: encryptedLastname
  });
});


User.findAll ()
  .then (users => {
    users.forEach (function (names) {
      let firstname = names.dataValues.firstName;
      let lastname = names.dataValues.lastName;
      let decryptedFirstname = encryptDecrypt.decryptData (firstname);
      let decryptedLastname = encryptDecrypt.decryptData (lastname);
     
      names.dataValues.firstName = names.dataValues.firstName.replace (
        names.dataValues.firstName,
        decryptedFirstname
      );
      names.dataValues.lastName = names.dataValues.lastName.replace (
        names.dataValues.lastName,
        decryptedLastname
      );
    });
    console.log ('Decrypted User Details:', users);
  })
  .catch (err => {
    console.error ('Unable to fetch data', err);
});

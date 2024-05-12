const mongoose = require('mongoose');
let user= 'juuligarcia2208';
let password= 'julito123';
let databaseName = 'production';
if(process.env.NODE_ENV === 'test'){
    databaseName = 'testdb'
}
mongoose.connect(`mongodb+srv://juuligarcia2208:${password}@cluster0.ipyqfwb.mongodb.net/`,
    {dbName: databaseName});
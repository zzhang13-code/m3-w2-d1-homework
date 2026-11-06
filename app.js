var stats =[
    {
        'city': 'San Juan', 
        'zip': '00926', 
        'state': 'PR', 
        'income': '34781',
        'age': '44'
    },
    {
        'city': 'Corona', 
        'zip': '11368', 
        'state': 'NY', 
        'income': '50797',
        'age': '32'
    },
    {
        'city': 'Chicago', 
        'zip': '60629', 
        'state': 'IL', 
        'income': '42019',
        'age': '31'
    },
    {
        'city': 'El Paso', 
        'zip': '79936', 
        'state': 'TX', 
        'income': '54692',
        'age': '31'
    },
    {
        'city': 'Los Angeles', 
        'zip': '90011', 
        'state': 'CA', 
        'income': '36954',
        'age': '28'
    },
    {
        'city': 'Norwalk', 
        'zip': '90650', 
        'state': 'CA', 
        'income': '66453',
        'age': '35'
    }
];

const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://127.0.0.1:27017');

async function main() {
    await client.connect();
    const db = client.db('statsdb');
    const census = db.collection('uscensus');
    const task = Number(process.argv[2]);

    if (task === 1) {
        console.log('Database statsdb selected!');
    } else if (task === 2) {
        await db.createCollection('uscensus');
        console.log('Collection uscensus created!');
    } else if (task === 3) {
        const result = await census.insertMany(stats);
        console.log(result.insertedCount + ' records inserted');
    } else if (task === 4) {
        const moreStats = [
            { city: 'Pacoima', zip: '91331', state: 'CA', income: '60360', age: '33' },
            { city: 'Ketchikan', zip: '99950', state: 'AK', income: '00000', age: '00' }
        ];
        const result = await census.insertMany(moreStats);
        console.log(result.insertedCount + ' more records inserted');
    } else if (task === 5) {
        const corona = await census.findOne({ city: 'Corona', state: 'NY' });
        console.log('Corona, NY zip code: ' + corona.zip);
    } else if (task === 6) {
        const california = await census.find({ state: 'CA' }).toArray();
        california.forEach(function (record) {
            console.log(record.city + ' income: ' + record.income);
        });
    } else if (task === 7) {
        const result = await census.updateOne(
            { state: 'AK' },
            { $set: { income: '38910', age: '46' } }
        );
        console.log(result.modifiedCount + ' Alaska record updated');
    } else if (task === 8) {
        const sorted = await census.find().sort({ state: 1 }).toArray();
        console.log('Records sorted by state:');
        sorted.forEach(function (record) {
            console.log(record.state + ' - ' + record.city + ' - ' + record.zip +
                ' - income ' + record.income + ' - age ' + record.age);
        });
    } else {
        console.log('Run node app.js with a task number from 1 to 8.');
    }
}

main().catch(function (error) {
    console.error(error);
    process.exitCode = 1;
}).finally(function () {
    client.close();
});

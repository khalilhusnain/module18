const mongoose = require('mongoose');
const User = require('../models/User');
const Thought = require('../models/Thoughts');

const mongodb = 'mongodb://localhost:27017/socialNetworkDB';

mongoose.connect(mongodb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const seedUsers = [
    {
        username: 'CaptainAmerica',
        email: 'capt@merica.com',
        thoughts: [],
        friends: []
    },
    {
        username: 'Falcon',
        email: 'falcon@fly.com',
        thoughts: [],
        friends: []
    },
    {
        username: 'WinterSoldier',
        email: 'winter@soldier.com',
        thoughts: [],
        friends: []
    }
];

const seedThoughts = [
    {
        thoughtText: 'Avengers Assemble! We have a world to save!',
        username: 'CaptainAmerica',
        reactions: []
    },
    {
        thoughtText: 'I can fly! I can fly! I can fly!',
        username: 'Falcon',
        reactions: []
    },
    {
        thoughtText: 'My arm is made of vibranium. What is your arm made of?',
        username: 'WinterSoldier',
        reactions: []
    }
];

const seedAll = async () => {
    await User.deleteMany();
    await Thought.deleteMany();

    const users = await User.insertMany(seedUsers);

    seedThoughts.forEach(thought => {
        thought.userId = users.find(user => user.username === thought.username)._id;
    });

    await Thought.insertMany(seedThoughts);

    console.log('Users and Thoughts seeded!');
    process.exit(0);
};

seedAll();
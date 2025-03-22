const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const donorRoutes = require('./routes/donorRoutes');

//Middleware
app.use(cors());
app.use(bodyParser.json()); 

//User Routes
app.use('/api', userRoutes);
app.use('/api', eventRoutes);
app.use('/api', donorRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(require('./routes/routes'));

app.listen(app.get('port'), () => {
	console.log('Server on port', app.get('port'));
})


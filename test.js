const axios = require('axios');
axios.get('http://localhost:8000/v1/lps?cursor=0&limit=3')
  .then(res => console.log(JSON.stringify(res.data, null, 2)))
  .catch(err => console.error(err.message));

const axios = require('axios');

const config = {
    headers: {
        'Content-Type': "application/json",
    }
};

const formData = {
input_username,
input_email,
input_password
};

axios({
    method: 'post',
    url: '/user/signup',
    data: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }
  });

  auth: {
    username: 'janedoe',
    password: 's00pers3cret'
  },

const response = await axios.post('/user/signup', formData, config);
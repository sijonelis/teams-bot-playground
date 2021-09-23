const baseUrl = 'http://localhost:5001';
const axios = require('axios'); 

export class AxiosHandler {
    public async executeQuery(queryText: string) {
        return axios.get(`${baseUrl}/query?query=${queryText}`)
        .then(function (response) {
          var queryResponse = response.data;
          console.log(response);
          return queryResponse;
        })
        .catch(function (error) { 
          console.log(error);
          return error.message;
        })
    }

    public async executeQueryByInvert(queryText: string) {
      return axios.get(`${baseUrl}/queryByInvert?queryText=${queryText}`)
      .then(function (response) {
        var queryResponse = response.data;
        console.log(response);
        return queryResponse;
      })
      .catch(function (error) { 
        console.log(error);
        return error.message;
      })
  }

    private async executeFeed(feedText: string) {
        return axios.post(`${baseUrl}/incrementfeed`, {
          type: 1,
          content: feedText
        })
        .then(function (response) {
          console.log(response);
          return response.data;
        })
        .catch(function (error) {
          console.log(error);
          return error.message;
         
        })
    }
}
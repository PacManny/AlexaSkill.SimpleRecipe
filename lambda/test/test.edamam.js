var assert = require('assert');

describe('Edamam' , function()
{
    describe('GetEndPoint', function()
    {
        it('Should generate the correct url.', function() 
        {
            var edamam = require('../edamam')
            var endpoint =  edamam.GetEndPoint('Pizza','9435870349583098', '498357493876340' )
            var expected = 'https://api.edamam.com/search?q=Pizza&app_id=9435870349583098&app_key=498357493876340&format=json';
            assert.equal(endpoint, expected);
        })
    });
});
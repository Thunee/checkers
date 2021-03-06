var Client = require('../client').Client, 
	qs = require('querystring');

this['htmlfile'] = Client.extend({
	
	_onConnect: function(req, res){
		var self = this, body = '';
		switch (req.method){
			case 'GET':
				this.__super__(req, res);
				this.request.connection.addListener('end', function(){ self._onClose(); });
				this.response.useChunkedEncodingByDefault = false;
				this.response.shouldKeepAlive = true;
				this.response.writeHead(200, { 'Content-type': 'text/html' });
				this.response.flush();
				this._payload();
				break;
				
			case 'POST':
				req.addListener('data', function(message){
					body += message;
				});
				req.addListener('end', function(){
					try {
						var msg = qs.parse(body);
						self._onMessage(msg.data);
					} catch(e){}			
					res.writeHead(200);
					res.write('ok');
					res.end();
				});
				break;
		}
	},
	
	_write: function(message){
		// not sure if this is enough escaping. looks lousy
		this.response.write("<script>parent.callback('"+ message.replace(/'/, "\'") +"')</script>");
	}
	
});
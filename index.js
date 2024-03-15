const WebSocket = require("ws")

const env = require("./env.json")
const { RouteHandler, static } = require("./httpsimulator")




class AresHost{

	

	constructor(url, env){
		this.url = url;

		this.connection = new WebSocket(url || "wss://localhost-njg5.onrender.com/")
		
		this.rest = new RouteHandler()


		this.connection.on("open", () => {

			this.connection.send(JSON.stringify({

				event:"host.login",
				data:env

			}))
		})

		setInterval(() => {
			this.connection.send(JSON.stringify({
				event:"keepalive"
			}))
		}, 5000)


		this.connection.on("message", (message) => {

			const {event, data} = JSON.parse(message)

			switch(event){

				case "client.rest.request":

					this.connection.send(JSON.stringify({
						event:"host.rest.response",
						data:{
							requestid:data.requestid,

							response:this.rest.calculate(data)
						}
					}))

			}
		})
	}

		
}


module.exports = {
	AresHost,
	static
}

const {writeFileSync, readdirSync, readFileSync, readFile} = require("fs")
const path = require("path");
const { mimeMap, textbased } = require("./extensions");

	

function customTypeof(value) {
    // Check for null first since typeof null is an object
    if (value === null) {
        return 'null';
    }

    // Check for array
    if (Array.isArray(value)) {
        return 'array';
    }
	


    // Check for buffer
    if (Buffer.isBuffer(value)) {
        return 'buffer';
    }

    if (value instanceof Uint8Array){
	    return "Uint8Array"
    }

    // Check for other specific objects (you can add more checks as needed)
    if (value instanceof Date) {
        return 'date';
    }

    // Return the result of the standard typeof operator for other types
    return typeof value;
}

function customContentType(value) {
    // Check for null first since typeof null is an object
    if (value === null) {
        return 'application/null'; // Note: 'application/null' is not a standard MIME type
    }

    // Check for array or object
    if (Array.isArray(value)) {
        return 'application/json'; // Arrays are considered part of JSON
    } else if (typeof value === 'object') {
        // Check for buffer
        if (Buffer.isBuffer(value) || value instanceof Uint8Array) {
            return 'application/octet-stream';
        }
        // Regular object
        return 'application/json';
    }

    // Check for other types
    switch (typeof value) {
        case 'string':
            return 'text/html';
        case 'number':
            return 'text/plain'; // MIME doesn't have a specific type for numbers
        case 'boolean':
            return 'text/plain'; // MIME doesn't have a specific type for booleans
        case 'function':
            return 'application/javascript'; // This is debatable, as functions aren't typically sent over HTTP
        case 'undefined':
            return 'application/undefined'; // Note: 'application/undefined' is not a standard MIME type
        default:
            return 'application/octet-stream'; // Fallback for unknown types
    }
}

class Response{
	
	constructor(){
		this.status = 200
		this.headers = {}
		this.isBuf = false;
		return this
	}
	
	setStatus(stat){
		this.status = stat
		return this
	}

	setHeader(headername, headervalue){
		if(typeof headername === "string"){
			this.headers = {
				...this.headers,
				[headername]:headervalue
			}
		}else{
			this.headers = {
				...this.headers, 
				...headername
			}
		}

		return this
	}

	setCookie(cookiename, cookievalue){
		
		if(typeof cookiename == "string"){
			

			this.headers["Set-Cookie"] = (this.headers["Set-Cookie"] || "") + cookiename + "=" + cookievalue + ";"

		}else {
			this.headers["Set-Cookie"] = (this.headers["Set-Cookie"] || "") + Object.keys(cookiename).map(key => `${key}=${cookiename[key]}`).join(";") + ";"
		}

		return this

	}

	send(data){
		
		let type = customTypeof(data)
		if(type === "buffer"){
			this.isBuf = true
			data = new Uint8Array(data)	
		}
		
		let content_type = customContentType(data)
	
		this.headers["Content-Type"] = content_type

		this.body = data;

		return this
	}

	sendFile(_path){

		

		let filebuffer;
		let filetype = mimeMap.get("." + _path.split(".").at(-1));
	


		try{ 
			
			if(textbased.includes(_path.split(".").at(-1))){
				
				let file = readFileSync(path.resolve(_path), "utf-8")	

				this.headers["Content-Type"] = filetype || customContentType(file)
				this.body = file
				
				return
			}

			filebuffer = new Uint8Array(readFileSync(path.resolve(_path)).buffer)
			this.isBuf = true
		}catch{
			
			console.error(`error reading file: ${_path}`)
			this.status = 500
			return this
		}



		let content_type = customContentType(filebuffer);
		this.headers["Content-Type"] = content_type;
			
		this.body = [...filebuffer]


		
		this.headers["Content-Type"] = filetype || content_type



		return this

		
	}
	
	redirect(location){

		this.status = 302;
		this.headers["location"] = location
		this.redirected = true 


		return this
	}
}


class RouteHandler{

	constructor(){
		
		this._routes = {

		}
		
	}
	

	use(route, handler){

		if(typeof route === "function"){

			handler = route; 
			route = "/"
		}
		
		let routeconstructor = route.split("/").filter((s, i) => !(s == "" && i > 0))


		let current = this._routes
		for(let subroute of routeconstructor){
			if(!current[subroute]){
				current[subroute] = {}
			}	
			current = current[subroute]
		}

		if(!current.USE) { 
			current.USE = []
		}
		
		current.USE.push(handler)
	}

	get(route, handler){


		//let routeconstructor = route.match(/(\/)?[^\/]*/g).filter(s => s!== "")

		let routeconstructor = route.split("/").filter((s, i) => !(s == "" && i > 0))


		let current = this._routes
		for(let subroute of routeconstructor){
			if(!current[subroute]){
				current[subroute] = {}
			}	
			current = current[subroute]
		}

		current.GET = handler


	}		

	post(route, handler){



		let routeconstructor = route.split("/").filter((s, i) => !(s == "" && i > 0))


		let current = this._routes
		for(let subroute of routeconstructor){
			if(!current[subroute]){
				current[subroute] = {}
			}	
			current = current[subroute]
		}

		current.POST = handler
		

	}


				

	calculate(requestobject){
			
		const {method, route, request} = requestobject

		request.innerUrl = route


		let response = new Response()


		let routeconstructor = route.split("/").filter((s, i) => !(s == "" && i > 0))


		let current = this._routes

		let uses = []


		for(let subroute of routeconstructor){
			if(current.USE){
				uses = uses.concat(current.USE)
			}

			if(!current[subroute]){


				for(let i = 0; i < uses.length; i++){

				uses[i](request, response)
			
					if(response.body){
						return response
					}
				}	
				

				return {
					status:404
				}
			}
			
				

			current = current[subroute]	

		}	

		if(current.USE){
			uses = uses.concat(current.USE)
		}

		let handler = current[method]



	


			
		for(let i = 0; i < uses.length; i++){

			uses[i](request, response)
			
			if(response.body){
				return response
			}
		}				


		try{ 
			handler(request, response)
		} catch(e){
			return {
				status:404
			}
		}
	


		return response
	}
}





const {static} = require("./utils")


module.exports = {
	static,
	Response,
	RouteHandler	
}

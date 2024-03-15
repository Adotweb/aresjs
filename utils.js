const path = require("path")
const fs = require("fs")

function Try(canerror){


	try{
		return [canerror(), false]
	}catch{
		return [false, true]
	}

}

function static(staticpath){


	return (req, res) => {


		let filepath = path.resolve(staticpath, "." + req.innerUrl)
	
		let [isdir, error1] = Try(() => fs.readdirSync(filepath))
	
		if(isdir && isdir.includes("index.html")){
			res.sendFile(filepath + "/index.html")
		}
			
		let [isfile, error2] = Try(() => fs.readFileSync(filepath))
		

		if(isfile){
			res.sendFile(filepath)
		}
	}

} 



module.exports = {
	static
}


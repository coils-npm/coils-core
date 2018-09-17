const NODE_ENV = process.env.NODE_ENV || 'development'
class Coils {
	constructor (initOptions) {
		Object.defineProperties(this, { 'NODE_ENV': { "get": () => { return NODE_ENV } } })
		const freezeObj = Object.freeze(initOptions || {})
		Object.defineProperties(this, { 'initOptions': { "get": () => { return freezeObj } } })
		Object.defineProperties(this, { 'PORT': { "get": () => { return this['initOptions'].PORT || 3000 } } })
	}
	
	use (module, ...args) {
		if (module.mounted) {
			return module.mounted(this, ...args)
		} else {
			console.error(`module ${module} must define mounted method`)
		}
	}
	
	setGlobalVars () {
		Object.defineProperties(global, { "$application": { "get": () => { return application } } })
		for (let modelName in this['_Models']) {
			Object.defineProperties(global, {
				[modelName]: { "get": () => { return this['_Models'][modelName] } }
			})
		}
	}
	
	startKoa () {
		this._koa.listen(this['PORT'], () => {
			console.log(`app start at: http://localhost:${this['PORT']}`)
		})
	}
}
module.exports = Coils
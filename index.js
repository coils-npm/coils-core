class Coils {
	constructor (options) {
		for (let key in options) {
			const freezeObj = Object.freeze(options[key])
			Object.defineProperties(this, { [key]: { "get": () => { return freezeObj } } })
		}
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
		for (let model of this['_Models']) {
			Object.defineProperties(global, {
				[model.name]: { "get": () => { return model } }
		})
		}
	}
	
	startKoa (port) {
		if (this['NODE_ENV'] === 'production') {
			port = this.EnvConfig && this.EnvConfig.PORT || port || 3000
		} else {
			port = port || this.EnvConfig && this.EnvConfig.PORT || 3000
		}
		this._koa.listen(port, function () {
			console.log(`app start at: http://localhost:${port}`)
		})
	}
}
module.exports = Coils
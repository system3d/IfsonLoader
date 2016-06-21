import 'whatwg-fetch'

export default function W3DLoader() {

	/**
	 * Complete data fetched from a json
	 * @type {object}
	 */
	this.fullData = ''

	/**
	 * Vertices of THREE.Vector3
	 * @type {array}
	 */
	this.vertices = []

	/**
	 * Main Object3D
	 * @type {THREE.Object3D}
	 */
	this.obj = new THREE.Object3D()

	let material = new THREE.MeshBasicMaterial({
		color: 0xaa0ce8
	})
	material.side = THREE.DoubleSide

	/**
	 * Main Material to be applied in all meshes
	 * @type {THREE.Material}
	 */
	this.material = material

	/**
	 * Main Function to be called, destribute functions and do everything
	 * @param {string} Path to a valid json file or a api that returns a valid json
	 */
	this.load = (path) => {
		this.fetchJson(path)
			.then(() => {
				this.obj.name = this.fullData.NAME
				this.handleFaces()
					.then(() => {
						this.handleVertices()
							.then(() => {
								this.handleObjects()
							})
					})
			})
	}

	/**
	 * @param{object} Any kind of THREE Material
	 */
	this.setMaterial = (material) => {
		material.side = THREE.DoubleSide
		this.material = material
	}

	/**
	 * It takes the informed json and save it to this.fullData
	 * @param {string} Path to a valid json file or a api that returns a valid json
	 */
	this.fetchJson = (path) => {

		let init = {
			method: 'GET',
			mode: 'cors',
			cache: 'default'
		}

		return fetch(path, init)
			.catch(error => console.log(error))
			.then((res) => {
				return res.json()
			}).then((res) => {
				this.fullData = res
			})
	}

	/**
	 * Populate the faces internal var
	 */
	this.handleFaces = () => {
		return new Promise(
			(res, rej) => {
				this.faces = this.fullData.F
				if (this.faces.length > 0) {
					delete this.fullData.F
					res(true)
				} else {
					rej(new Error('No Faces Informed'))
				}
			}
		)
	}

	/**
	 * Populate the Vertices internal var
	 */
	this.handleVertices = () => {
		return new Promise(
			(res, rej) => {
				let Points = this.fullData.P
				this.fullData.V.forEach(v => {
					let ind = v.split(',').map(n => parseInt(n))
					let temp = new THREE.Vector3(Points[ind[0]], Points[ind[1]], Points[ind[2]])
					this.vertices.push(temp)
				})
				if (this.vertices.length > 0) {
					delete this.fullData.V
					delete this.fullData.P
					res(true)
				} else
					rej(new Error('No vertices Informed'))
			}
		)
	}

	/**
	 * Make the THREE Objects
	 */
	this.handleObjects = () => {
		this.fullData.O.forEach(object => {
			this.makeObj(object)
		})
	}

	/**
	 * Make the Objects Individually
	 * @param {object} Object extracted from the json
	 */
	this.makeObj = (object) => {
		let obj = new THREE.Mesh()
		obj.name = object.H
		obj.material = this.material
		obj.geometry = this.makeGeometry(this.fullData.M[object.M])
		this.obj.add(obj)
	}

	/**
	 * Make the Geometry of the mesh
	 * @param {object} Object extracted from the json
	 */
	this.makeGeometry = (o) => {
		o.forEach(face => {

		})
	}

}

// TODO: Register the faces as THREE.Face3 in this.faces, easier to handle with them in the makeGeometry, will have to make a triangulate function somewhere

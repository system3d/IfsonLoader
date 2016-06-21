import {
	expect
} from 'chai'
import W3DLoader from '../src/W3DObject'
import fetchMock from 'fetch-mock'
import chaiAsPromised from 'chai-as-promised'

global.W3DLoader = W3DLoader

const jsonChapa = {
	NAME: "chapa.ifc",
	SCHEMA: "IFC2X3",
	APP: "TecnoMETAL",
	G: [8, 1, 2],
	P: [99, 0, 1, 10, 500, 50],
	V: ["0,0,0", "1,1,2", "2,1,1", "1,1,3", "4,1,3", "4,5,3", "1,5,3", "4,1,1", "1,1,1", "1,5,1", "4,5,1"],
	F: [
		[3, 4, 5, 6],
		[7, 8, 9, 10],
		[4, 3, 8, 7],
		[3, 6, 9, 8],
		[6, 5, 10, 9],
		[5, 4, 7, 10]
	],
	O: [{
		M: "#67",
		H: "265",
		T: "CH",
		C: 0,
		D: [1, 2]
	}],
	M: {
		"#67": [0, 1, 2, 3, 4, 5]
	}
}

describe('W3DLoader', () => {
	it('Object Should Exist', () => {
		const w3dloader = new W3DLoader()
		expect(w3dloader).to.exist
	});
});

describe('FetchJson', () => {

	beforeEach(() => {
		fetchMock
			.mock('models/chapa.json', JSON.stringify(jsonChapa))
	});

	afterEach(() => {
		fetchMock.restore();
	});

	it('Should Read the Json', function(done) {
		// this.timeout(10000)
		const w3dloader = new W3DLoader()
		let res = w3dloader.fetchJson('models/chapa.json').then(() => {
			expect(w3dloader.fullData.NAME).to.equal(jsonChapa.NAME)
			done()
		})
	});

})

describe('Loader', () => {

	beforeEach(() => {
		fetchMock
			.mock('models/chapa.json', JSON.stringify(jsonChapa))
	});

	afterEach(() => {
		fetchMock.restore();
	});

	it('Loader should call FetchJson', (done) => {
		const w3dloader = new W3DLoader()
		w3dloader.load('models/chapa.json')
		expect(fetchMock.called('models/chapa.json')).to.be.true;
		done()
	});

	it('Should Populate the Faces var', (done) => {
		const w3dloader = new W3DLoader()
		w3dloader.fetchJson('models/chapa.json')
			.then(() => {
				w3dloader.handleFaces()
					.then(() => {
						expect(w3dloader.faces.length).to.equal(jsonChapa.F.length)
						done()
					})
			})
	})

	it('Should Populate the Vertices var', (done) => {
		const w3dloader = new W3DLoader()
		w3dloader.fetchJson('models/chapa.json')
			.then(() => {
				w3dloader.handleVertices()
					.then(() => {
						expect(w3dloader.vertices.length).to.equal(jsonChapa.V.length)
						done()
					})
			})
	});

	// it('Should Load the Objects', () => {
	// 	const w3dloader = new W3DLoader()
	// 	w3dloader.load('models/chapa.json')
	// 	expect(w3dloader.objects.length).to.equal(jsonChapa.O.length)
	// 	done()
	// });

	it('Should Crate an Object an append it to the main obj', (done) => {
		const w3dloader = new W3DLoader()
		w3dloader.fetchJson('models/chapa.json')
			.then(() => {
				w3dloader.handleVertices()
					.then(() => {
						w3dloader.makeObj(w3dloader.fullData.O[0])
						expect(w3dloader.obj.children[0].name).to.equal(w3dloader.fullData.O[0].H)
						done()
					})
			})

	});



})

describe('Set Material', () => {
	it('Should set the Material', () => {
		const w3dloader = new W3DLoader()
		let material = new THREE.MeshPhongMaterial({
			color: 0x8A007F
		});
		w3dloader.setMaterial(material)
		expect(w3dloader.material).to.exist
	});
});

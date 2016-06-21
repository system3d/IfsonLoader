import {expect} from 'chai'

describe('Mocha', () => {
  it('Should Build test DOM', () => {
    expect(THREE).to.exist
    expect(document).to.exist
    expect(window).to.exist
  }) 
})

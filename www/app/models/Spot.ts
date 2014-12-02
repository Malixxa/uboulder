/// <reference path='../_all.ts' />

/**
* ATTENTION: auto generated file
* changes are overwritten on next run
**/

module app {
    'use strict'

    export class Spot {

        constructor(
			public title: string,
			public active: boolean,
			public address: Address,
			public media: Array<Media>,
			public pricing: Array<Pricing>,
			public infrastructure: Array<string>,
			public id?: string,
			public description?: string,
			public website?: string
        ){}

    }
}

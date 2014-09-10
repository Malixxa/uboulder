/// <reference path='../_all.ts' />
module app {
    'use strict'

    export class Spot {
        constructor(
            public id: string = null,
            public title: string = null,
            public description: string = null,
            public active: boolean = false,
            public address: Address = new Address(),
            public media: Array<Media> = new Array<Media>(),
            public pricing: Array<Pricing> = new Array<Pricing>(),
            public infrastructure: Array<string> = new Array<string>()
            ){}
    }

    export class Position {
        constructor(
            public lat: number = 0,
            public lon: number = 0){}
    }

    export class Address {
    	constructor(
    		public position: Position = new Position(),
            public zip: number = 0,
            public city: string = null){}
    }



    export class Media {
        constructor(
            public url: string = null){}
    }

    export class Pricing {
        constructor(
            public description: string = null,
            public amount: number = 0){}
    }
}

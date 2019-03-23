/*
 *
 * Table of Map Stations & Table of Init Stations (optional).
 *
 * Copyright (c) 2015 It's Raining Bits
 * Email: shaadylaane@gmail.com
 * Licensed under the MIT license
 */
 
 

/*
 * Table of all map station nodes, read out once at init time.
 * Each node contains the following attributes:
 * - lineArray array of the lines passing through the node, and the index position of the node within each line. First position is idx = 1, etc...
 * - pos: x/y/circle size coordinates of the map area (the black station circle) associated to the node.
 * - txtpos: x/y of position of the text input of the node in the map.
 * - txtalign: how the text entered in the text input' node is aligned (left, right, or center).
 * - width: width of the node's text input.
 * 
 * Intersection nodes (nodes being on more than one line) are registered only once in the table.
 */

var stationTable = [ 

//idx = 0
//Complete green line
{ lineArray : [ {name: 'Green',   idx: 1},  {name: 'Yellow', idx: 1} , {name: 'Blue', idx: 1}      ], pos: [543,89,20],  txtpos: [25,3.7], txtalign:'center', width: 27, hubType:'Major' },
{ lineArray : [ {name: 'Green', idx: 2},  {name: 'Yellow',  idx: 15}                               ], pos: [752,89,13],  txtpos: [54.7,4.4], txtalign:'left', width: 30, hubType:'Minor' },
{ lineArray : [ {name: 'Green',  idx: 3}                                                           ], pos: [913,104,10], txtpos: [66.6,7.8],txtalign:'left', width: 25, hubType:'None' },
{ lineArray : [ {name: 'Green',  idx: 4},  {name: 'Brown', idx: 7}                                 ], pos: [923,247,13], txtpos: [67,18.4],txtalign:'left', width: 25, hubType:'Minor' },
{ lineArray : [ {name: 'Green',  idx: 5}                                                           ], pos: [922,323,10], txtpos: [67,28],txtalign:'left', width: 14, hubType:'None' },
{ lineArray : [ {name: 'Green',  idx: 6}                                                           ], pos: [922,408,10], txtpos: [67,35.7],txtalign:'left', width: 14, hubType:'None' },
{ lineArray : [ {name: 'Green',  idx: 7}                                                           ], pos: [922,494,10], txtpos: [67,43.5],txtalign:'left', width: 14, hubType:'None' },
{ lineArray : [ {name: 'Green',  idx: 8},  {name: 'PetrolBlue', idx: 8}                            ], pos: [928,571,20], txtpos: [67.5,48.3],txtalign:'left', width: 13.5, hubType:'Major' },
{ lineArray : [ {name: 'Green',  idx: 9},  {name: 'PetrolBlue', idx: 7}                            ], pos: [928,647,13], txtpos: [66.5,60],txtalign:'left', width: 9, hubType:'Minor' },
{ lineArray : [ {name: 'Green',  idx: 10}                                                          ], pos: [922,792,10], txtpos: [67,70.5],txtalign:'left', width: 14, hubType:'None' },
{ lineArray : [ {name: 'Green',  idx: 11}, {name: 'Brown', idx: 15}                                ], pos: [923,940,13], txtpos: [56,86.5],txtalign:'center', width: 16, hubType:'Minor' },
{ lineArray : [ {name: 'Green',  idx: 12}, {name: 'Brown', idx: 16}, {name: 'Pink', idx: 10}       ], pos: [703,939,20], txtpos: [46,86.7],txtalign:'center', width: 8, hubType:'Major' },

//idx = 12
//PetrolBlue line minus green line
{ lineArray : [ {name: 'PetrolBlue',   idx: 1}                                                     ], pos: [276,694,10],  txtpos: [1,64], txtalign:'right', width: 21, hubType:'None' },
{ lineArray : [ {name: 'PetrolBlue',   idx: 2},  {name: 'Blue', idx: 6}                            ], pos: [353,665,13],  txtpos: [1.5,57.4], txtalign:'right', width: 21, hubType:'Minor' },
{ lineArray : [ {name: 'PetrolBlue',   idx: 3},  {name: 'Yellow', idx: 5}                          ], pos: [449,571,13],  txtpos: [24.6,48.3], txtalign:'right', width: 6.5, hubType:'Minor' },
{ lineArray : [ {name: 'PetrolBlue',   idx: 4},  {name: 'Pink', idx: 6}                            ], pos: [581,642,20],  txtpos: [39.7,60], txtalign:'left', width: 9.5, hubType:'Major'},
{ lineArray : [ {name: 'PetrolBlue',   idx: 5},  {name: 'Yellow', idx: 9} , {name: 'Pink', idx: 7} ], pos: [709,642,20],  txtpos: [51.6,60], txtalign:'left', width: 13.5, hubType:'Major' },
{ lineArray : [ {name: 'PetrolBlue',   idx: 6}                                                     ], pos: [818,647,10],  txtpos: [52.5,55], txtalign:'center', width: 12.5, hubType:'None' },
{ lineArray : [ {name: 'PetrolBlue',   idx: 9},  {name: 'Brown', idx: 13}                          ], pos: [1151,704,13],  txtpos: [83.5,62.5], txtalign:'left', width: 16, hubType:'Minor' },

//idx = 19
//Blue line minus green, PetrolBlue lines
{ lineArray : [ {name: 'Blue',   idx: 2},  {name: 'Brown', idx: 2}                                 ], pos: [406,226,13],  txtpos: [16.3,18.6], txtalign:'right', width: 11, hubType:'Minor' },
{ lineArray : [ {name: 'Blue',   idx: 3},  {name: 'Pink', idx: 2}                                  ], pos: [350,283,13],  txtpos: [12,25], txtalign:'right', width: 11, hubType:'Minor' },
{ lineArray : [ {name: 'Blue',   idx: 4}                                                           ], pos: [333,420,10],  txtpos: [4.5,36.5], txtalign:'right', width: 18, hubType:'None' },
{ lineArray : [ {name: 'Blue',   idx: 5}                                                           ], pos: [333,535,10],  txtpos: [4.5,47], txtalign:'right', width: 18, hubType:'None' },
{ lineArray : [ {name: 'Blue',   idx: 7}                                                           ], pos: [409,794,10],  txtpos: [7.8,70.5], txtalign:'right', width: 20, hubType:'None' },
{ lineArray : [ {name: 'Blue',   idx: 8}                                                           ], pos: [465,922,10],  txtpos: [22.5,80], txtalign:'right', width: 9.5, hubType:'None' },
{ lineArray : [ {name: 'Blue',   idx: 9},  {name: 'Brown', idx: 18}                                ], pos: [466,1016,13],  txtpos: [14.5,93.3], txtalign:'right', width: 20, hubType:'Minor' },


//idx = 26
//Pink minus green, PetrolBlue, blue lines
{ lineArray : [ {name: 'Pink',   idx: 1}                                                           ], pos: [123,248,13],  txtpos: [0,18.4], txtalign:'right', width: 10, hubType:'None' },
{ lineArray : [ {name: 'Pink',   idx: 3}                                                           ], pos: [437,372,10],  txtpos: [31,30], txtalign:'left', width: 6.5, hubType:'None' },
{ lineArray : [ {name: 'Pink',   idx: 4},  {name: 'Yellow', idx: 4}                                ], pos: [536,470,13],  txtpos: [39.7,41.3], txtalign:'left', width: 9.8, hubType:'Minor' },
{ lineArray : [ {name: 'Pink',   idx: 5}                                                           ], pos: [543,571,10],  txtpos: [39.7,50.5], txtalign:'left', width: 9.8, hubType:'None' },
{ lineArray : [ {name: 'Pink',   idx: 8},  {name: 'Yellow', idx: 8}                                ], pos: [708,768,16],  txtpos: [52,68], txtalign:'left', width: 12.5, hubType:'Minor' },
{ lineArray : [ {name: 'Pink',   idx: 9},  {name: 'Yellow', idx: 7}                                ], pos: [709,858,13],  txtpos: [51.8,76.5], txtalign:'left', width: 12.5, hubType:'Minor' },


//idx = 32
//Yellow line minus green, PetrolBlue, blue, pink lines
{ lineArray : [ {name: 'Yellow',   idx: 2},  {name: 'Brown', idx: 3}                               ], pos: [543,248,13],  txtpos: [39.7,23.4], txtalign:'left', width: 12, hubType:'Minor' },
{ lineArray : [ {name: 'Yellow',   idx: 3}                                                         ], pos: [543,360,10],  txtpos: [39.7,30], txtalign:'left', width: 10, hubType:'None' },
{ lineArray : [ {name: 'Yellow',   idx: 6}                                                         ], pos: [561,782,10],  txtpos: [39,66.4], txtalign:'left', width: 9, hubType:'None' },
{ lineArray : [ {name: 'Yellow',   idx: 10}                                                        ], pos: [714,582,10],  txtpos: [51.9,50.1], txtalign:'left', width: 11, hubType:'None' },
{ lineArray : [ {name: 'Yellow',   idx: 11}                                                        ], pos: [714,500,10],  txtpos: [51.9,43], txtalign:'left', width: 11, hubType:'None' },
{ lineArray : [ {name: 'Yellow',   idx: 12}                                                        ], pos: [714,420,10],  txtpos: [51.9,35.6], txtalign:'left', width: 11, hubType:'None' },
{ lineArray : [ {name: 'Yellow',   idx: 13}                                                        ], pos: [753,324,10],  txtpos: [54.4,30], txtalign:'left', width: 9, hubType:'None' },
{ lineArray : [ {name: 'Yellow',   idx: 14},  {name: 'Brown', idx: 5}                              ], pos: [752,248,13],  txtpos: [54.3,24], txtalign:'left', width: 9, hubType:'Minor' },

//idx = 40
//Brown line minus green, PetrolBlue, blue, pink, yellow lines
{ lineArray : [ {name: 'Brown',   idx: 1}                                                          ], pos: [276,94,13],  txtpos: [4,4.7], txtalign:'right', width: 17, hubType:'None' },
{ lineArray : [ {name: 'Brown',   idx: 4}                                                          ], pos: [648,248,10],  txtpos: [41.5,18.5], txtalign:'center', width: 9, hubType:'None' },
{ lineArray : [ {name: 'Brown',   idx: 6}                                                          ], pos: [838,248,10],  txtpos: [55,18.5], txtalign:'center', width: 9, hubType:'None' },
{ lineArray : [ {name: 'Brown',   idx: 8}                                                          ], pos: [1143,257,10],  txtpos: [83,22], txtalign:'left', width: 16, hubType:'None' },
{ lineArray : [ {name: 'Brown',   idx: 9}                                                          ], pos: [1152,342,10],  txtpos: [83.5,29.5], txtalign:'left', width: 16, hubType:'None' },
{ lineArray : [ {name: 'Brown',   idx: 10}                                                         ], pos: [1152,438,10],  txtpos: [83.5,38.2], txtalign:'left', width: 16, hubType:'None' },
{ lineArray : [ {name: 'Brown',   idx: 11}                                                         ], pos: [1152,534,10],  txtpos: [83.5,46.8], txtalign:'left', width: 16, hubType:'None' },
{ lineArray : [ {name: 'Brown',   idx: 12}                                                         ], pos: [1152,629,10],  txtpos: [83.5,55.5], txtalign:'left', width: 16, hubType:'None' },
{ lineArray : [ {name: 'Brown',   idx: 14}                                                         ], pos: [1027,935,10],  txtpos: [74,85.2], txtalign:'left', width: 18, hubType:'None'},
{ lineArray : [ {name: 'Brown',   idx: 17}                                                         ], pos: [543,1016,10],  txtpos: [39.1,93], txtalign:'left', width: 18, hubType:'None' },
{ lineArray : [ {name: 'Brown',   idx: 19}                                                         ], pos: [219,902,13],  txtpos: [4,83], txtalign:'right', width: 14, hubType:'None' },

];


/*
 * Table of all artists loaded and positioned on the map upon
 * very first page load. This table is optional and can be removed
 * if such an initialization is not desired.
 */
var initTable = [ 
    { stationIdx: 2,  artist: "Autechre",                focus: 0 },
    { stationIdx: 12, artist: "Beach House",             focus: 0 },
    { stationIdx: 21, artist: "Frédéric Chopin",         focus: 0 },    
    { stationIdx: 26, artist: "Céline Dion",             focus: 0 },
    { stationIdx: 36, artist: "Radiohead",               focus: 1 },
    { stationIdx: 43, artist: "Sufjan Stevens",          focus: 0 }
    
];

    

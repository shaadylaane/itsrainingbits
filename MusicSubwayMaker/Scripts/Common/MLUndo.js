/*
 *
 * Multi-Layer Undo Module.
 *
 * Copyright (c) 2015 It's Raining Bits
 * Email: shaadylaane@gmail.com
 * Licensed under the MIT license
 */
 
 

var MLUndo = (function ( ) {
                
    /* Multi-layer undo stack */
    var undoStack = [];
    
    /* Top of the stack */
    var tbuf = [];
    
    var TIME_THRESHOLD = 500; /* 0,5 second */

    var lastDate = 0;

    /* Add an object to a temporary buffer, provided that it can present
    a valid "undo" (buffer/restore) attribute. This buffer will be added
    to the top of the stack once the function MLUndo.push() is invoked.
    - undo.buffer shall be an array of the data to buffer
    - undo.restore shall be a function defining how the buffered data shall be restored,
    when the undo command is called */
    var push = function ( object ) {

        if ( object.undo && object.undo.buffer && object.undo.restore )
        {
            var currDate = Date.now();
        
            if (!lastDate) lastDate = currDate; 
        
            if( currDate - lastDate > TIME_THRESHOLD && tbuf.length > 0 )
            {
                /* Time between two successive pushes is pretty big,
                so push the temporary buffer to the top of the undo stack,
                and empty this buffer. */
                undoStack.push( tbuf );
                tbuf = [];              
            }

            tbuf.push( object.undo );

            lastDate = currDate;
        }        
        
    }



    /* Undo the top entry of the stack. Concretely, the "restore" function of all objects
    stored in the top entry will be invoked. Eventually, the top entry is removed */
    var undo = function ( ) {
    
        /* first off flush the temporary buffer if not empty */
        if ( tbuf.length > 0 )
        {
            _restoreEntry( tbuf );
            tbuf = [];
                    
        } else
        {   
            var len = undoStack.length;
            if ( len > 0 )
            {
                _restoreEntry( undoStack[len-1] );
                undoStack.pop( );
            }
        }
    }


    var _restoreEntry = function ( entry ) {
    
        for (var i = 0; i < entry.length; i++ ) entry[i].restore( entry[i].buffer);
    
    }
    

    return {
        push: push,
        undo: undo              
    };

})();
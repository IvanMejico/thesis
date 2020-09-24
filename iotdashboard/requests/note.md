# NOTES
1. Codes in this directory will be used by the microcontrollers to submit data to the database server.
2. Elephant.io will be implemented in this directory.
    TODO:
        1. Install composer.
        2. Install Elephant.io (setup socket.io in the assets/js/core directory make it listen to a port that Elephant.io instance will be submitting into)
        3. Element sockets with tabs first battery status next then rewrite the code for charts.
        4. Make sure if everything is working. Then and only then the system will be restructured to implement MVC.

Not entirely sure how MVC will be implemented on this one. More likely stemming from the acl but I got some idea, not sure if it's going to be ideal or not. But I guess ideal is not yet that important. I'm going to move forward with what I think currently makes sense and build upon it through time. MVC is going to take a lot of time so will make it a point to make sure everthing is working first with the current structure and technologies (socket) before trying to implement it. Build on top of things and make things
gradually better.

Will probably rename php files in this directory when MVC is finally implemented. Change them to correspond to specific class name.

*** MVC Implementation will have to hold until everything's okay. It will take considerable efforts to overhaul everything. ***


SOCKET EVENTS
Components that are being updated:
 - Toggle    -> loadlist_update 
 - LED       -> loadlist_update
 - Battery   -> battery_update
Components that are being inserted
 - LED       -> loadlist_insert
 - Battery   -> loadlist insert
Components that are being deleted
 - LED       -> loadlist_delete
 - Battery   -> loadlist delete

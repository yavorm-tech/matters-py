from models import db, PushEvents,Commits,ModifiedFiles
import pdb
def addPushEvent(**kwargs):
    params = {}
    
    pdb.set_trace();
    for index,value in kwargs.items():
        params.update({index:value})
        
    create_push_event = PushEvents(params)
    db.add(create_push_event);
    


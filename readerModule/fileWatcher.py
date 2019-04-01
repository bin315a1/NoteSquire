import inotify.adapters
import a_imageReader as ir
import re

def _main():
    notifier_1=inotify.adapters.Inotify()
    notifier_1.add_watch('./temp')

#    notifier_2=inotify.adapters.Inotify()
#   notifier_2.add_watch('./temp2')
    
    for event in notifier_1.event_gen():
        if event is not None:
            if 'IN_CREATE' in event[1]:
                #print("CREATION!!")
                #print(event[3])
                print("outer print")
                if re.search("^.*\.(jpg|png|JPG)$", event[3]):
                    print("called")
                    ir.imageReader("./temp/"+event[3])
_main()

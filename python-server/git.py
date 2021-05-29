from os import pipe
from subprocess import Popen, PIPE

def getCurrentDriveLetter():
    try:
        pipe = Popen("echo %CD:~0,1%", shell=True, stdout=PIPE)
        res = pipe.communicate()[0].decode('utf-8')
        return res
    except Exception as exception:
        print(exception)


def executeCommandBatch(commandBatch):
    print(' & '.join(commandBatch))
    pipe = Popen(' & '.join(commandBatch), shell=True, stdout=PIPE)
    res = pipe.communicate()[0].decode('utf-8')
    print(res)
    return res


def gitStart(projectPath, commandBatch):
    commandBatch.insert(0, 'cd ' + projectPath)
    
    currentDriveLetter = getCurrentDriveLetter()
    currentDriveLetter = currentDriveLetter.strip()

    if (projectPath[0] != currentDriveLetter):
        commandBatch.insert(0, projectPath[0] + ':')

    executeCommandBatch(commandBatch)

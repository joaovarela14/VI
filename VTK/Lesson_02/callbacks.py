from vtkmodules.all import *

##############################
# Callback for the interaction
##############################
class vtkMyCallback(object):
    def __init__(self, renderer):
        self.ren = renderer

    def __call__(self, caller, ev):
        # Just do this to demonstrate who called callback and the event that triggered it.
        print(caller.GetClassName(), 'Event Id:', ev)
        # Now print the camera position.
        print("Camera Position: %f, %f, %f" % (self.ren.GetActiveCamera().GetPosition()[0],
                                                 self.ren.GetActiveCamera().GetPosition()[1],
                                                 self.ren.GetActiveCamera().GetPosition()[2]))

def main():
    # Create a cone
    cone = vtkConeSource()
    cone.SetHeight(3.0)
    cone.SetRadius(1.0)
    cone.SetResolution(10)
    
    # Create a mapper
    coneMapper = vtkPolyDataMapper()
    coneMapper.SetInputConnection(cone.GetOutputPort())
    
    # Create an actor
    coneActor = vtkActor()
    coneActor.SetMapper(coneMapper)
    coneActor.GetProperty().SetColor(0.2, 0.63, 0.79)
    
    # Create the renderer
    ren = vtkRenderer()
    ren.AddActor(coneActor)
    ren.SetBackground(0.1, 0.2, 0.4)
    
    # Create the render window
    renWin = vtkRenderWindow()
    renWin.AddRenderer(ren)
    renWin.SetSize(640, 480)
    renWin.SetWindowName("Cone with Callbacks")
    
    # Create the interactor
    iren = vtkRenderWindowInteractor()
    iren.SetRenderWindow(renWin)
    
    ################################################################
    # Here is where we setup the observer
    mo1 = vtkMyCallback(ren)
    ren.AddObserver(vtkCommand.AnyEvent, mo1)
    # Try different event types:
    # vtkCommand.EndEvent
    # vtkCommand.StartEvent
    # vtkCommand.ResetCameraEvent
    ################################################################
    
    iren.Initialize()
    iren.Start()

if __name__ == "__main__":
    main()

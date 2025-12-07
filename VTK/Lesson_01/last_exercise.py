###############################################################################
#       						Properties and Lighting
###############################################################################

# This example demonstrates multiple colored lights pointing towards the origin.
# Small spheres represent each light position and are not affected by lighting.
# The pipeline includes a function to avoid code repetition.

# Imports

# Import all VTK modules
from vtkmodules.all import *

def create_light_with_sphere(renderer, color, position):
    # We create an instance of vtkLight and set its color and position.
    # The light points towards the origin (0,0,0) to illuminate the center object.
    
    light = vtkLight()
    light.SetColor(color[0], color[1], color[2])
    light.SetPosition(position[0], position[1], position[2])
    light.SetFocalPoint(0, 0, 0)
    renderer.AddLight(light)
    
    # We create a small sphere to visually represent the light position.
    # This sphere uses SetLighting(False) so its color is not affected by other lights.
    
    lightSphereSource = vtkSphereSource()
    lightSphereSource.SetRadius(0.5)
    lightSphereSource.SetPhiResolution(20)
    lightSphereSource.SetThetaResolution(20)
    
    lightSphereMapper = vtkPolyDataMapper()
    lightSphereMapper.SetInputConnection(lightSphereSource.GetOutputPort())
    
    lightSphereActor = vtkActor()
    lightSphereActor.SetMapper(lightSphereMapper)
    lightSphereActor.SetPosition(position[0], position[1], position[2])
    lightSphereActor.GetProperty().SetColor(color[0], color[1], color[2])
    lightSphereActor.GetProperty().SetLighting(False)
    
    renderer.AddActor(lightSphereActor)

def main():

    # We create an instance of vtkConeSource at the center to observe
    # the lighting effects from the multiple colored lights.
    
    coneSource = vtkConeSource()
    coneSource.SetHeight(2)
    coneSource.SetRadius(1)
    coneSource.SetResolution(100)
    
    # We create an instance of vtkPolyDataMapper to map the polygonal data
    # into graphics primitives. We connect the output of the cone source
    # to the input of this mapper.
    
    coneMapper = vtkPolyDataMapper()
    coneMapper.SetInputConnection( coneSource.GetOutputPort() )

    # We create an actor to represent the cone. The actor orchestrates rendering
    # of the mapper's graphics primitives. An actor also refers to properties
    # via a vtkProperty instance, and includes an internal transformation
    # matrix. We set this actor's mapper to be coneMapper which we created
    # above.
    
    coneActor = vtkActor()
    coneActor.SetMapper(coneMapper)

    # Esfera
    
    # sphereSource = vtkSphereSource()
    # sphereSource.SetRadius(2)
    # sphereSource.SetPhiResolution(100)
    # sphereSource.SetThetaResolution(100)
    
    # sphereMapper = vtkPolyDataMapper()
    # sphereMapper.SetInputConnection( sphereSource.GetOutputPort() )
    
    # sphereActor = vtkActor()
    # sphereActor.SetMapper(sphereMapper)

    # Create the Renderer and assign actors to it. A renderer is like a
    # viewport. It is part or all of a window on the screen and it is
    # responsible for drawing the actors it has.  We also set the background
    # color here.
    
    ren = vtkRenderer()
    ren.SetBackground(0, 0, 0)
    

    # luzes do readme
    create_light_with_sphere(ren, (1, 0, 0), (-5, 0, 0))  # Red light
    create_light_with_sphere(ren, (0, 1, 0), (0, 0, -5))  # Green light
    create_light_with_sphere(ren, (0, 0, 1), (5, 0, 0))   # Blue light
    create_light_with_sphere(ren, (1, 1, 0), (0, 0, 5))   # Yellow light
    
    ren.AddActor( coneActor )
    
    # Finally we create the render window which will show up on the screen.
    # We put our renderer into the render window using AddRenderer. We also
    # set the size to be 300 pixels by 300.
    
    renWin = vtkRenderWindow()
    renWin.AddRenderer(ren)
    renWin.SetSize(500,500)

    renWin.SetWindowName('Last Exercise')
    # Adds a render window interactor to the example to
    # enable user interaction (e.g. to rotate the scene)
    
    iren = vtkRenderWindowInteractor()
    iren.SetRenderWindow(renWin)
    iren.Initialize()
    iren.Start()

if __name__ == '__main__':
    main()

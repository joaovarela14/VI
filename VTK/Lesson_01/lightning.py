###############################################################################
#       						Cone.py
###############################################################################

# This example creates a polygonal model of a Cone e visualize the results in a
# VTK render window.
# The program creates the cone, rotates it 360º and closes
# The pipeline  source -> mapper -> actor -> renderer  is typical 
# and can be found in most VTK programs

# Imports

# Import all VTK modules
from vtkmodules.all import *

def main():

    coneSource = vtkConeSource()
    coneSource.SetHeight(2)
    coneSource.SetRadius(1)
    coneSource.SetResolution(100)
    
    coneMapper = vtkPolyDataMapper()
    coneMapper.SetInputConnection(coneSource.GetOutputPort())
  
    coneActor = vtkActor()
    coneActor.SetMapper(coneMapper)
    coneActor.SetPosition(-3, 0, 0)  # Left


    # Sphere

    sphereSource = vtkSphereSource()
    sphereSource.SetRadius(2)
    sphereSource.SetPhiResolution(100)
    sphereSource.SetThetaResolution(100)

    sphereMapper = vtkPolyDataMapper()
    sphereMapper.SetInputConnection(sphereSource.GetOutputPort())

    sphereActor = vtkActor()
    sphereActor.SetMapper(sphereMapper)
    sphereActor.SetPosition(3, 0, 0)  # Right

    # Cylinder
    
    cylinderSource = vtkCylinderSource()
    cylinderSource.SetRadius(2)
    cylinderSource.SetHeight(3)
    cylinderSource.SetResolution(100)

    cylinderMapper = vtkPolyDataMapper()
    cylinderMapper.SetInputConnection(cylinderSource.GetOutputPort())

    cylinderActor = vtkActor()
    cylinderActor.SetMapper(cylinderMapper)
    cylinderActor.SetPosition(0, 0, -3)  # Behind

    # Create a cube source
    cubeSource = vtkCubeSource()
    
    cubeMapper = vtkPolyDataMapper()
    cubeMapper.SetInputConnection(cubeSource.GetOutputPort())
    
    cubeActor = vtkActor()
    cubeActor.SetMapper(cubeMapper)
    cubeActor.SetPosition(0, 0, 3)  # In front


    ren = vtkRenderer()
    ren.SetBackground(1,1,1)
    
    # Multiple colored lights from different positions
    # Red light from left
    light1 = vtkLight()
    light1.SetColor(1, 0, 0)
    light1.SetPosition(-10, 5, 5)
    light1.SetFocalPoint(0, 0, 0)
    ren.AddLight(light1)
    
    # Green light from right
    light2 = vtkLight()
    light2.SetColor(0, 1, 0)
    light2.SetPosition(10, 5, 5)
    light2.SetFocalPoint(0, 0, 0)
    ren.AddLight(light2)
    
    # Blue light from top
    light3 = vtkLight()
    light3.SetColor(0, 0, 1)
    light3.SetPosition(0, 10, 0)
    light3.SetFocalPoint(0, 0, 0)
    ren.AddLight(light3)
    
    # Yellow light from front
    light4 = vtkLight()
    light4.SetColor(1, 1, 0)
    light4.SetPosition(0, 0, 10)
    light4.SetFocalPoint(0, 0, 0)
    ren.AddLight(light4)
    
    ren.AddActor(coneActor)
    ren.AddActor(sphereActor)
    ren.AddActor(cylinderActor)
    ren.AddActor(cubeActor)
    

    renWin = vtkRenderWindow()
    renWin.AddRenderer(ren)
    renWin.SetSize(300,300)  # Window size
    renWin.SetWindowName('Lighting Example')

    iren = vtkRenderWindowInteractor()
    iren.SetRenderWindow(renWin)
    iren.Initialize()
    iren.Start()

if __name__ == '__main__':
    main()

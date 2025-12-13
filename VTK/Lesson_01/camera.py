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


    # Sphere

    sphereSource = vtkSphereSource()
    sphereSource.SetRadius(2)
    sphereSource.SetPhiResolution(100)
    sphereSource.SetThetaResolution(100)

    sphereMapper = vtkPolyDataMapper()
    sphereMapper.SetInputConnection(sphereSource.GetOutputPort())

    sphereActor = vtkActor()
    sphereActor.SetMapper(sphereMapper)

    # Cylinder
    
    cylinderSource = vtkCylinderSource()
    cylinderSource.SetRadius(2)
    cylinderSource.SetHeight(3)
    cylinderSource.SetResolution(100)

    cylinderMapper = vtkPolyDataMapper()
    cylinderMapper.SetInputConnection(cylinderSource.GetOutputPort())

    cylinderActor = vtkActor()
    cylinderActor.SetMapper(cylinderMapper)


    ren = vtkRenderer()
    ren.SetBackground(1,1,1)
    
    #cam1 = vtkCamera()

    cam1 = ren.GetActiveCamera()
    cam1.SetPosition(10,10,0)
    cam1.SetViewUp(0,1,1)
    # Set orthographic projection
    cam1.SetParallelProjection(True)
    
    # Create a cube source
    cubeSource = vtkCubeSource()
    
    cubeMapper = vtkPolyDataMapper()
    cubeMapper.SetInputConnection(cubeSource.GetOutputPort())
    
    cubeActor = vtkActor()
    cubeActor.SetMapper(cubeMapper)
    # cubeActor.GetProperty().SetRepresentationToWireframe()
    
    # ren.AddActor(coneActor)
    # ren.AddActor(sphereActor)
    # ren.AddActor(cylinderActor)
    ren.AddActor(cubeActor) # Other objects are commented to show only the cube
    

    renWin = vtkRenderWindow()
    renWin.AddRenderer(ren)
    renWin.SetSize(300,300)  # Window size
    renWin.SetWindowName('Lesson 1')

    iren = vtkRenderWindowInteractor()
    iren.SetRenderWindow(renWin)
    iren.Initialize()
    iren.Start()

if __name__ == '__main__':
    main()

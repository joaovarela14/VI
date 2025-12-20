###############################################################################
#       						Cone.py
###############################################################################

# This example creates a polygonal model of a Cone e visualize the results in a
# VTK render window.
# The program creates the cone, rotates it 360º and closes
# The pipeline  source -> mapper -> actor -> renderer  is typical 
# and can be found in most VTK programs

# Import all VTK modules
from vtkmodules.all import *

# Import only needed modules
# import vtkmodules.vtkInteractionStyle
# import vtkmodules.vtkRenderingOpenGL2
# from vtkmodules.vtkFiltersSources import vtkConeSource
# from vtkmodules.vtkRenderingCore import (
#     vtkActor,
#     vtkPolyDataMapper,
#     vtkRenderWindow,
#     vtkRenderWindowInteractor,
#     vtkRenderer
# )

def main():

    # We Create an instance of vtkSphereSource and set some of its
    # properties. The instance of vtkSphereSource "sphere" is part of a
    # visualization pipeline (it is a source process object); it produces data
    # (output type is vtkPolyData) which other filters may process.
    
    sphereSource = vtkSphereSource()
    sphereSource.SetRadius(2.0)
    sphereSource.SetThetaResolution(10)
    sphereSource.SetPhiResolution(10)
    
    # We create an instance of vtkPolyDataMapper to map the polygonal data
    # into graphics primitives. We connect the output of the sphere source 
    # to the input of this mapper.
  
    sphereMapper = vtkPolyDataMapper()
    sphereMapper.SetInputConnection( sphereSource.GetOutputPort() )

    # Create 4 actors with different shading options
    
    # Actor 1 - Default shading (no explicit interpolation set)
    sphereActor1 = vtkActor()
    sphereActor1.SetMapper(sphereMapper)
    property1 = vtkProperty()
    property1.SetDiffuse(0.7)
    property1.SetSpecular(0.4)
    property1.SetSpecularPower(20)
    sphereActor1.SetProperty(property1)
    
    # Actor 2 - Flat shading
    sphereActor2 = vtkActor()
    sphereActor2.SetMapper(sphereMapper)
    property2 = vtkProperty()
    property2.SetDiffuse(0.7)
    property2.SetSpecular(0.4)
    property2.SetSpecularPower(20)
    property2.SetInterpolationToFlat()
    sphereActor2.SetProperty(property2)
    
    # Actor 3 - Gouraud shading
    sphereActor3 = vtkActor()
    sphereActor3.SetMapper(sphereMapper)
    property3 = vtkProperty()
    property3.SetDiffuse(0.7)
    property3.SetSpecular(0.4)
    property3.SetSpecularPower(20)
    property3.SetInterpolationToGouraud()
    sphereActor3.SetProperty(property3)
    
    # Actor 4 - Phong shading
    sphereActor4 = vtkActor()
    sphereActor4.SetMapper(sphereMapper)
    property4 = vtkProperty()
    property4.SetDiffuse(0.7)
    property4.SetSpecular(0.4)
    property4.SetSpecularPower(20)
    property4.SetInterpolationToPhong()
    sphereActor4.SetProperty(property4)

    
    ren1 = vtkRenderer()
    ren1.AddActor(sphereActor1)
    ren1.SetBackground(0.8, 0.3, 0.3)  # Light red
    ren1.SetViewport(0.0, 0.5, 0.5, 1.0)
    ren1.GetActiveCamera().SetPosition(0, 10, 8)
    
    ren2 = vtkRenderer()
    ren2.AddActor(sphereActor2)
    ren2.SetBackground(0.3, 0.8, 0.3)  # Light green
    ren2.SetViewport(0.5, 0.5, 1.0, 1.0)
    ren2.GetActiveCamera().SetPosition(0, 10, 8)
    ren2.GetActiveCamera().Azimuth(90)
    
    ren3 = vtkRenderer()
    ren3.AddActor(sphereActor3)
    ren3.SetBackground(0.3, 0.3, 0.8)  # Light blue
    ren3.SetViewport(0.0, 0.0, 0.5, 0.5)
    ren3.GetActiveCamera().SetPosition(0, 10, 8)
    ren3.GetActiveCamera().Azimuth(180)
    
    ren4 = vtkRenderer()
    ren4.AddActor(sphereActor4)
    ren4.SetBackground(0.8, 0.8, 0.3)  # Light yellow
    ren4.SetViewport(0.5, 0.0, 1.0, 0.5)
    ren4.GetActiveCamera().SetPosition(0, 10, 8)
    ren4.GetActiveCamera().Azimuth(270)
    
    
    renWin = vtkRenderWindow()
    renWin.AddRenderer(ren1)
    renWin.AddRenderer(ren2)
    renWin.AddRenderer(ren3)
    renWin.AddRenderer(ren4)

    renWin.SetSize(640, 480)
    renWin.SetWindowName('Shading')

    

    iren = vtkRenderWindowInteractor()
    iren.SetRenderWindow(renWin)
    iren.Initialize()
    iren.Start()


if __name__ == '__main__':
    main()
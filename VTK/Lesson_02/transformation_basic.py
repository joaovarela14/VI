###############################################################################
#       						Transformation Basic
###############################################################################

# This example demonstrates how to use vtkTransformPolyDataFilter
# to apply transformations to a plane

# Import all VTK modules
from vtkmodules.all import *

def main():

    # Create a plane source
    plane = vtkPlaneSource()
    plane.SetOrigin(0.0, 0.0, 0.0)
    plane.SetPoint1(2.0, 0.0, 0.0)
    plane.SetPoint2(0.0, 2.0, 0.0)
    
    # Definition of the transformation (a translation)
    MyTransform = vtkTransform()
    MyTransform.Translate(0, 0, -1)
    
    # Filter definition
    MyFilter = vtkTransformPolyDataFilter()
    
    # Transform and vtkPolyData input to the filter
    MyFilter.SetTransform(MyTransform)
    MyFilter.SetInputConnection(plane.GetOutputPort())
    
    # Create mapper
    planeMapper = vtkPolyDataMapper()
    planeMapper.SetInputConnection(MyFilter.GetOutputPort())
    
    # Create actor
    planeActor = vtkActor()
    planeActor.SetMapper(planeMapper)
    planeActor.GetProperty().SetColor(0.8, 0.3, 0.3)
    
    # Create the Renderer and add the plane actor
    ren = vtkRenderer()
    ren.AddActor(planeActor)
    ren.SetBackground(0.1, 0.2, 0.4)
    
    # Create the render window
    renWin = vtkRenderWindow()
    renWin.AddRenderer(ren)
    renWin.SetSize(800, 600)
    renWin.SetWindowName('Basic Transformation Example')
    
    # Enable user interaction
    iren = vtkRenderWindowInteractor()
    iren.SetRenderWindow(renWin)
    iren.Initialize()
    iren.Start()


if __name__ == '__main__':
    main()

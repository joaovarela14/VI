###############################################################################
#       						Textures.py
###############################################################################

# This example creates a plane with a texture mapped to it
# The pipeline  source -> mapper -> actor -> renderer  is typical 
# and can be found in most VTK programs

# Import all VTK modules
from vtkmodules.all import *

def main():

    # Create an instance of vtkPlaneSource
    # A plane is defined by an origin and two points (Point1 and Point2)
    # that define the two edges of the plane
    
    planeSource = vtkPlaneSource()
    planeSource.SetOrigin(0.0, 0.0, 0.0)
    planeSource.SetPoint1(10.0, 0.0, 0.0)  # Width along X-axis
    planeSource.SetPoint2(0.0, 10.0, 0.0)  # Height along Y-axis
    
    # We create an instance of vtkPolyDataMapper to map the polygonal data
    # into graphics primitives. We connect the output of the plane source 
    # to the input of this mapper.
  
    planeMapper = vtkPolyDataMapper()
    planeMapper.SetInputConnection(planeSource.GetOutputPort())

    # We create an actor to represent the plane. The actor orchestrates rendering
    # of the mapper's graphics primitives. An actor also refers to properties
    # via a vtkProperty instance, and includes an internal transformation
    # matrix. We set this actor's mapper to be planeMapper which we created
    # above.
  
    planeActor = vtkActor()
    planeActor.SetMapper(planeMapper)
    
    # Read the texture image using vtkJPEGReader
    jpegReader = vtkJPEGReader()
    jpegReader.SetFileName("./images/lena.JPG")
    jpegReader.Update()
    
    # Create a texture and map the image to it
    aTexture = vtkTexture()
    aTexture.SetInputConnection(jpegReader.GetOutputPort())
    
    # Apply the texture to the plane actor
    planeActor.SetTexture(aTexture)
    
    # Create the Renderer and assign the textured plane actor to it
    ren = vtkRenderer()
    ren.AddActor(planeActor)
    ren.SetBackground(0.1, 0.2, 0.4)
    
    # Finally we create the render window which will show up on the screen.
    # We put our renderer into the render window using AddRenderer.
    
    renWin = vtkRenderWindow()
    renWin.AddRenderer(ren)

    renWin.SetSize(640, 480)
    renWin.SetWindowName('Textures')

    
    # Adds a render window interactor to enable user interaction 
    # (e.g. to rotate the scene)
    iren = vtkRenderWindowInteractor()
    iren.SetRenderWindow(renWin)
    iren.Initialize()
    iren.Start()


if __name__ == '__main__':
    main()
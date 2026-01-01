from vtkmodules.all import *

def main():

    # Coordinates for the vertices
    coords = [[0, 0, 0], [1, 0, 0], [0.5, 1, 0], [0.5, 0.5, 1]]
    
    #################################
    # VTKUnstructuredGrid Definition
    Ugrid = vtkUnstructuredGrid()
    points = vtkPoints()
    
    # Vertex  
    for i in range(len(coords)):
        points.InsertPoint(i,coords[i])
    
    # Create cells as VTK_VERTEX
    for i in range(len(coords)):  # Create one cell for each vertex
        Ugrid.InsertNextCell(VTK_VERTEX, 1, [i])
    
    # Assign points to the unstructured grid
    Ugrid.SetPoints(points)
    
    # Mapper and actor
    UGridMapper = vtkDataSetMapper()
    UGridMapper.SetInputData(Ugrid)

    UGridActor = vtkActor()
    UGridActor.SetMapper(UGridMapper)

    # Modify actor properties
    UGridActor.GetProperty().SetColor(0, 0, 0)  # Red color
    UGridActor.GetProperty().SetPointSize(5)    # Set point size

    # Creation of renderer, render window, and interactor
    ren1 = vtkRenderer()
    renWin = vtkRenderWindow()
    renWin.AddRenderer(ren1)
    renWin.SetWindowName("UGrid Display")

    iren = vtkRenderWindowInteractor()
    iren.SetRenderWindow(renWin)

    ren1.AddActor(UGridActor)
    ren1.SetBackground(1.0, 0.55, 0.41) 

    # Render and start interaction
    renWin.Render()
    iren.Start()

if __name__ == '__main__':
    main()